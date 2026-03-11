import { v4 as uuidv4 } from 'uuid';

// Default to '/api' so local dev proxies correctly to the backend
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

function getSessionId() {
  try {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('sessionId', id);
    }
    return id;
  } catch {
    return null;
  }
}

function getRoute() {
  try {
    return window.location.pathname || null;
  } catch {
    return null;
  }
}

// Fire-and-forget analytics event
export async function track(eventName, properties = {}, options = {}) {
  const { token, version = 'web-1.0.0' } = options;

  if (!eventName) return;

  const payload = {
    eventName,
    sessionId: getSessionId(),
    route: getRoute(),
    source: 'client',
    version,
    properties,
  };

  try {
    await fetch(`${API_BASE}/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Swallow analytics errors – never break UX
  }
}

