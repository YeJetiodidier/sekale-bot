import { useState } from 'react';

const CATEGORIES = ['All', 'Writing', 'Coding', 'Education', 'Business', 'Research', 'Productivity', 'Creative', 'Data Analysis'];

const AGENTS = [
  { tag: 'EDUCATION', dot: 'bg-tertiary', name: 'Study Assistant', ver: 'v3.2', icon: 'school', run: '180k runs', desc: 'Turn complex university lessons into simple step-by-step flashcards, spaced-repetition schedules, and structured summaries.', metric: 'Retention Boost +82%', green: true, extra: 'score' },
  { tag: 'DEVELOPER', dot: 'bg-secondary', name: 'Code Architect', ver: 'v4.1', icon: 'terminal', run: '420k runs', desc: 'Debug, refactor, and write idiomatic clean code across 40+ languages with automated unit tests and architectural review.', metric: 'fn analyze_ast()', code: true },
  { tag: 'STRATEGY', dot: 'bg-tertiary', name: 'African Tech & Business', ver: 'v2.8', icon: 'public', run: '95k runs', desc: 'Develop localized go-to-market strategies, financial models, regional regulatory compliance, and investor-ready pitch decks.', metric: 'JURISDICTIONS: 54', extra: 'Multi-FX' },
  { tag: 'ANALYTICS', dot: 'bg-secondary', name: 'Document Synthesizer', ver: 'v5.0', icon: 'summarize', run: '310k runs', desc: 'Extract structured insights, entity schemas, and cross-comparisons from dense PDFs, CSVs, and nested financial spreadsheets.', metric: 'OCR + Table Matrix', extra: '100k Tokens/s' },
  { tag: 'CREATIVE', dot: 'bg-secondary', name: 'Creative Writing Studio', ver: 'v2.1', icon: 'edit_note', run: '124k runs', desc: 'Craft compelling worldbuilding narratives, Afrofuturistic speculative fiction, poetic scripts, and character dial-in arcs.', metric: 'Tone: Noir', extra: 'Dialect Sync' },
  { tag: 'NUMERICS', dot: 'bg-tertiary', name: 'Data Science Copilot', ver: 'v3.9', icon: 'monitoring', run: '265k runs', desc: 'Perform automated exploratory data analysis, train predictive scikit models, and generate publication-ready Vega-Lite charts.', metric: 'P-VALUE SIG p < 0.001', code: true },
];

export default function Explore() {
  const [cat, setCat] = useState('All');

  return (
    <div className="w-full bg-background px-space-md sm:px-margin py-6 max-w-6xl mx-auto space-y-6">
      {/* Hero */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 font-label-caps text-label-caps text-tertiary mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_6px_rgba(74,225,118,0.8)]" />Autonomous Agent Directory
          </p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Explore Sekale</h1>
          <p className="font-body-md text-body-md text-outline mt-1 max-w-xl">
            Discover ways Sekale can help you work, learn, and create with Afropolitan-calibrated computational intelligence.
          </p>
        </div>
        <div className="flex gap-6 shrink-0">
          {[
            { label: 'ONLINE_AGENTS', value: '142' },
            { label: 'COMMUNITY_RUNS', value: '1.8M+' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-headline-md text-headline-md text-on-surface">{s.value}</p>
              <p className="font-label-caps text-label-caps text-outline">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">search</span>
          <input className="w-full h-11 pl-10 pr-16 bg-surface-container rounded-xl text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary-container transition-colors" placeholder="Search autonomous prompts, agents, capabilities, or specialized models..." />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-label-code text-label-code text-[11px]">CTRL + /</span>
        </div>
        <button type="button" className="flex items-center justify-center gap-2 px-4 h-11 rounded-xl bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-90 transition-all shadow-[0_0_14px_rgba(91,92,226,0.35)]">
          <span className="material-symbols-outlined text-[18px]">tune</span>Filter Studio
        </button>
      </div>

      {/* Trending tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 font-label-caps text-label-caps text-outline">
          <span className="material-symbols-outlined text-[15px] text-amber">local_fire_department</span>Trending
        </span>
        {['#SwahiliGrammar', '#MobileMoneyWebhook', '#AgriTechTelemetry', '#AfCFTACompliance', '#RustConcurrency'].map((t) => (
          <button key={t} type="button" className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors font-body-sm text-body-sm">{t}</button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-1 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full font-body-sm text-body-sm transition-colors ${
              c === cat ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {AGENTS.map((a) => (
          <div key={a.name} className="rounded-xl border border-border-soft bg-surface-container-low p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-label-caps text-label-caps text-on-surface-variant">
                <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />{a.tag}
              </span>
              <span className="font-label-code text-label-code text-outline">{a.ver}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className={`w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-[18px] ${a.tag === 'EDUCATION' || a.tag === 'STRATEGY' || a.tag === 'NUMERICS' ? 'text-tertiary' : 'text-secondary'}`}>
                <span className="material-symbols-outlined">{a.icon}</span>
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{a.name}</h3>
            </div>
            <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant flex-1">{a.desc}</p>
            <div className="mt-3 rounded-lg bg-surface-container-lowest border border-border-soft p-2 font-label-code text-label-code">
              {a.code ? <span className="text-primary-fixed">{a.metric}</span> : <span className={a.green ? 'text-tertiary' : 'text-on-surface-variant'}>{a.metric}</span>}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-label-code text-label-code text-outline text-[11px]">{a.run} · Open · Free</span>
              <button type="button" className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-body-sm text-body-sm hover:opacity-90 transition-all">Try it</button>
            </div>
          </div>
        ))}
      </div>

      {/* Feature strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {[
          { icon: 'widgets', t: 'Multi-Agent Handshakes', d: 'Chain the Study Assistant with Data Science Copilot to synthesize and drill down simultaneously.' },
          { icon: 'timer', t: 'Low-Bandwidth Adaptive Mode', d: 'Optimized for spotty networks with differential byte streaming and state caching.' },
          { icon: 'shield', t: 'Encrypted Vault Boundaries', d: 'Personalized context vectors never leave your localized cryptographic sandbox.' },
        ].map((f) => (
          <div key={f.t} className="rounded-xl border border-border-soft bg-surface-container-low p-4">
            <span className="material-symbols-outlined text-[22px] text-primary">{f.icon}</span>
            <p className="mt-2 font-title-md text-title-md text-on-surface">{f.t}</p>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
