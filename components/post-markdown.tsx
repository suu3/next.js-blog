import { Fragment, ReactNode } from 'react';
import { slugifyHeading } from '@/lib/slug';

type Props = {
  content: string;
};

type Block =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'code'; text: string };

function parseBlocks(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: 'code', text: codeLines.join('\n') });
      continue;
    }

    const heading = line.match(/^(##|###)\s+(.*)$/);
    if (heading) {
      blocks.push({ type: heading[1].length === 2 ? 'h2' : 'h3', text: heading[2].trim() });
      i += 1;
      continue;
    }

    if (line.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: line.replace(/^>\s*/, '') });
      i += 1;
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, '').trim());
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, '').trim());
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    const paragraphLines: string[] = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(##|###|```|>\s+|-\s+|\d+\.\s+)/.test(lines[i])) {
      paragraphLines.push(lines[i].trimEnd());
      i += 1;
    }
    blocks.push({ type: 'p', text: paragraphLines.join(' ') });
  }

  return blocks;
}

function renderInline(text: string): ReactNode[] {
  const chunks = text.split(/(`[^`]+`|\[[^\]]+\]\([^\)]+\))/g).filter(Boolean);

  return chunks.map((chunk, index) => {
    if (/^`[^`]+`$/.test(chunk)) {
      return (
        <code key={`code-${index}`} className="rounded bg-[#ffe5d7] px-1.5 py-0.5 font-mono text-[0.92em] text-[#9a3412]">
          {chunk.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = chunk.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={`link-${index}`}
          href={linkMatch[2]}
          className="font-semibold text-[#e85d2d] underline decoration-[#ff9f7b] underline-offset-4 hover:text-[#c2461d]"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <Fragment key={`text-${index}`}>{chunk}</Fragment>;
  });
}

export default function PostMarkdown({ content }: Props) {
  const blocks = parseBlocks(content);

  return (
    <div>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={`${block.type}-${index}`} id={slugifyHeading(block.text)} className="mt-10 scroll-mt-24 text-2xl font-extrabold tracking-tight text-[#1f2937]">
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={`${block.type}-${index}`} id={slugifyHeading(block.text)} className="mt-8 scroll-mt-24 text-xl font-bold tracking-tight text-[#374151]">
                {block.text}
              </h3>
            );
          case 'ul':
            return (
              <ul key={`${block.type}-${index}`} className="mt-4 list-disc space-y-2 pl-6 text-[#374151]">
                {block.items.map((item) => (
                  <li key={item} className="leading-7">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={`${block.type}-${index}`} className="mt-4 list-decimal space-y-2 pl-6 text-[#374151]">
                {block.items.map((item) => (
                  <li key={item} className="leading-7">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            );
          case 'blockquote':
            return (
              <blockquote key={`${block.type}-${index}`} className="mt-6 border-l-4 border-[#ffb999] bg-[#fff3ed] px-4 py-3 text-[#7c2d12]">
                {renderInline(block.text)}
              </blockquote>
            );
          case 'code':
            return (
              <pre key={`${block.type}-${index}`} className="mt-5 overflow-x-auto rounded-lg border border-[#2a2b31] bg-[#1f2937] p-4 font-mono text-sm leading-6 text-[#f9fafb]">
                <code>{block.text}</code>
              </pre>
            );
          case 'p':
            return (
              <p key={`${block.type}-${index}`} className="mt-4 leading-8 text-[#374151]">
                {renderInline(block.text)}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
