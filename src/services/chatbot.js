// Chatbot service — calls the configured backend API, which keeps the AI key server-side.
// For Render: set VITE_API_BASE_URL=https://your-render-service.onrender.com/api
// For local dev: set VITE_API_BASE_URL=http://localhost:4000/api

const defaultApiBase = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:4000/api'
  : '/api';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || defaultApiBase).replace(/\/$/, '');
const DEFAULT_MODEL = import.meta.env.VITE_AI_MODEL || 'gemini-2.5-flash';

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${path} failed (${res.status})${text ? `: ${text}` : ''}`);
  }

  return res.headers.get('content-length') === '0' ? null : res.json();
}

export async function fetchChatHistory(userId) {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const data = await apiRequest(`/chats${query}`);
    return Array.isArray(data?.chats) ? data.chats : [];
  } catch {
    return [];
  }
}

export async function saveChatHistory(chat, userId) {
  const payload = {
    id: chat?.id || `chat-${Date.now()}`,
    title: chat?.title || 'New Chat',
    model: chat?.model || DEFAULT_MODEL,
    userId: userId || chat?.userId || 'guest',
    messages: Array.isArray(chat?.messages) ? chat.messages : [],
    createdAt: chat?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return apiRequest('/chats', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((data) => data?.chat || payload);
}

export async function deleteChatHistory(chatId, userId) {
  if (!chatId) return false;
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${API_BASE_URL}/chats/${encodeURIComponent(chatId)}${query}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Delete chat failed (${res.status})${text ? `: ${text}` : ''}`);
  }

  return true;
}

/**
 * Send a chat completion request.
 * @param {Array<{role:'system'|'user'|'assistant', content:string}>} messages
 * @param {object} [opts] { model, temperature }
 * @returns {Promise<string>} assistant reply text
 */
export async function sendChat(messages, { model = DEFAULT_MODEL, temperature = 0.7, userId } = {}) {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature,
      userId: userId || 'guest',
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`AI request failed (${res.status})${text ? `: ${text}` : ''}`);
  }

  const data = await res.json();
  return data?.reply ?? '';
}

export { DEFAULT_MODEL };
