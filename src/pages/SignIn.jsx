import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const FOOTER = (
  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-outline">
    <span className="flex items-center gap-1.5 text-tertiary">
      <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_6px_rgba(74,225,118,0.8)]" />
      Pan-African Sovereign AI Infrastructure Cluster • AU-01 Grid
    </span>
    <span>© 2025 Sekale Bot Intelligence. All systems nominal.</span>
  </div>
);

export default function SignIn() {
  const [email, setEmail] = useState('didier@sekale.ai');
  const [password, setPassword] = useState('••••••••••');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, loginGoogle } = useAuth();
  const navigate = useNavigate();

  const friendly = (e) => {
    const c = e?.code || '';
    if (c.includes('invalid-credential')) return 'Invalid email or passphrase.';
    if (c.includes('user-not-found')) return 'No account found for that node.';
    if (c.includes('too-many-requests')) return 'Too many attempts. Please wait and retry.';
    return e?.message || 'Authentication failed.';
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(friendly(err));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError('');
    setBusy(true);
    try {
      await loginGoogle();
      navigate('/home');
    } catch (err) {
      setError(friendly(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell footer={FOOTER}>
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-br from-primary-container/40 via-secondary/20 to-tertiary/20 rounded-2xl blur-2xl opacity-60 pointer-events-none" />
        <div className="relative bg-surface-container-low/90 border border-border-soft rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-6">
            <Logo size={56} />
            <div className="mt-3 flex items-center gap-2">
              <span className="font-headline-md text-headline-md font-semibold text-on-surface">Sekale</span>
              <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-caps text-label-caps">BOT</span>
            </div>
            <h1 className="mt-4 font-headline-lg text-headline-lg text-on-surface">Welcome back</h1>
            <p className="mt-1 font-body-md text-body-md text-outline">
              Access your sovereign neural nodes, decentralized knowledge vault, and autonomous pipelines.
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-lg bg-surface-container border border-border-soft text-on-surface font-title-md text-title-md hover:bg-surface-container-high transition-colors disabled:opacity-60"
          >
            <span className="text-[16px] font-bold" style={{ fontFamily: 'sans-serif' }}>G</span>
            <span>{busy ? 'Connecting…' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-border-soft" />
            <span className="font-label-caps text-label-caps text-outline">OR CONTINUE WITH EMAIL</span>
            <span className="h-px flex-1 bg-border-soft" />
          </div>

          {error && (
            <div className="mt-4 px-3 py-2 rounded-lg bg-danger/15 text-danger font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>{error}
            </div>
          )}
          <form onSubmit={submit} className={`space-y-4 ${error ? 'mt-4' : 'mt-0'}`}>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">
                Intelligence Identifier / Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-9 pr-3 bg-surface-container rounded-lg text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">
                Security Passphrase
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">lock</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-9 pr-10 bg-surface-container rounded-lg text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-[18px]">{showPass ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-body-sm text-body-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded bg-surface-container border border-border-soft accent-primary-container"
                />
                Remember node (30d)
              </label>
              <button type="button" className="font-body-sm text-body-sm text-primary hover:text-on-surface transition-colors">Reset key?</button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-container to-violet text-on-primary-container font-title-md text-title-md hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_18px_rgba(91,92,226,0.4)] disabled:opacity-60"
            >
              <span>{busy ? 'Authenticating…' : 'Authenticate Session'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <p className="mt-4 text-center font-body-sm text-body-sm text-outline">
            Unregistered neural cluster?{' '}
            <Link to="/signup" className="text-primary hover:text-on-surface transition-colors">Initialize node access</Link>
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: 'verified_user', text: 'E2EE 256-Bit TLS', green: true },
              { icon: 'dns', text: 'AU-01 Local Vault' },
              { icon: 'lock', text: 'Zero Egress', green: true },
            ].map((b) => (
              <span key={b.text} className={`px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps ${b.green ? 'text-tertiary' : ''}`}>
                <span className={`material-symbols-outlined text-[13px] align-[-2px] ${b.green ? 'text-tertiary' : 'text-primary'}`}>{b.icon}</span>
                {b.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
