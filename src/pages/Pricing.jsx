import { useState } from 'react';

function Check({ tone = 'tertiary' }) {
  return <span className={`material-symbols-outlined text-[17px] ${tone === 'tertiary' ? 'text-tertiary' : 'text-on-surface'}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>;
}

const PLANS = [
  {
    name: 'Sekale Free',
    price: '$0',
    per: 'month',
    tag: 'Current Plan',
    desc: 'Essential AI assistant for everyday questions, writing, and lightweight learning.',
    features: ['Unlimited Sekale Fast queries', 'Standard speed response times', 'Up to 5 files upload per month (max 25MB each)', '3 Active Projects', 'Community support via Discord & Forum'],
    cta: 'Current Plan Active',
    ctaStyle: 'bg-surface-container text-on-surface-variant',
    tint: 'text-on-surface-variant',
  },
  {
    name: 'Sekale Plus',
    price: '$16',
    per: 'month',
    popular: true,
    tag: 'Most Popular for Creators & Pros',
    billed: 'Billed annually at $192/yr',
    desc: 'For developers, researchers, and creators demanding deep reasoning and rich context.',
    features: ['Unlimited Sekale Smart & Fast models', '250 deep reasoning queries/week (Sekale Reasoning v3.4)', 'High-bandwidth file vault: 25 GB storage (up to 250MB/file)', 'Unlimited Projects & Custom Prompt Schemas', 'Code Execution Sandbox & Live Web Retrieval', 'Priority compute bandwidth during peak African & global hours', 'Early access to multimodal speech & vision releases'],
    cta: 'Upgrade to Plus →',
    ctaStyle: 'bg-primary-container text-on-primary-container',
    fine: 'Instant activation • Cancel anytime with 1-click',
    highlight: true,
  },
  {
    name: 'Sekale Pro & Team',
    price: '$49',
    per: 'seat / mo',
    tag: 'Enterprise Grade',
    desc: 'Unrestricted computational bandwidth, zero data egress, and multi-agent team workspaces.',
    features: ['Unlimited Sekale Reasoning & Ultra models', '100 GB encrypted neural vault per team seat', 'Custom organizational fine-tuning & domain adapters', 'AES-256 Client-Side Key Vault & SOC2 Type II compliance', 'Centralized billing, usage quotas & RBAC roles', 'Dedicated latency SLA (99.9% uptime guaranteed)', '24/7 dedicated engineering support & private Slack'],
    cta: 'Start 14-Day Team Trial',
    ctaStyle: 'bg-surface-container text-on-surface border border-border-soft',
    fine: 'No credit card required for pilot setup',
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="w-full bg-background px-space-md sm:px-margin py-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-label-caps text-label-caps inline-flex">
          Transparent Value for Innovators & Enterprises
        </span>
        <h1 className="mt-3 font-headline-lg text-headline-lg text-on-surface sm:text-display">Supercharge Your Workflow with Sekale</h1>
        <p className="mt-2 font-body-md text-body-md text-outline max-w-2xl mx-auto">
          Choose the computing power that fits your scale. From everyday productivity to enterprise-grade neural pipelines.
        </p>

        {/* Billing toggle */}
        <div className="mt-6 inline-flex items-center gap-1 p-1 rounded-full bg-surface-container">
          <button type="button" onClick={() => setAnnual(false)} className={`px-4 py-1.5 rounded-full font-body-sm text-body-sm transition-colors ${!annual ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'}`}>
            Monthly billing
          </button>
          <button type="button" onClick={() => setAnnual(true)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-body-sm text-body-sm transition-colors ${annual ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant'}`}>
            Annual billing
            <span className="px-1.5 py-0.5 rounded bg-tertiary/15 text-tertiary font-label-caps text-label-caps">SAVE 20% + 2 MO FREE</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-2xl p-6 flex flex-col ${
              p.highlight
                ? 'border-2 border-primary-container bg-surface-container-low shadow-[0_0_30px_rgba(91,92,226,0.25)]'
                : 'border border-border-soft bg-surface-container-low'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps whitespace-nowrap shadow-lg">
                {p.tag}
              </span>
            )}
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{p.name}</h3>
              {!p.popular && <span className="font-label-caps text-label-caps text-on-surface-variant">{p.tag}</span>}
            </div>
            <div className="mt-4 flex items-end gap-1">
              <span className="font-display text-display text-on-surface leading-none">{p.price}</span>
              <span className="font-body-sm text-body-sm text-outline mb-1">/ {p.per}</span>
            </div>
            {p.billed && <p className="font-label-code text-label-code text-outline mt-1">{annual ? p.billed : 'Billed monthly at $19/mo'}</p>}
            <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{p.desc}</p>

            <ul className="mt-5 space-y-2.5 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface">
                  <Check tone={p.highlight ? 'on-surface' : 'tertiary'} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button type="button" className={`mt-6 w-full h-11 rounded-lg font-title-md text-title-md hover:opacity-90 transition-all ${p.ctaStyle}`}>
              {p.cta}
            </button>
            {p.fine && <p className="mt-2 text-center font-body-sm text-body-sm text-outline">{p.fine}</p>}
          </div>
        ))}
      </div>

      {/* Trust infrastructure */}
      <section className="pt-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <p className="flex items-center gap-1.5 font-label-caps text-label-caps text-tertiary">
              <span className="material-symbols-outlined text-[16px]">lock</span>Uncompromising Trust Infrastructure
            </p>
            <h2 className="mt-1 font-headline-md text-headline-md text-on-surface">Engineered for Privacy & Local Fluidity</h2>
          </div>
          <p className="font-body-sm text-body-sm text-outline max-w-md md:text-right">
            Built from the ground up to respect Pan-African data sovereignty while delivering international computational velocity.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: 'lock', t: 'Zero Data Retention on Training', d: 'Your proprietary code, financial files, and prompts are never used to train base foundation models.', b: 'Zero Egress Guaranteed', bc: 'text-tertiary' },
            { icon: 'account_balance_wallet', t: 'Localized Multi-Currency Billing', d: 'Pay seamlessly via Mobile Money (M-Pesa, MTN MoMo, Airtel), Card (Visa/Mastercard), or Wire transfer in USD, KES, NGN, ZAR, EUR.', b: 'M-PESA • MOMO • CARDS', bc: 'text-primary' },
            { icon: 'sync_alt', t: 'Cancel or Pause Anytime', d: 'Downgrade with a single click; keep access to all exported vectors, semantic nodes, and markdown conversation history.', b: 'Full Data Portability', bc: 'text-tertiary' },
            { icon: 'key', t: 'Client-Side Cryptographic Vault', d: 'Private keys never leave your machine when zero-egress vault mode is enabled. End-to-end memory isolation.', b: 'Hardware Enclave Ready', bc: 'text-secondary' },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-border-soft bg-surface-container-low p-5">
              <div className="flex items-start justify-between">
                <span className="material-symbols-outlined text-[26px] text-primary">{f.icon}</span>
                <span className={`px-2 py-0.5 rounded-full bg-surface-container font-label-caps text-label-caps ${f.bc}`}>{f.b}</span>
              </div>
              <h3 className="mt-3 font-title-md text-title-md text-on-surface">{f.t}</h3>
              <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom deployments banner */}
      <div className="rounded-2xl border border-border-soft bg-surface-container-low p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Custom GPU Clusters & Self-Hosted Deployments</h3>
          <p className="mt-1 font-body-md text-body-md text-outline">
            Looking for on-premise containerized Sekale instances or sovereign bank-grade cloud setups?
          </p>
        </div>
        <button type="button" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface border border-border-soft hover:bg-surface-container-high transition-colors font-title-md text-title-md shrink-0">
          Contact Enterprise Solutions <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </button>
      </div>
    </div>
  );
}
