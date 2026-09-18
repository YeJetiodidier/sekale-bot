import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

const FOOTER = (
  <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-3 text-outline">
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
      <span className="flex items-center gap-1.5 text-tertiary">
        <span className="material-symbols-outlined text-[14px]">neurology</span>
        Free Tier Active: Unlimited Sekale Fast queries, 3 active projects, an...
      </span>
      <span className="font-label-code text-label-code text-on-surface-variant shrink-0">0 USD / mo</span>
    </div>
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
      <span className="flex items-center gap-1 text-tertiary text-[11px]"><span className="material-symbols-outlined text-[13px]">verified_user</span> GDPR & NDPR Compliant</span>
      <span className="flex items-center gap-1 text-tertiary text-[11px]"><span className="material-symbols-outlined text-[13px]">lock</span> End-to-End Tokenized</span>
      <span className="flex items-center gap-1 text-tertiary text-[11px]"><span className="material-symbols-outlined text-[13px]">hub</span> AU-01 Edge Nodes</span>
    </div>
  </div>
);

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [cipher, setCipher] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const available = handle.length >= 3;

  const submit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <AuthShell footer={FOOTER}>
      <div className="relative w-full max-w-lg">
        <div className="absolute -inset-1 bg-gradient-to-br from-primary-container/40 via-secondary/20 to-tertiary/20 rounded-2xl blur-2xl opacity-50 pointer-events-none" />
        <div className="relative bg-surface-container-low/90 border border-border-soft rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-6">
            <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps mb-3">
              <span className="material-symbols-outlined text-[14px] align-[-2px] text-primary">neurology</span>
              SEKALE NEURAL ENGINE V4.8
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Create your Sekale account</h1>
            <p className="mt-1 font-body-md text-body-md text-outline">
              Build, train, and orchestrate Afropolitan computational agents and secure knowledge vaults.
            </p>
          </div>

          <button
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 rounded-lg bg-surface-container border border-border-soft text-on-surface font-title-md text-title-md hover:bg-surface-container-high transition-colors"
          >
            <span className="text-[16px] font-bold" style={{ fontFamily: 'sans-serif' }}>G</span>
            <span>Sign up with Google</span>
          </button>

          <div className="flex items-center gap-3 my-5">
            <span className="h-px flex-1 bg-border-soft" />
            <span className="font-label-caps text-label-caps text-outline">OR REGISTER WITH EMAIL & USERNAME</span>
            <span className="h-px flex-1 bg-border-soft" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Full Name / Display Name">
              <Input value={fullName} onChange={setFullName} placeholder="e.g. Didier Kagame" icon="person" />
            </Field>

            <Field label="Sovereign Handle (Username)">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">alternate_email</span>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@ didier_dev"
                  className="w-full h-11 pl-9 pr-28 bg-surface-container rounded-lg text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container transition-colors"
                />
                {available && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-tertiary font-label-caps text-label-caps">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>Available
                  </span>
                )}
              </div>
            </Field>

            <Field label="Work or Personal Email">
              <Input value={email} onChange={setEmail} placeholder="didier@company.com" icon="mail" type="email" />
            </Field>

            <Field label="Master Security Cipher">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">key</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={cipher}
                  onChange={(e) => setCipher(e.target.value)}
                  className="w-full h-11 pl-9 pr-16 bg-surface-container rounded-lg text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface font-body-sm text-body-sm"
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
              {/* Strength */}
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className="h-1 flex-1 rounded-full bg-tertiary" />
                  ))}
                </div>
                <p className="font-label-caps text-label-caps text-tertiary">Strong security entropy</p>
                <p className="font-body-sm text-body-sm text-outline">12+ chars, symbols, mixed case</p>
              </div>
            </Field>

            <label className="flex items-start gap-2 cursor-pointer font-body-sm text-body-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-surface-container border border-border-soft accent-primary-container"
              />
              <span>
                I agree to the Terms of Service and Privacy Policy, including Pan-African data sovereignty covenants and local compute residency.
              </span>
            </label>

            <button
              type="submit"
              className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-container to-violet text-on-primary-container font-title-md text-title-md hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_18px_rgba(91,92,226,0.4)]"
            >
              <span>Create Free Account & Launch Workspace</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <p className="mt-4 text-center font-body-sm text-body-sm text-outline">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:text-on-surface transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="font-label-caps text-label-caps text-on-surface-variant block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ icon, ...props }) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">{icon}</span>
      <input
        {...props}
        className="w-full h-11 pl-9 pr-3 bg-surface-container rounded-lg text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container transition-colors"
      />
    </div>
  );
}
