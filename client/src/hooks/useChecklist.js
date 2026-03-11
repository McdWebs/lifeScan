import { useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { track } from "../utils/analytics";

// Default to '/api' so it proxies correctly to the backend in dev
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export default function useChecklist() {
  const { token } = useAuth();
  const [checklist, setChecklist] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [personalizing, setPersonalizing] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  function authHeaders(extra = {}) {
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...extra };
  }

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollForPersonalization = useCallback(
    (id, originalTasks) => {
      setPersonalizing(true);
      let attempts = 0;
      const maxAttempts = 20;

      function poll() {
        attempts++;
        fetch(`${API_BASE}/checklist/${id}/personalized`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const changed =
              data.tasks?.length !== originalTasks.length ||
              data.tasks?.[0]?.title !== originalTasks[0]?.title ||
              data.tasks?.[0]?.description !== originalTasks[0]?.description;

            if (changed) {
              setChecklist(data);
              setPersonalizing(false);
              return;
            }

            if (attempts < maxAttempts) {
              pollRef.current = setTimeout(poll, 1500);
            } else {
              setPersonalizing(false);
            }
          })
          .catch(() => {
            setPersonalizing(false);
          });
      }

      pollRef.current = setTimeout(poll, 3000);
    },
    [token]
  );

  const generateChecklist = useCallback(
    async (eventType, answers, sessionId) => {
      setLoading(true);
      setError(null);
      stopPolling();
      try {
        const res = await fetch(`${API_BASE}/checklist`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ eventType, answers, sessionId }),
        });
        if (!res.ok) throw new Error("Failed to generate checklist");
        const data = await res.json();
        setChecklist(data);
        track(
          "checklist_generated",
          {
            checklistId: data._id,
            eventType,
            taskCount: data.tasks?.length ?? 0,
          },
          { token }
        );
        pollForPersonalization(data._id, data.tasks);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopPolling, pollForPersonalization, token]
  );

  const generateCustomChecklist = useCallback(
    async (eventDescription, sessionId, eventName, iconKey) => {
      setLoading(true);
      setError(null);
      stopPolling();
      try {
        const res = await fetch(`${API_BASE}/checklist/custom`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ eventDescription, sessionId, eventName, iconKey }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to generate checklist");
        }
        const data = await res.json();
        setChecklist(data);
        // For funnel, treat custom and preset the same at the "checklist_generated" step
        track(
          "checklist_generated",
          {
            checklistId: data._id,
            eventType: "custom",
            taskCount: data.tasks?.length ?? 0,
          },
          { token }
        );
        track(
          "checklist_generated_custom",
          {
            checklistId: data._id,
            eventName,
            taskCount: data.tasks?.length ?? 0,
          },
          { token }
        );
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopPolling, token]
  );

  const fetchChecklist = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/checklist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch checklist");
        const data = await res.json();
        setChecklist(data);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const toggleTask = useCallback(
    async (checklistId, taskIndex, completed) => {
      setChecklist((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, tasks: [...prev.tasks] };
        updated.tasks[taskIndex] = {
          ...updated.tasks[taskIndex],
          completed,
          completedAt: completed ? new Date().toISOString() : null,
        };
        return updated;
      });

      try {
        const res = await fetch(`${API_BASE}/checklist/${checklistId}/tasks`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ taskIndex, completed }),
        });
        if (!res.ok) throw new Error("Failed to update task");
        const data = await res.json();
        setChecklist(data);
        const completedCount = data.tasks?.filter((t) => t.completed).length ?? 0;
        // If this is the first completed task on this checklist, emit a milestone event
        if (completed && completedCount === 1) {
          track(
            "tasks_completed_first_time",
            {
              checklistId,
              totalTasks: data.tasks?.length ?? 0,
            },
            { token }
          );
        }
        track(
          "checklist_task_toggled",
          {
            checklistId,
            taskIndex,
            completed,
            completedCount,
            totalTasks: data.tasks?.length ?? 0,
          },
          { token }
        );
        return data;
      } catch (err) {
        setChecklist((prev) => {
          if (!prev) return prev;
          const reverted = { ...prev, tasks: [...prev.tasks] };
          reverted.tasks[taskIndex] = {
            ...reverted.tasks[taskIndex],
            completed: !completed,
            completedAt: null,
          };
          return reverted;
        });
        setError(err.message);
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  const addTask = useCallback(
    async (checklistId, title, category) => {
      try {
        const res = await fetch(`${API_BASE}/checklist/${checklistId}/tasks`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ title, category }),
        });
        if (!res.ok) throw new Error("Failed to add task");
        const data = await res.json();
        setChecklist(data);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  const deleteChecklist = useCallback(
    async (id) => {
      setHistory((prev) => prev.filter((item) => item._id !== id));
      try {
        const res = await fetch(`${API_BASE}/checklist/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to delete checklist");
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [token]
  );

  const fetchHistory = useCallback(
    async (sessionId) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}/history?sessionId=${encodeURIComponent(sessionId)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return {
    checklist,
    history,
    loading,
    personalizing,
    error,
    generateChecklist,
    generateCustomChecklist,
    fetchChecklist,
    toggleTask,
    addTask,
    fetchHistory,
    deleteChecklist,
    stopPolling,
  };
}
