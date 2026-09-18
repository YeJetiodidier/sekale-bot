export default function PromptCard({
  icon = 'lightbulb',
  iconColor = 'text-primary',
  hoverBg = 'group-hover:bg-primary group-hover:text-on-primary',
  title = 'Prompt',
  subtitle = '',
  onClick = () => {},
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden text-left"
    >
      <div className="flex items-start justify-between mb-space-sm">
        <div
          className={`w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center ${iconColor} ${hoverBg} transition-colors duration-300`}
        >
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
        <span className="material-symbols-outlined text-[18px] text-outline opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-1 transition-all duration-300">
          arrow_outward
        </span>
      </div>
      <div>
        <div className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors">
          {title}
        </div>
        <div className="font-body-sm text-body-sm text-outline mt-0.5">{subtitle}</div>
      </div>
    </button>
  );
}
