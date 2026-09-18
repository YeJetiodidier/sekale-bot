import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MessageInput from '../components/MessageInput';
import PromptCard from '../components/PromptCard';

const PROMPT_CARDS = [
  {
    icon: 'lightbulb',
    iconColor: 'text-primary',
    hoverBg: 'group-hover:bg-primary group-hover:text-on-primary',
    title: 'Brainstorm ideas',
    subtitle: '"Help me develop a new project idea"',
    prompt:
      'Help me develop a new project idea: scalable micro-lending API for East Africa with automated KYC',
  },
  {
    icon: 'code_blocks',
    iconColor: 'text-secondary',
    hoverBg: 'group-hover:bg-secondary-container group-hover:text-on-secondary-container',
    title: 'Write code',
    subtitle: '"Build a React component for me"',
    prompt:
      'Build a React component for me: responsive high-frequency telemetry dashboard card with dark mode',
  },
  {
    icon: 'school',
    iconColor: 'text-tertiary',
    hoverBg: 'group-hover:bg-tertiary-container group-hover:text-on-tertiary-container',
    title: 'Learn something',
    subtitle: '"Explain this topic step by step"',
    prompt: 'Explain this topic step by step: Zero-Knowledge proofs and rollups in decentralized infrastructure',
  },
  {
    icon: 'find_in_page',
    iconColor: 'text-primary-fixed',
    hoverBg: 'group-hover:bg-primary-container group-hover:text-on-primary-container',
    title: 'Analyze document',
    subtitle: '"Summarize and explain this file"',
    prompt: 'Summarize and explain this file step by step with structural architecture diagrams.',
    attach: 'Project_Spec_v2.pdf',
  },
];

const SUGGESTION_CHIPS = [
  { icon: 'grain', color: 'text-primary', label: 'Explain quantum computing', prompt: 'Explain quantum computing in simple terms' },
  { icon: 'terminal', color: 'text-secondary', label: 'Learn Python in 30 days', prompt: 'Learn Python in 30 days syllabus for engineers' },
  { icon: 'bolt', color: 'text-tertiary', label: 'Draft business pitch', prompt: 'Draft business pitch for a pan-African cloud native infrastructure startup' },
];

export default function Landing() {
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const injectPrompt = (text) => {
    setPrompt(text);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSend = (text) => {
    if (!text || !text.trim()) return;
    navigate('/chat', { state: { initialPrompt: text.trim() } });
  };

  return (
    <main className="w-full bg-background">
      <div className="flex flex-col w-full">
        <div className="relative w-full flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] px-space-md sm:px-margin pb-space-lg overflow-hidden">
          {/* Ambient glows */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-primary-container/20 via-secondary-container/10 to-transparent blur-[120px] pointer-events-none -z-10" />
          <div className="absolute top-1/3 left-10 w-72 h-72 bg-tertiary-container/10 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-space-lg lg:pt-space-xl text-center">
            {/* Logo */}
            <div className="relative mb-space-md group cursor-pointer">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-container via-secondary to-tertiary rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition-all duration-700" />
              <div className="relative w-20 h-20 rounded-2xl bg-surface-container-high flex items-center justify-center shadow-xl">
                <div className="relative flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[44px] text-primary select-none transform group-hover:scale-110 transition-transform duration-500"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    neurology
                  </span>
                  <span
                    className="material-symbols-outlined text-[20px] text-tertiary absolute -top-1.5 -right-2 animate-pulse"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-low mb-space-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(74,225,118,0.8)]" />
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                Sekale Neural Engine v4.8 Active
              </span>
            </div>

            <h1 className="font-display text-headline-lg-mobile sm:text-headline-lg md:text-display text-on-surface tracking-tight max-w-2xl font-bold">
              How can Sekale help you today?
            </h1>
            <p className="font-body-lg text-body-lg text-outline max-w-xl mt-space-xs font-normal">
              Ask questions, solve problems, create ideas, analyze files, write code, and learn something new.
            </p>

            {/* Quick action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm md:gap-space-md w-full max-w-3xl mt-space-xl text-left">
              {PROMPT_CARDS.map((card) => (
                <PromptCard
                  key={card.title}
                  icon={card.icon}
                  iconColor={card.iconColor}
                  hoverBg={card.hoverBg}
                  title={card.title}
                  subtitle={card.subtitle}
                  onClick={() => injectPrompt(card.prompt)}
                />
              ))}
            </div>
          </div>

          {/* Suggestion chips + composer */}
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center mt-space-lg relative z-20">
            <div className="w-full flex items-center gap-space-xs overflow-x-auto pb-space-xs no-scrollbar justify-start sm:justify-center">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => injectPrompt(chip.prompt)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-all shadow-sm"
                >
                  <span className={`material-symbols-outlined text-[14px] ${chip.color}`}>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            <MessageInput value={prompt} onChange={setPrompt} inputRef={inputRef} onSend={handleSend} />

            <div className="flex items-center justify-between w-full px-space-xs mt-2 text-outline font-body-sm text-body-sm">
              <span className="flex items-center gap-1 text-[11px] font-label-caps uppercase tracking-wider text-outline">
                <span className="material-symbols-outlined text-[13px] text-tertiary">verified_user</span> End-to-end
                tokenized
              </span>
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[11px] font-label-code text-outline">
                  Sekale AI can make mistakes. Verify critical facts.
                </span>
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-outline font-label-code text-label-code">
                  ⌘K Command
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
