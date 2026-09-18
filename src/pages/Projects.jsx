import { useState } from 'react';

const TABS = ['All Projects', 'Active Workspaces', 'Shared Teams', 'Archived'];

export default function Projects() {
  const [tab, setTab] = useState(0);
  const projects = [];
  return (
    <div className="w-full bg-background px-space-md sm:px-margin py-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 font-label-caps text-label-caps text-tertiary mb-1">
            <span className="material-symbols-outlined text-[15px]">workspaces</span>Workspace · <span className="text-on-surface-variant">Synced</span>
          </p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Projects</h1>
          <p className="font-body-md text-body-md text-outline mt-1 max-w-xl">
            Keep your conversations, files, custom instructions, and agent workflows organized.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button type="button" className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[16px]">upload</span>Import Repo
          </button>
          <button type="button" className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary-container text-on-primary-container font-title-md text-title-md hover:opacity-90 transition-all shadow-[0_0_14px_rgba(91,92,226,0.35)]">
            <span className="material-symbols-outlined text-[18px]">add</span>New Project
          </button>
        </div>
      </div>

      {/* Filter + search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <div className="flex gap-1 flex-wrap">
          {TABS.map((t, i) => (
            <button key={t} type="button" onClick={() => setTab(i)} className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm transition-colors ${i === tab ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-outline pointer-events-none">search</span>
          <input className="w-full h-9 pl-9 pr-16 bg-surface-container rounded-lg text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-high transition-colors" placeholder="Search projects or tags..." />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-high text-outline font-label-code text-label-code text-[11px]">⌘F</span>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border-soft bg-surface-container-low p-8 text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">folder_open</span>
        <h3 className="mt-3 font-headline-sm text-headline-sm text-on-surface">No projects yet</h3>
        <p className="mt-2 font-body-md text-body-md text-outline max-w-md mx-auto">
          Create your first project to organize chats, files, prompts, and generated work for this account.
        </p>
        <button type="button" className="mt-4 px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-title-md text-title-md">
          New Project
        </button>
      </div>
    </div>
  );
}
