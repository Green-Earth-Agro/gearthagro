import type { ReactNode } from 'react';

// Renders the article body the same way the mobile app does, so the editor preview is
// faithful: blank line = new paragraph, a line starting "## " = section heading, lines
// starting "1. " (etc.) = numbered steps. No other markup is supported on purpose —
// the mobile reader only understands these, so the editor must not invite more.
export function renderBody(body: string): ReactNode {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let steps: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (para.length) {
      blocks.push(
        <p key={key++} className="font-agro-sans text-agro-sm leading-relaxed text-agro-text-primary">
          {para.join(' ')}
        </p>,
      );
      para = [];
    }
  };
  const flushSteps = () => {
    if (steps.length) {
      blocks.push(
        <ol key={key++} className="ml-5 list-decimal space-y-1">
          {steps.map((s, i) => (
            <li key={i} className="font-agro-sans text-agro-sm leading-relaxed text-agro-text-primary">
              {s}
            </li>
          ))}
        </ol>,
      );
      steps = [];
    }
  };

  for (const line of lines) {
    if (line.trim() === '') {
      flushSteps();
      flushPara();
      continue;
    }
    if (line.startsWith('## ')) {
      flushSteps();
      flushPara();
      blocks.push(
        <h3 key={key++} className="font-agro-heading text-agro-lg font-bold text-agro-text-primary">
          {line.slice(3).trim()}
        </h3>,
      );
      continue;
    }
    const step = line.match(/^\d+\.\s+(.*)/);
    if (step) {
      flushPara();
      steps.push(step[1]);
      continue;
    }
    flushSteps();
    para.push(line);
  }
  flushSteps();
  flushPara();

  if (blocks.length === 0) {
    return <p className="font-agro-sans text-agro-sm italic text-agro-text-muted">Nothing to preview yet.</p>;
  }
  return <div className="flex flex-col gap-3">{blocks}</div>;
}
