import { useRef, useState } from 'react';
import { Heading, ListOrdered } from 'lucide-react';
import { renderBody } from './bodyFormat';

// A contract-safe "rich" editor for the article body: a plain-text area that stores
// the mobile's light markup (## headings, 1. steps, blank-line paragraphs), with a
// toolbar that inserts those prefixes and a live Preview that renders exactly what the
// farmer will see. No HTML/WYSIWYG — the mobile reader only understands this subset.
export function BodyEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  // Insert a prefix at the start of the line the caret is on (for "## " / "1. ").
  const prefixLine = (prefix: string) => {
    const ta = ref.current;
    if (!ta) return;
    const caret = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', caret - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = caret + prefix.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="rounded-lg border border-agro-surface-a40">
      <div className="flex items-center justify-between border-b border-agro-surface-a30 px-2 py-1.5">
        <div className="flex items-center gap-1">
          <ToolbarButton label="Heading" disabled={mode !== 'write'} onClick={() => prefixLine('## ')}>
            <Heading size={16} strokeWidth={1.75} />
          </ToolbarButton>
          <ToolbarButton label="Numbered step" disabled={mode !== 'write'} onClick={() => prefixLine('1. ')}>
            <ListOrdered size={16} strokeWidth={1.75} />
          </ToolbarButton>
          <span className="ml-1 font-agro-sans text-agro-xs text-agro-text-disabled">
            Blank line = new paragraph
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Tab active={mode === 'write'} onClick={() => setMode('write')}>
            Write
          </Tab>
          <Tab active={mode === 'preview'} onClick={() => setMode('preview')}>
            Preview
          </Tab>
        </div>
      </div>

      {mode === 'write' ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={14}
          placeholder={'Write the advice here.\n\n## Use headings for sections\n\n1. And numbered steps for instructions'}
          className="block w-full resize-y bg-transparent px-3 py-3 font-agro-sans text-agro-sm leading-relaxed text-agro-text-primary outline-none placeholder:text-agro-text-disabled"
        />
      ) : (
        <div className="min-h-[14rem] px-3 py-3">{renderBody(value)}</div>
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex size-7 items-center justify-center rounded text-agro-text-secondary transition-colors hover:bg-agro-surface-a20 hover:text-agro-text-primary disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Tab({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2.5 py-1 font-agro-sans text-agro-xs font-medium transition-colors ${
        active ? 'bg-agro-surface-a20 text-agro-text-primary' : 'text-agro-text-muted hover:text-agro-text-primary'
      }`}
    >
      {children}
    </button>
  );
}
