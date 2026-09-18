export default function ModelSelector({ model = 'Sekale Smart', onSelect = () => {} }) {
  return (
    <button
      type="button"
      className="hidden sm:flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container text-on-surface text-body-sm font-body-sm cursor-pointer hover:bg-surface-container-high transition-colors"
      onClick={() => onSelect(model)}
      title="Select model"
    >
      <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(193,193,255,0.6)]" />
      <span>{model}</span>
      <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
    </button>
  );
}
