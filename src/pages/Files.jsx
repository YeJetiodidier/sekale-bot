import { useState } from 'react';

const TABS = ['All Files', 'Documents', 'Data & Sheets', 'Code & Specs', 'Presentations'];

export default function Files() {
  const [activeTab, setActiveTab] = useState(0);
  const files = [];

  return (
    <div className="w-full bg-background px-space-md sm:px-margin py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 font-label-caps text-label-caps text-tertiary mb-1">
            <span className="material-symbols-outlined text-[15px]">database</span>Vector Index Active v2.4.0 · synced
          </p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Knowledge Vault</h1>
          <p className="font-body-md text-body-md text-outline mt-1 max-w-xl">
            Centralized neural repository. Upload datasets, contracts, or codebases to augment Sekale context across cross-agent workspaces.
          </p>
        </div>
        <div className="shrink-0 flex flex-col gap-2 items-start lg:items-end">
          <div className="flex items-center gap-2 w-56">
            <div className="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full w-[28%] rounded-full bg-primary-container" />
            </div>
            <span className="font-label-code text-label-code text-on-surface-variant shrink-0">28%</span>
          </div>
          <p className="font-label-code text-label-code text-outline">STORAGE POOL 28% · 4.2 GB of 15 GB</p>
          <div className="flex gap-2">
            <button type="button" className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm">Upgrade</button>
            <button type="button" className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-body-sm text-body-sm hover:opacity-90 transition-all shadow-[0_0_14px_rgba(91,92,226,0.35)]">
              <span className="material-symbols-outlined text-[15px] align-[-2px]">add</span> Upload File
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: 'bar_chart', color: 'text-tertiary', title: '1,482,900', sub: 'Total Embeddings Vectorized', meta: 'Latent dim: 1536', tag: 'Ready', green: true },
          { icon: 'link', color: 'text-secondary', title: '18 Sessions', sub: 'Active Knowledge Injections', meta: 'Swahili NLP • Fintech', tag: 'Active' },
          { icon: 'shield', color: 'text-primary', title: 'AES-GCM 256', sub: 'End-to-End Encrypted Knowledge', meta: 'Client-side Key Vault', tag: 'Protected', green: true },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-border-soft bg-surface-container-low p-4">
            <div className="flex items-start justify-between">
              <span className={`material-symbols-outlined text-[22px] ${c.color}`}>{c.icon}</span>
              <span className={`px-2 py-0.5 rounded-full font-label-caps text-label-caps ${c.green ? 'bg-tertiary/15 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'}`}>{c.tag}</span>
            </div>
            <p className="mt-2 font-headline-sm text-headline-sm text-on-surface">{c.title}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{c.sub}</p>
            <p className="font-label-code text-label-code text-outline mt-1">{c.meta}</p>
          </div>
        ))}
      </div>

      {/* Upload drop zone + tabs */}
      <div className="rounded-xl border border-dashed border-border-soft bg-surface-container-low/50 p-6 text-center">
        <span className="material-symbols-outlined text-[34px] text-primary">cloud_upload</span>
        <p className="mt-2 font-title-md text-title-md text-on-surface">Drop neural artifacts, data tables, or architecture plans here</p>
        <p className="font-body-sm text-body-sm text-outline">Supports PDF, XLSX, CSV, Markdown, Python, JSON, and EPUB up to 250 MB each</p>
        <div className="mt-2 flex justify-center gap-4 font-label-caps text-label-caps">
          <span className="flex items-center gap-1 text-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-tertiary" />Instant Chunking</span>
          <span className="flex items-center gap-1 text-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-tertiary" />RAG Integration</span>
        </div>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <div className="flex gap-1 flex-wrap">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm transition-colors ${
                i === activeTab ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">search</span>
          <input className="w-full h-9 pl-9 pr-3 bg-surface-container rounded-lg text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-high transition-colors" placeholder="Search knowledge base" />
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border-soft bg-surface-container-low p-8 text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">upload_file</span>
        <h3 className="mt-3 font-headline-sm text-headline-sm text-on-surface">No files uploaded yet</h3>
        <p className="mt-2 font-body-md text-body-md text-outline max-w-md mx-auto">
          Upload PDFs, spreadsheets, docs, or code to give this account its own knowledge base.
        </p>
        <button type="button" className="mt-4 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-title-md text-title-md">
          Upload file
        </button>
      </div>
    </div>
  );
}
