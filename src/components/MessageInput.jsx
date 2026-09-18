import { useEffect, useRef, useState } from 'react';

const ATTACHMENT_OPTIONS = [
  {
    label: 'Upload document',
    detail: 'PDF, Markdown, TXT, DOCX',
    icon: 'upload_file',
    color: 'text-primary',
    value: 'Document PDF/Docx',
  },
  {
    label: 'Import codebase',
    detail: 'Connect GitHub or paste zip',
    icon: 'code',
    color: 'text-secondary',
    value: 'Code Repository',
  },
  {
    label: 'Data & Spreadsheets',
    detail: 'CSV, XLSX, JSON datasets',
    icon: 'table_chart',
    color: 'text-tertiary',
    value: 'Datasets & Sheets',
  },
];

export default function MessageInput({
  value = '',
  onChange = () => {},
  inputRef = null,
  onSend = () => {},
  placeholder,
}) {
  const [attachmentOpen, setAttachmentOpen] = useState(false);
  const [attached, setAttached] = useState([]);
  const [webSearch, setWebSearch] = useState(false);
  const [voice, setVoice] = useState(false);
  const [sending, setSending] = useState(false);
  const boxRef = useRef(null);
  const hasValue = value.trim().length > 0;

  // Auto-resize the textarea as the content grows
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 180)}px`;
    }
  }, [value, inputRef]);

  // Close attachment menu on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (attachmentOpen && boxRef.current && !boxRef.current.contains(e.target)) {
        setAttachmentOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [attachmentOpen]);

  // ⌘K / Ctrl+K focuses the input
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (inputRef && inputRef.current) inputRef.current.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inputRef]);

  const toggleAttachmentMenu = (e) => {
    e.stopPropagation();
    setAttachmentOpen((o) => !o);
  };

  const selectAttachment = (type) => {
    setAttachmentOpen(false);
    setAttached((prev) => [...prev, type]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const val = value.trim();
    if (!val) return;
    onChange('');
    onSend(val);
    setSending(true);
    setTimeout(() => setSending(false), 2800);
  };

  return (
    <div className="w-full relative mt-space-xs" ref={boxRef}>
      {/* Attachment menu */}
      {attachmentOpen && (
        <div
          className="absolute bottom-full mb-2 left-2 w-64 bg-surface-container-high rounded-xl shadow-2xl p-space-xs flex-col gap-1 z-30"
        >
          {ATTACHMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => selectAttachment(opt.value)}
              className="w-full flex items-center gap-space-sm px-3 py-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-left font-body-sm text-body-sm transition-colors"
            >
              <span className={`material-symbols-outlined text-[18px] ${opt.color}`}>{opt.icon}</span>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md">{opt.label}</span>
                <span className="font-body-sm text-body-sm text-outline">{opt.detail}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="relative rounded-2xl bg-surface-container-low p-space-sm shadow-xl transition-all duration-200">
        {/* Attached file pills */}
        {attached.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2 pb-2">
            {attached.map((a, i) => (
              <div
                key={`${a}-${i}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-body-sm text-body-sm"
              >
                <span className="material-symbols-outlined text-[14px] text-primary">attach_file</span>
                <span>{a}</span>
                <button
                  type="button"
                  onClick={() => setAttached((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-outline hover:text-error ml-1"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={inputRef}
          className="w-full bg-transparent px-2 text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none resize-none max-h-48"
          placeholder={
            voice
              ? 'Listening... Speak clearly in English, French, Swahili, or Yoruba...'
              : placeholder
              ? placeholder
              : "Message Sekale or type '/' for agents & commands..."
          }
          rows="2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleAttachmentMenu}
              title="Attach file or data"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors relative"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </button>

            <button
              type="button"
              onClick={() => setWebSearch((w) => !w)}
              title="Toggle real-time web retrieval"
              className={`h-8 px-2.5 rounded-lg flex items-center gap-1.5 transition-all ${
                webSearch
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-outline hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span className="font-label-code text-label-code hidden sm:inline">Web</span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  webSearch ? 'bg-tertiary shadow-[0_0_8px_rgba(74,225,118,0.8)]' : 'bg-outline'
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setVoice((v) => !v)}
              title="Voice Input"
              className={`h-8 w-8 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors ${
                voice ? 'text-error animate-pulse' : 'text-outline hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </button>

            <div className="hidden md:flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-surface-container text-outline font-label-code text-label-code select-none opacity-80">
              <span>Sekale Ultra</span>
              <span className="material-symbols-outlined text-[14px]">tune</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center text-outline font-label-code text-label-code select-none pr-1">
              <span>Return ↵ to send</span>
            </div>
            <button
              type="button"
              onClick={handleSend}
              title="Send query"
              className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                hasValue
                  ? 'bg-primary-container text-on-primary-container shadow-[0_0_14px_rgba(91,92,226,0.6)]'
                  : 'bg-surface-container-high text-outline opacity-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Send notification */}
      {sending && (
        <div className="fixed bottom-24 right-8 bg-surface-container-high px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-on-surface z-50 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
          <span className="font-body-md text-body-md">Query sent to Sekale inference clusters...</span>
        </div>
      )}
    </div>
  );
}
