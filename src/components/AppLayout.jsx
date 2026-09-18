import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import Logo from './Logo';

const MOBILE_NAV = [
  { path: '/home', label: 'Home', icon: 'home', end: true },
  { path: '/chat', label: 'Chats', icon: 'chat_bubble' },
  { path: '/explore', label: 'Explore', icon: 'explore' },
  { path: '/files', label: 'Files', icon: 'folder_open' },
  { path: '/projects', label: 'Projects', icon: 'terminal' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
  { path: '/pricing', label: 'Subscription', icon: 'workspace_premium' },
];

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const displayName = profile?.name || user?.displayName || 'User';
  const email = profile?.email || user?.email || 'user@example.com';
  const plan = profile?.plan || 'Free';
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-surface-container-lowest z-[70] flex flex-col justify-between shadow-2xl transition-transform duration-300 md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="h-16 px-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <Logo size={30} />
              <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">Sekale</span>
            </div>
            <button type="button" onClick={() => setMenuOpen(false)} className="text-outline hover:text-on-surface">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <nav className="px-space-sm py-space-xs flex flex-col gap-0.5">
            {MOBILE_NAV.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-space-sm px-space-md py-2 rounded-lg transition-colors font-title-md text-title-md ${
                    isActive ? 'bg-surface-container-high text-on-surface' : 'text-on-surface-variant hover:bg-surface-container'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-space-sm">
          <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-title-md text-title-md font-semibold">{avatarLetter}</div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface leading-tight">{displayName}</span>
                <span className="font-body-sm text-body-sm text-outline leading-tight">{email}</span>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps">{plan}</span>
          </div>
        </div>
      </aside>

      <div className="md:pl-[260px] min-h-screen flex flex-col">
        <AppHeader onMenu={() => setMenuOpen(true)} />
        <div className="flex-1 pt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
