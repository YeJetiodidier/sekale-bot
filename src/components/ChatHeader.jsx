import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ModelSelector from './ModelSelector';

export default function ChatHeader({ title = 'Architecture Spec v2', onSelectModel }) {
  const { user, profile } = useAuth();
  const [shareState, setShareState] = useState('idle');
  const displayName = profile?.name || user?.displayName || 'User';
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || 'U';

  const handleShare = async () => {
    const shareUrl = window.location.href || 'https://sekale-bot.web.app';
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 1600);
    } catch {
      window.prompt('Copy this link', shareUrl);
      setShareState('idle');
    }
  };

  return (
    <header className="fixed top-0 left-[260px] right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.2)] z-40 flex items-center justify-between px-space-md">
      <div className="flex items-center gap-space-md">
        <button
          type="button"
          className="md:hidden p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
          <span className="hover:text-on-surface cursor-pointer">Chats</span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-title-md text-title-md truncate max-w-[220px]">{title}</span>
        </div>
        <ModelSelector onSelect={onSelectModel} />
      </div>

      <div className="flex items-center gap-space-sm">
        <div className="hidden lg:flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-container-low text-tertiary text-body-sm font-body-sm">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          <span className="font-label-caps text-label-caps text-on-surface">Encrypted</span>
        </div>
        <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-outline font-label-code text-label-code">
          <span className="text-[11px]">⌘K</span>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 px-space-sm py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm"
        >
          <span className="material-symbols-outlined text-[16px]">{shareState === 'copied' ? 'check' : 'share'}</span>
          <span className="hidden sm:inline">{shareState === 'copied' ? 'Copied' : 'Share'}</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-on-primary-container font-title-md text-title-md font-semibold shrink-0">
          {avatarLetter}
        </div>
      </div>
    </header>
  );
}
