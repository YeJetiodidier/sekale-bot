import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function AuthShell({ children, footer = <></> }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-background text-on-surface flex flex-col">
      {/* Top nav */}
      <header className="h-16 flex items-center justify-between px-space-md sm:px-margin border-b border-border-soft/40">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={() => navigate('/signin')} className="flex items-center gap-2 cursor-pointer">
            <Logo size={30} />
            <span className="font-headline-sm text-headline-sm font-semibold text-on-surface whitespace-nowrap">Sekale Bot</span>
          </button>
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-tertiary font-label-caps text-label-caps">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_6px_rgba(74,225,118,0.8)]" />
            Sovereign AI Node
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1 text-outline hover:text-on-surface transition-colors font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[15px]">lock</span>
            <span>256-Bit E2EE</span>
          </div>
          <Link to="/signup" className="hidden lg:flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[15px]">translate</span>
            <span>EN / SWA</span>
          </Link>
          <Link
            to="/signin"
            className="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-title-md text-title-md hover:bg-opacity-90 transition-all shadow-[0_0_14px_rgba(91,92,226,0.35)]"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-title-md text-title-md"
          >
            Register
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-on-primary-container font-title-md text-title-md font-semibold hidden sm:flex">
            D
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-space-md py-space-lg relative overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[360px] bg-gradient-to-b from-primary-container/20 via-secondary-container/10 to-transparent blur-[120px] pointer-events-none" />
        {children}
      </main>

      {/* Footer */}
      <footer className="px-space-md sm:px-margin py-4 border-t border-border-soft/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
        {footer}
      </footer>
    </div>
  );
}
