import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deleteChatHistory, fetchChatHistory } from '../services/chatbot';
import Logo from './Logo';

const NAV_ITEMS = [
  { path: '/home', label: 'Home', icon: 'home', end: true },
  { path: '/chat', label: 'Chats', icon: 'chat_bubble' },
  { path: '/explore', label: 'Explore', icon: 'explore' },
  { path: '/files', label: 'Files', icon: 'folder_open' },
  { path: '/projects', label: 'Projects', icon: 'terminal' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
  { path: '/pricing', label: 'Subscription', icon: 'workspace_premium' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [recentChats, setRecentChats] = useState([]);

  const displayName = profile?.name || user?.displayName || 'User';
  const email = profile?.email || user?.email || 'user@example.com';
  const plan = profile?.plan || 'Free';
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || 'U';

  const handleDeleteChat = async (chatId, event) => {
    event?.stopPropagation();
    if (!chatId || !user?.uid) return;

    try {
      await deleteChatHistory(chatId, user.uid);
      setRecentChats((prev) => prev.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error('Failed to delete chat', error);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadRecentChats() {
      if (!user?.uid) {
        setRecentChats([]);
        return;
      }

      try {
        const chats = await fetchChatHistory(user.uid);
        if (!active) return;
        setRecentChats((chats || []).slice(-5).reverse());
      } catch {
        if (!active) return;
        setRecentChats([]);
      }
    }

    loadRecentChats();
    return () => {
      active = false;
    };
  }, [user?.uid]);

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.25)] hidden md:flex">
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {/* Brand */}
        <div className="h-16 px-space-md flex items-center justify-between gap-space-sm">
          <button type="button" onClick={() => navigate('/home')} className="flex items-center gap-space-sm min-w-0 cursor-pointer">
            <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden">
              <Logo size={32} />
            </span>
            <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface truncate">
              Sekale
            </span>
          </button>
          <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps">
            BOT
          </span>
        </div>

        {/* New Chat */}
        <div className="px-space-md pt-space-xs pb-space-sm">
          <button
            type="button"
            onClick={() => navigate('/chat', { state: { resetChat: Date.now() } })}
            className="w-full h-10 px-space-md flex items-center justify-center gap-space-sm rounded-lg bg-primary-container text-on-primary-container font-title-md text-title-md hover:bg-opacity-90 transition-all shadow-[0_0_16px_rgba(91,92,226,0.35)]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-space-md py-space-xs">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-2.5 text-[16px] text-outline pointer-events-none">
              search
            </span>
            <input
              className="w-full h-8 pl-8 pr-space-sm bg-surface-container rounded-lg text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-high transition-colors"
              placeholder="Search chats..."
              type="text"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="px-space-sm py-space-xs flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-md py-2 rounded-lg transition-colors font-title-md text-title-md ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Recent chats */}
        <div className="px-space-md pt-space-sm pb-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
              Recent Chats
            </span>
            <button type="button" className="text-outline hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[14px]">history</span>
            </button>
          </div>
        </div>
        <div className="px-space-sm py-space-xs flex flex-col gap-0.5 flex-1">
          {recentChats.length ? recentChats.map((chat) => {
            const label = chat.title || 'Recent Chat';
            return (
              <div
                key={chat.id || label}
                className="group flex items-center justify-between px-space-md py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer w-full text-left"
              >
                <button type="button" onClick={() => navigate('/chat')} className="flex items-center gap-space-xs min-w-0 flex-1 text-left">
                  <span className="material-symbols-outlined text-[14px] text-outline shrink-0">chat</span>
                  <span className="font-body-sm text-body-sm truncate">{label}</span>
                </button>
                <span className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100">
                  <button type="button" title="Delete chat" onClick={(event) => handleDeleteChat(chat.id, event)} className="p-1 rounded hover:bg-error-container hover:text-error transition-colors" aria-label={`Delete ${label}`}>
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                </span>
              </div>
            );
          }) : (
            <div className="px-space-md py-2 text-body-sm text-body-sm text-outline">
              No recent chats yet.
            </div>
          )}
        </div>
      </div>

      {/* User profile */}
      <div className="p-space-sm bg-surface-container-low">
        <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-sm min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-title-md text-title-md text-on-surface font-semibold">
                {avatarLetter}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(74,225,118,0.6)]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-title-md text-title-md text-on-surface truncate leading-tight">{displayName}</span>
              <span className="font-body-sm text-body-sm text-outline truncate leading-tight">{email}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps">
              {plan}
            </span>
            <button type="button" onClick={() => navigate('/pricing')} className="p-1 text-outline hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[16px]">north_east</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
