import { Fragment, ReactNode } from 'react';
import { slugifyHeading } from '@/lib/slug';

type Props = {
  content: string;
};

type ListItem = {
  text: string;
  children: string[];
};

type Block =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: ListItem[] }
  | { type: 'ol'; items: ListItem[] }
  | { type: 'blockquote'; text: string }
  | { type: 'code'; text: string };

function getLeadingSpaces(value: string): number {
  return value.length - value.trimStart().length;
}

function parseUnorderedList(lines: string[], start: number) {
  const items: ListItem[] = [];
  let i = start;

  while (i < lines.length) {
    const rawLine = lines[i];
    const normalizedLine = rawLine.trimStart();

    if (!/^[-*]\s+/.test(normalizedLine)) {
      break;
    }

    items.push({
      text: normalizedLine.replace(/^[-*]\s+/, '').trim(),
      children: [],
    });
    i += 1;
  }

  return { items, nextIndex: i };
}

function parseOrderedList(lines: string[], start: number) {
  const items: ListItem[] = [];
  let i = start;

  while (i < lines.length) {
    const rawLine = lines[i];
    const normalizedLine = rawLine.trimStart();

    const orderedMatch = normalizedLine.match(/^\d+\.\s+(.*)$/);

    if (!orderedMatch) {
      break;
    }

    const item: ListItem = {
      text: orderedMatch[1].trim(),
      children: [],
    };

    i += 1;

    while (i < lines.length) {
      const nestedRawLine = lines[i];
      const nestedNormalizedLine = nestedRawLine.trimStart();
      const nestedLeadingSpaces = getLeadingSpaces(nestedRawLine);

      if (!nestedNormalizedLine) {
        i += 1;
        continue;
      }

      if (nestedLeadingSpaces >= 2 && /^[-*]\s+/.test(nestedNormalizedLine)) {
        item.children.push(nestedNormalizedLine.replace(/^[-*]\s+/, '').trim());
        i += 1;
        continue;
      }

      if (nestedLeadingSpaces >= 2 && item.children.length > 0) {
        item.children[item.children.length - 1] = `${item.children[item.children.length - 1]} ${nestedNormalizedLine}`.trim();
        i += 1;
        continue;
      }

      if (nestedLeadingSpaces >= 2) {
        item.text = `${item.text} ${nestedNormalizedLine}`.trim();
        i += 1;
        continue;
      }

      break;
    }

    items.push(item);
  }

  return { items, nextIndex: i };
}

function parseBlocks(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();
    const normalizedLine = line.trimStart();

    if (!normalizedLine) {
      i += 1;
      continue;
    }

    if (normalizedLine.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: 'code', text: codeLines.join('\n') });
      continue;
    }

    const heading = normalizedLine.match(/^(##|###)\s+(.*)$/);
    if (heading) {
      blocks.push({ type: heading[1].length === 2 ? 'h2' : 'h3', text: heading[2].trim() });
      i += 1;
      continue;
    }

    if (normalizedLine.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: normalizedLine.replace(/^>\s*/, '') });
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(normalizedLine)) {
      const result = parseUnorderedList(lines, i);
      blocks.push({ type: 'ul', items: result.items });
      i = result.nextIndex;
      continue;
    }

    if (/^\d+\.\s+/.test(normalizedLine)) {
      const result = parseOrderedList(lines, i);
      blocks.push({ type: 'ol', items: result.items });
      i = result.nextIndex;
      continue;
    }

    const paragraphLines: string[] = [normalizedLine];
    i += 1;
    while (i < lines.length) {
      const nextLine = lines[i].trimEnd();
      const normalizedNextLine = nextLine.trimStart();

      if (!normalizedNextLine) {
        break;
      }

      if (/^(##|###|```|>\s+|[-*]\s+|\d+\.\s+)/.test(normalizedNextLine)) {
        break;
      }

      paragraphLines.push(normalizedNextLine);
      i += 1;
    }
    blocks.push({ type: 'p', text: paragraphLines.join(' ') });
  }

  return blocks;
}

function renderBoldText(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((chunk, index) => {
      const boldMatch = chunk.match(/^\*\*([^*]+)\*\*$/);

      if (boldMatch) {
        return (
          <strong key={`${keyPrefix}-strong-${index}`} className="font-extrabold text-[#1f2937]">
            {boldMatch[1]}
          </strong>
        );
      }

      return <Fragment key={`${keyPrefix}-text-${index}`}>{chunk}</Fragment>;
    });
}

function renderInline(text: string): ReactNode[] {
  const chunks = text.split(/(!\[[^\]]*\]\([^\)]+\)|`[^`]+`|\[[^\]]+\]\([^\)]+\))/g).filter(Boolean);

  return chunks.map((chunk, index) => {
    const imageMatch = chunk.match(/^!\[([^\]]*)\]\(([^\s\)]+)(?:\s+"([^"]+)")?\)$/);

    if (imageMatch) {
      const [, alt, src, caption] = imageMatch;

      return (
        <figure key={`image-${index}`} className="my-4 overflow-hidden rounded-lg border border-[#2a2b31] bg-white shadow-[2px_2px_0_0_#2a2b31]">
          <img src={src} alt={alt} className="w-full" loading="lazy" />
          {(caption || alt) && <figcaption className="border-t border-[#2a2b31] bg-[#fff8f4] px-3 py-2 text-sm text-[#6b7280]">{caption || alt}</figcaption>}
        </figure>
      );
    }

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
          className="font-semibold text-[var(--theme)] underline decoration-[#ff9f7b] underline-offset-4 hover:text-[#c2461d]"
        >
          {renderBoldText(linkMatch[1], `link-${index}`)}
        </a>
      );
    }

    return <Fragment key={`text-${index}`}>{renderBoldText(chunk, `plain-${index}`)}</Fragment>;
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
                {block.items.map((item, itemIndex) => (
                  <li key={`${item.text}-${itemIndex}`} className="leading-7">
                    {renderInline(item.text)}
                    {item.children.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[#4b5563]">
                        {item.children.map((child, childIndex) => (
                          <li key={`${child}-${childIndex}`}>{renderInline(child)}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={`${block.type}-${index}`} className="mt-4 list-decimal space-y-3 pl-6 text-[#374151]">
                {block.items.map((item, itemIndex) => (
                  <li key={`${item.text}-${itemIndex}`} className="leading-7">
                    {renderInline(item.text)}
                    {item.children.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-[#4b5563]">
                        {item.children.map((child, childIndex) => (
                          <li key={`${child}-${childIndex}`}>{renderInline(child)}</li>
                        ))}
                      </ul>
                    )}
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
