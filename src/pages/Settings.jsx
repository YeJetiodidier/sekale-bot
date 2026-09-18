import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-primary-container' : 'bg-surface-container-high'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-on-primary-container/90 transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} style={{ backgroundColor: on ? '#f2efff' : '#908fa0' }} />
    </button>
  );
}

const STYLES = ['Concise', 'Balanced', 'Detailed', 'Creative', 'Code & Math'];
const STYLE_DESC = {
  Concise: 'Brief, atomic, no preamble',
  Balanced: 'Thoughtful, structured & nuanced',
  Detailed: 'Exhaustive academic exposition',
  Creative: 'Unbounded synthesis & narrative',
  'Code & Math': 'Strict syntax, proofs, zero fluff',
};

const ENGINES = [
  { name: 'Deep Reasoning Mode', ver: 'v3.4', badge: 'Deterministic', on: true, color: 'text-secondary', icon: 'psychology', d: 'Traces recursive reasoning for transparent answers and deeper analysis.', meta: 'Latency overhead: ~320ms' },
  { name: 'Live Web & Citation Engine', ver: 'PRO', badge: 'Grounded', on: true, color: 'text-tertiary', icon: 'public', d: 'Uses live references and up-to-date factual grounding when available.', meta: 'Per-query citation: Active' },
  { name: 'Sandboxed Code Kernel', ver: 'SECURE', badge: 'Isolated Core', on: true, color: 'text-primary', icon: 'terminal', d: 'Runs code in a controlled environment with safe execution boundaries.', meta: 'Timeout limit: 15.0s' },
  { name: 'Cross-Session Vault Memory', ver: 'RAG', badge: 'Contextual', on: true, color: 'text-primary-fixed', icon: 'memory', d: 'Keeps context across sessions so the app feels personalized and continuous.', meta: 'Memory index: Active' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const storageKey = (suffix) => (user?.uid ? `sekale-${suffix}-${user.uid}` : `sekale-${suffix}`);
  const [theme, setTheme] = useState(() => localStorage.getItem('sekale-theme') || 'dark');
  const [style, setStyle] = useState(() => localStorage.getItem(storageKey('style')) || 'Balanced');
  const [dynamic, setDynamic] = useState(() => localStorage.getItem(storageKey('dynamic')) !== 'false');
  const [autoDetect, setAutoDetect] = useState(() => localStorage.getItem(storageKey('auto-detect')) !== 'false');
  const [retainLogs, setRetainLogs] = useState(() => localStorage.getItem(storageKey('retain-logs')) !== 'false');
  const [anonOpt, setAnonOpt] = useState(() => localStorage.getItem(storageKey('anon-opt')) === 'true');
  const [engineState, setEngineState] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey('engine-state'));
      return raw ? JSON.parse(raw) : { 0: true, 1: true, 2: true, 3: true };
    } catch {
      return { 0: true, 1: true, 2: true, 3: true };
    }
  });
  const [profileText, setProfileText] = useState(
    () => localStorage.getItem(storageKey('profile-text')) || 'Senior software engineer building practical, production-ready AI systems for modern workflows.',
  );

  const displayName = useMemo(() => profile?.name || user?.displayName || 'User', [profile, user]);
  const email = useMemo(() => profile?.email || user?.email || 'user@example.com', [profile, user]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('sekale-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKey('style'), style);
  }, [style, user?.uid]);

  useEffect(() => {
    localStorage.setItem(storageKey('dynamic'), String(dynamic));
  }, [dynamic, user?.uid]);

  useEffect(() => {
    localStorage.setItem(storageKey('auto-detect'), String(autoDetect));
  }, [autoDetect, user?.uid]);

  useEffect(() => {
    localStorage.setItem(storageKey('retain-logs'), String(retainLogs));
  }, [retainLogs, user?.uid]);

  useEffect(() => {
    localStorage.setItem(storageKey('anon-opt'), String(anonOpt));
  }, [anonOpt, user?.uid]);

  useEffect(() => {
    localStorage.setItem(storageKey('engine-state'), JSON.stringify(engineState));
  }, [engineState, user?.uid]);

  useEffect(() => {
    localStorage.setItem(storageKey('profile-text'), profileText);
  }, [profileText, user?.uid]);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/signin', { replace: true });
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  return (
    <div className="w-full bg-background px-space-md sm:px-margin py-6 max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">System Settings</h1>
          <p className="font-body-md text-body-md text-outline mt-1 max-w-xl">
            Fine-tune your app experience, privacy, and AI behavior for your active account.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-caps text-label-caps">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_6px_rgba(74,225,118,0.7)]" />{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span className="font-label-code text-label-code text-outline">{displayName} · {email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
        <div className="space-y-3">
          <nav className="rounded-xl border border-border-soft bg-surface-container-low p-1.5 flex flex-col gap-0.5">
            {[
              { l: 'General' },
              { l: 'Appearance & Theme', active: true },
              { l: 'AI Preferences' },
              { l: 'Privacy & Data' },
              { l: 'Connected Apps', badge: '1 Active', badgeColor: 'text-primary' },
              { l: 'Security & Keys' },
              { l: 'Notifications' },
            ].map((item) => (
              <button key={item.l} type="button" className={`flex items-center justify-between px-3 py-2 rounded-lg font-title-md text-title-md transition-colors text-left ${item.active ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
                <span>{item.l}</span>
                {item.badge ? <span className={`px-1.5 py-0.5 rounded-full font-label-caps text-label-caps ${item.badgeColor || 'text-outline'}`}>{item.badge}</span> : <span className="text-outline">›</span>}
              </button>
            ))}
          </nav>

          <div className="rounded-xl border border-border-soft bg-surface-container-low p-4">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-outline">Session Status</span>
              <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'conic-gradient(#5b5ce2 84%, #1e1f25 0)' }}>
                <span className="w-6 h-6 rounded-full bg-surface-container-low flex items-center justify-center text-[10px] font-label-code text-label-code">84%</span>
              </span>
            </div>
            <p className="mt-2 font-headline-md text-headline-md text-on-surface">{displayName}</p>
            <p className="font-label-code text-label-code text-outline">{email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-xl border border-border-soft bg-surface-container-low p-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Appearance & theme</h2>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">Switch the interface to match your workspace and comfort.</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setTheme('light')} className={`px-3 py-1.5 rounded-full text-sm font-medium ${theme === 'light' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                  Light
                </button>
                <button type="button" onClick={() => setTheme('dark')} className={`px-3 py-1.5 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}`}>
                  Dark
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border-soft bg-surface-container-low p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Response Style & Persona</h2>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">Tailor how the assistant replies to your work patterns.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Dynamic Modulation</span>
                <Toggle on={dynamic} onChange={setDynamic} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
              {STYLES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStyle(item)}
                  className={`rounded-lg border p-3 text-left transition-colors ${item === style ? 'border-primary-container bg-primary-container/10' : 'border-border-soft bg-surface-container'}`}
                >
                  <p className={`font-title-md text-title-md ${item === style ? 'text-on-surface' : 'text-on-surface-variant'}`}>{item}</p>
                  <p className="mt-1 font-body-sm text-body-sm text-outline">{STYLE_DESC[item]}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border-soft bg-surface-container-low p-5">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Autonomous Directives</h2>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">This profile is saved to your active account and used to personalize future sessions.</p>
            <textarea
              value={profileText}
              onChange={(event) => setProfileText(event.target.value)}
              className="mt-3 w-full h-28 p-3 rounded-xl bg-surface-container border border-border-soft text-on-surface font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container transition-colors resize-none"
            />
            <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5 font-label-caps text-label-caps text-tertiary">
                <span className="material-symbols-outlined text-[15px]">cloud_done</span>Profile synced to your account
              </span>
              <button type="button" className="font-body-sm text-body-sm text-primary hover:text-on-surface transition-colors">Load default profile</button>
            </div>
          </section>

          <section className="rounded-xl border border-border-soft bg-surface-container-low p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Model Capabilities & engines</h2>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">Apply or disable runtime features that should affect your sessions.</p>
              </div>
              <span className="flex items-center gap-1.5 font-label-caps text-label-caps text-tertiary">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_6px_rgba(74,225,118,0.7)]" />{Object.values(engineState).filter(Boolean).length}/{Object.keys(engineState).length} online
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {ENGINES.map((engine, index) => (
                <div key={engine.name} className="rounded-lg border border-border-soft bg-surface-container p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[20px] ${engine.color}`}>{engine.icon}</span>
                      <div>
                        <p className="font-title-md text-title-md text-on-surface">{engine.name}</p>
                        <p className="font-label-code text-label-code text-outline text-[11px]">{engine.ver} · <span className={`${engine.color}`}>{engine.badge}</span></p>
                      </div>
                    </div>
                    <Toggle on={!!engineState[index]} onChange={(value) => setEngineState((current) => ({ ...current, [index]: value }))} />
                  </div>
                  <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">{engine.d}</p>
                  <p className="mt-1.5 font-label-code text-label-code text-outline text-[11px]">{engine.meta}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border-soft bg-surface-container-low p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Privacy, data, and retention</h2>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">Your settings are persisted locally and sync when the account is active.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-surface-container p-3">
                <div>
                  <p className="font-title-md text-title-md text-on-surface">Retain encrypted session logs</p>
                  <p className="font-body-sm text-body-sm text-outline">Keep complete conversation records for better recall.</p>
                </div>
                <Toggle on={retainLogs} onChange={setRetainLogs} />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container p-3">
                <div>
                  <p className="font-title-md text-title-md text-on-surface">Anonymous light mode analytics</p>
                  <p className="font-body-sm text-body-sm text-outline">Help improve the product experience without exposing personal data.</p>
                </div>
                <Toggle on={anonOpt} onChange={setAnonOpt} />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container p-3">
                <div>
                  <p className="font-title-md text-title-md text-on-surface">Auto-detect language shifts</p>
                  <p className="font-body-sm text-body-sm text-outline">Automatically adapt responses when your language changes mid-session.</p>
                </div>
                <Toggle on={autoDetect} onChange={setAutoDetect} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border-soft bg-surface-container-low p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Account actions</h2>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">Manage your account session and sign out securely.</p>
              </div>
              <button type="button" onClick={handleSignOut} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-danger/10 text-danger border border-danger/30 hover:bg-danger/15 transition-colors font-title-md text-title-md">
                Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
