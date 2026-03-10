import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function useSession() {
  const [sessionId] = useState(() => {
    const existing = localStorage.getItem("sessionId");
    if (existing) return existing;
    const id = uuidv4();
    localStorage.setItem("sessionId", id);
    return id;
  });

  useEffect(() => {
    if (!localStorage.getItem("sessionId")) {
      localStorage.setItem("sessionId", sessionId);
    }
  }, [sessionId]);

  return sessionId;
}
