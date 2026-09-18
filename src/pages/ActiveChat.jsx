import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MessageInput from '../components/MessageInput';
import { fetchChatHistory, saveChatHistory, sendChat } from '../services/chatbot';

const STORAGE_KEY = 'sekale-chat-history';

function getStorageKey(uid) {
  return uid ? `${STORAGE_KEY}-${uid}` : STORAGE_KEY;
}
const DEFAULT_MESSAGES = [
  {
    role: 'assistant',
    content: 'Hello! I am Sekale. Ask me to explain a concept, draft code, or analyze a document.',
  },
];

function getStoredChat(uid) {
  const storageKey = getStorageKey(uid);
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { id: null, messages: DEFAULT_MESSAGES };
    const parsed = JSON.parse(raw);
    return {
      id: parsed?.id || null,
      messages: Array.isArray(parsed?.messages) && parsed.messages.length ? parsed.messages : DEFAULT_MESSAGES,
    };
  } catch {
    return { id: null, messages: DEFAULT_MESSAGES };
  }
}

function UserBubble({ name = 'DIDIER', time = '10:42 AM', children }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] sm:max-w-[70%]">
        <p className="font-label-caps text-label-caps text-on-surface-variant mb-1.5">
          {name} · {time}
        </p>
        <div className="p-4 rounded-2xl bg-bubble-user border border-[rgba(91,92,226,0.3)] text-on-surface font-body-md text-body-md" style={{ borderRadius: '16px 16px 4px 16px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function AssistantBubble({ children }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] sm:max-w-[88%] w-full">
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-border-soft font-body-md text-body-md text-on-surface" style={{ borderRadius: '16px 16px 16px 4px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ filename = 'file.py', code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-border-soft bg-surface-container-lowest">
      <div className="flex items-center justify-between px-3 py-2 bg-surface-container/70 border-b border-border-soft">
        <span className="flex items-center gap-1.5 text-primary font-label-code text-label-code">
          <span className="material-symbols-outlined text-[14px]">terminal</span>
          {filename}
        </span>
        <button type="button" onClick={copy} className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors font-label-code text-label-code">
          <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'content_copy'}</span>
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <pre className="p-3 sm:p-4 overflow-x-auto text-[13px] leading-6 font-label-code text-on-surface-variant">
        {code}
      </pre>
    </div>
  );
}

export default function ActiveChat() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState(() => getStoredChat(user?.uid).messages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const shouldReset = Boolean(location?.state?.resetChat);
    const initialPrompt = location?.state?.initialPrompt;
    const currentKey = getStorageKey(user?.uid);

    if (shouldReset) {
      setMessages(DEFAULT_MESSAGES);
      setChatId(null);
      setError('');
      setPrompt('');
      localStorage.setItem(currentKey, JSON.stringify({ id: null, messages: DEFAULT_MESSAGES }));
    }

    if (initialPrompt) {
      setPrompt(initialPrompt);
      if (inputRef.current) inputRef.current.focus();
    }
  }, [location, user?.uid]);

  useEffect(() => {
    let cancelled = false;

    async function hydrateHistory() {
      const activeKey = getStorageKey(user?.uid);
      try {
        const remoteChats = user?.uid ? await fetchChatHistory(user.uid) : [];
        if (cancelled || !remoteChats.length) {
          const stored = getStoredChat(user?.uid);
          setMessages(stored.messages);
          setChatId(stored.id);
          return;
        }

        const latest = remoteChats[remoteChats.length - 1];
        const latestMessages = Array.isArray(latest.messages) && latest.messages.length ? latest.messages : DEFAULT_MESSAGES;
        setChatId(latest.id || null);
        setMessages(latestMessages);
        localStorage.setItem(activeKey, JSON.stringify({ id: latest.id || null, messages: latestMessages }));
      } catch {
        const stored = getStoredChat(user?.uid);
        setMessages(stored.messages);
        setChatId(stored.id);
      }
    }

    hydrateHistory();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!messages.length) return;
    localStorage.setItem(getStorageKey(user?.uid), JSON.stringify({ id: chatId, messages }));
  }, [chatId, messages, user?.uid]);

  const persistChat = async (nextMessages, currentChatId = chatId) => {
    const payload = {
      id: currentChatId || `chat-${Date.now()}`,
      title: 'Sekale Chat',
      model: 'gemini-2.5-flash',
      userId: user?.uid || 'guest',
      messages: nextMessages,
    };

    try {
      const saved = await saveChatHistory(payload, user?.uid || 'guest');
      const nextId = saved?.id || payload.id;
      setChatId(nextId);
      localStorage.setItem(getStorageKey(user?.uid), JSON.stringify({ id: nextId, messages: nextMessages }));
      return nextId;
    } catch {
      localStorage.setItem(getStorageKey(user?.uid), JSON.stringify({ id: payload.id, messages: nextMessages }));
      return payload.id;
    }
  };

  const suggest = (t) => {
    setPrompt(t);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSend = async (text) => {
    const value = (text ?? prompt ?? '').trim();
    if (!value) return;

    const newUserMessage = { role: 'user', content: value };
    const nextMessages = [...messages, newUserMessage];
    setMessages(nextMessages);
    setPrompt('');
    setError('');
    setLoading(true);

    try {
      const activeChatId = await persistChat(nextMessages, chatId || null);
      const reply = await sendChat(
        nextMessages.map(({ role, content }) => ({ role, content })),
        { userId: user?.uid || 'guest' },
      );
      const finalMessages = [...nextMessages, { role: 'assistant', content: reply }];
      setMessages(finalMessages);
      await persistChat(finalMessages, activeChatId || chatId || null);
    } catch (err) {
      const fallbackMessages = [
        ...nextMessages,
        {
          role: 'assistant',
          content: 'I could not reach the AI backend right now. Please try again in a moment.',
        },
      ];
      setMessages(fallbackMessages);
      setError(err?.message || 'Unable to contact the AI service.');
      await persistChat(fallbackMessages, chatId || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-background">
      {/* Document context bar */}
      <div className="flex items-center justify-between gap-3 px-space-md sm:px-margin py-3 border-b border-border-soft/60 bg-surface-container-low/40">
        <div className="flex items-center gap-3 min-w-0">
          <span className="material-symbols-outlined text-[22px] text-primary shrink-0">text_snippet</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-title-md text-title-md text-on-surface truncate">Computer_Networks_Intro.pdf</span>
              <span className="px-1.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary font-label-caps text-label-caps shrink-0">Analyzed</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline truncate">2.4 MB • 42 pages parsed • Vectorized into active memory</p>
          </div>
          <button type="button" className="hidden sm:block px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm shrink-0">
            Inspect Vectors
          </button>
        </div>
        <button type="button" className="text-outline hover:text-on-surface shrink-0">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Conversation */}
      <div className="max-w-3xl mx-auto px-space-md py-6 space-y-6">
        {messages.map((message, index) => {
          if (message.role === 'user') {
            return (
              <UserBubble key={`${message.role}-${index}`}>
                {message.content}
              </UserBubble>
            );
          }

          return (
            <AssistantBubble key={`${message.role}-${index}`}>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="material-symbols-outlined text-[18px] text-secondary">psychology</span>
                <span className="font-title-md text-title-md">Sekale Assistant</span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-caps text-label-caps">Thinking Mode</span>
                <span className="font-label-code text-label-code text-outline ml-auto">now</span>
              </div>
              <div className="prose prose-invert max-w-none text-on-surface-variant whitespace-pre-wrap">
                {message.content}
              </div>
            </AssistantBubble>
          );
        })}

        {loading && (
          <AssistantBubble>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] animate-pulse">auto_awesome</span>
              <span>Thinking…</span>
            </div>
          </AssistantBubble>
        )}

        {error && (
          <div className="max-w-3xl mx-auto px-space-md text-danger bg-danger/10 border border-danger/30 rounded-xl p-3">
            {error}
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="max-w-3xl mx-auto px-space-md pb-4 flex flex-wrap justify-center gap-2">
        {[
          { icon: 'manage_search', label: 'Show me neural network code' },
          { icon: 'extension', label: 'Explain it more simply' },
          { icon: 'compare_arrows', label: 'Compare supervised vs unsupervised' },
          { icon: 'bolt', label: 'Give me an example' },
        ].map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => suggest(p.label)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors border border-border-soft/60"
          >
            <span className="material-symbols-outlined text-[14px] text-primary">{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto px-space-md pb-space-lg">
        <MessageInput
          value={prompt}
          onChange={setPrompt}
          onSend={handleSend}
          inputRef={inputRef}
          placeholder="Ask Sekale anything about machine learning or this session..."
        />
        <p className="text-center mt-2 font-label-code text-label-code text-outline text-[11px]">
          Sekale Smart Reasoning v3.4 may generate creative inaccuracies. Verify mission-critical math.
        </p>
      </div>
    </div>
  );
}
