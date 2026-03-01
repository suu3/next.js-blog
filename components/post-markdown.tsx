import { Fragment, ReactNode } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import { css } from '@/styled-system/css';
import { slugifyHeading } from '@/lib/slug';
import CodeBlock from './code-block';

type Props = {
  content: string;
};

type ListItem = {
  text: string;
  children: string[];
  nestedText?: string[]; // 리스트 아이템 내부의 추가 문단들
};

type Block =
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: ListItem[] }
  | { type: 'ol'; items: ListItem[] }
  | { type: 'blockquote'; text: string }
  | { type: 'code'; text: string; language: string }
  | { type: 'image'; alt: string; src: string; caption?: string };

const LANGUAGE_ALIASES: Record<string, string> = {
  html: 'markup',
  sh: 'bash',
  shell: 'bash',
  yml: 'yaml',
  md: 'markdown',
  js: 'javascript',
  ts: 'typescript',
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeLanguage(language: string): string {
  const normalized = language.trim().toLowerCase();
  if (!normalized) {
    return 'text';
  }

  return LANGUAGE_ALIASES[normalized] ?? normalized;
}

function highlightCode(text: string, language: string): string {
  const grammar = Prism.languages[language];
  if (!grammar) {
    return escapeHtml(text);
  }

  return Prism.highlight(text, grammar, language);
}

function getLeadingSpaces(value: string): number {
  return value.length - value.trimStart().length;
}

function parseUnorderedList(lines: string[], start: number) {
  const items: ListItem[] = [];
  let i = start;

  while (i < lines.length) {
    const normalizedLine = lines[i].trimStart();

    if (!/^[-*]\s+/.test(normalizedLine)) {
      break;
    }

    items.push({ text: normalizedLine.replace(/^[-*]\s+/, '').trim(), children: [] });
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
    const orderedMatch = normalizedLine.match(/^(\d+)\.\s*(.*)$/);

    if (!orderedMatch) {
      if (!normalizedLine && i + 1 < lines.length && /^(\d+)\.\s*(.*)$/.test(lines[i + 1].trimStart())) {
        i += 1;
        continue;
      }
      break;
    }

    const item: ListItem = { text: orderedMatch[2].trim(), children: [], nestedText: [] };
    i += 1;

    // 리스트 아이템 내부 컨텐츠 (들여쓰기 된 내용들) 파싱
    while (i < lines.length) {
      const nextRawLine = lines[i];
      const nextNormalizedLine = nextRawLine.trimStart();
      const nextLeadingSpaces = getLeadingSpaces(nextRawLine);

      if (!nextNormalizedLine) {
        // 빈 줄인 경우, 그 다음 줄이 들여쓰기 되어 있다면 계속 파싱
        if (i + 1 < lines.length && getLeadingSpaces(lines[i + 1]) >= 2) {
          i += 1;
          continue;
        }
        break;
      }

      // 다음 리스트 아이템이 시작되면 중단
      if (/^(\d+)\.\s*(.*)$/.test(nextNormalizedLine) && nextLeadingSpaces < 2) {
        break;
      }

      if (nextLeadingSpaces >= 2) {
        if (/^[-*]\s+/.test(nextNormalizedLine)) {
          // 중첩된 불렛 리스트
          item.children.push(nextNormalizedLine.replace(/^[-*]\s+/, '').trim());
        } else if (/^(\d+)\.\s*(.*)$/.test(nextNormalizedLine)) {
          // 중첩된 번호 리스트 (예: 3. 하위의 1.)
          item.children.push(nextNormalizedLine.trim());
        } else {
          // 리스트 내부의 추가 문단 혹은 이어지는 텍스트
          if (item.children.length > 0) {
            // 이미 중첩 리스트가 시작된 경우 그 아이템의 텍스트로 추가
            item.children[item.children.length - 1] = `${item.children[item.children.length - 1]} ${nextNormalizedLine}`.trim();
          } else if (nextLeadingSpaces >= 3) {
            // 3칸 이상 들여쓰기된 경우 새 문단으로 간주
            item.nestedText!.push(nextNormalizedLine);
          } else {
            // 단순히 첫 줄에서 이어지는 텍스트
            item.text = `${item.text} ${nextNormalizedLine}`.trim();
          }
        }
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
  const lines = content.split(/\r?\n/);
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const normalizedLine = line.trimStart();

    if (!normalizedLine) {
      i += 1;
      continue;
    }

    if (normalizedLine.startsWith('```')) {
      const codeLines: string[] = [];
      const language = normalizedLine.replace('```', '').trim() || 'text';
      i += 1;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: 'code', text: codeLines.join('\n'), language });
      continue;
    }

    // 단독 이미지 블록 감지
    const imageMatch = normalizedLine.match(/^!\[([^\]]*)\]\(([^\s\)]+)(?:\s+"([^"]+)")?\)$/);
    if (imageMatch) {
      blocks.push({ type: 'image', alt: imageMatch[1], src: imageMatch[2], caption: imageMatch[3] });
      i += 1;
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

    if (/^\d+\.\s+/.test(normalizedLine) || /^\d+\.$/.test(normalizedLine)) {
      const result = parseOrderedList(lines, i);
      blocks.push({ type: 'ol', items: result.items });
      i = result.nextIndex;
      continue;
    }

    const paragraphLines: string[] = [normalizedLine];
    i += 1;
    while (i < lines.length) {
      const normalizedNextLine = lines[i].trimEnd().trimStart();

      if (!normalizedNextLine || /^(##|###|```|>\s+|[-*]\s+|\d+\.\s+)/.test(normalizedNextLine)) {
        break;
      }
      
      // 다음 줄이 이미지라면 현재 문단을 종료 (p 안에 figure가 들어가는 것 방지)
      if (/^!\[([^\]]*)\]\(([^\s\)]+)(?:\s+"([^"]+)")?\)$/.test(normalizedNextLine)) {
        break;
      }

      paragraphLines.push(normalizedNextLine);
      i += 1;
    }

    blocks.push({ type: 'p', text: paragraphLines.join(' ') });
  }

  return blocks;
}

function renderImage(alt: string, src: string, caption?: string, key?: string | number) {
  return (
    <figure 
      key={key} 
      className={css({ 
        my: '1.5rem', 
        mx: { base: '-1rem', md: '0' },
        position: 'relative',
        borderRadius: { base: '0', md: '0.5rem' },
        border: '1px solid var(--line)', 
        borderLeft: { base: 'none', md: '1px solid var(--line)' },
        borderRight: { base: 'none', md: '1px solid var(--line)' },
        bg: 'var(--surface)', 
        boxShadow: { base: 'none', md: '2px 2px 0 0 var(--line)' },
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: { base: 'calc(100% + 2rem)', md: '100%' },
        minWidth: 0
      })}
    >
      <div className={css({ 
        overflowX: 'auto', 
        width: '100%', 
        WebkitOverflowScrolling: 'touch',
        display: 'block',
        bg: 'var(--surface)'
      })}>
        <img 
          src={src} 
          alt={alt} 
          className={css({ 
            display: 'block', 
            maxW: '100%',
            width: '100%', 
            height: 'auto',
            objectFit: 'contain'
          })} 
          loading="lazy" 
        />
      </div>
      {(caption || alt) && (
        <figcaption className={css({ 
          borderTop: '1px solid var(--line)', 
          bg: 'var(--theme-soft)', 
          px: '0.75rem', 
          py: '0.5rem', 
          fontSize: '0.875rem', 
          color: 'var(--muted)',
          zIndex: 1
        })}>
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
}

function renderInline(text: string, keyPrefix: string = 'inline'): ReactNode[] {
  if (!text) return [];
  const regex = /(!\[[^\]]*\]\([^\)]+\)|`[^`]+`|\[[^\]]+\]\([^\)]+\)|\*\*(?:(?!\*\*).)+\*\*)/g;
  const chunks = text.split(regex).filter(Boolean);


  return chunks.map((chunk, index) => {
    const imageMatch = chunk.match(/^!\[([^\]]*)\]\(([^\s\)]+)(?:\s+"([^"]+)")?\)$/);
    if (imageMatch) {
      const [, alt, src, caption] = imageMatch;
      return renderImage(alt, src, caption, `${keyPrefix}-img-${index}`);
    }

    if (/^`[^`]+`$/.test(chunk)) {
      return (
        <code key={`${keyPrefix}-code-${index}`} className={css({ borderRadius: '0.25rem', bg: 'var(--theme-soft)', px: '0.375rem', py: '0.125rem', fontFamily: 'FiraCode-Medium, monospace', fontSize: '0.92em', color: 'var(--text)' })}>
          {chunk.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = chunk.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={`${keyPrefix}-link-${index}`} href={linkMatch[2]} className={css({ fontWeight: '600', color: 'var(--theme)', textDecoration: 'underline', textDecorationColor: 'var(--theme)', textUnderlineOffset: '4px', _hover: { opacity: 0.8 } })}>
          {renderInline(linkMatch[1], `${keyPrefix}-link-${index}`)}
        </a>
      );
    }

    const boldMatch = chunk.match(/^\*\*((?:(?!\*\*).)+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={`${keyPrefix}-strong-${index}`} className={css({ fontWeight: '800', color: 'var(--text)' })}>
          {renderInline(boldMatch[1], `${keyPrefix}-strong-${index}`)}
        </strong>
      );
    }

    return <Fragment key={`${keyPrefix}-text-${index}`}>{chunk}</Fragment>;
  });
}

export default function PostMarkdown({ content }: Props) {
  const blocks = parseBlocks(content);

  return (
    <div className={css({ width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden', overflowWrap: 'break-word' })}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'image':
            return renderImage(block.alt, block.src, block.caption, index);
          case 'h2':
            return (
              <h2 key={`${block.type}-${index}`} id={slugifyHeading(block.text)} className={css({ mt: { base: '2rem', md: '2.5rem' }, scrollMarginTop: '6rem', fontSize: { base: '1.25rem', md: '1.5rem' }, fontWeight: '800', letterSpacing: '-0.025em' })}>
                {renderInline(block.text, `h2-${index}`)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={`${block.type}-${index}`} id={slugifyHeading(block.text)} className={css({ mt: { base: '1.5rem', md: '2rem' }, scrollMarginTop: '6rem', fontSize: { base: '1.125rem', md: '1.25rem' }, fontWeight: '700', letterSpacing: '-0.025em' })}>
                {renderInline(block.text, `h3-${index}`)}
              </h3>
            );
          case 'ul':
            return (
              <ul key={`${block.type}-${index}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${item.text}-${itemIndex}`}>
                    <div>{renderInline(item.text, `ul-${index}-${itemIndex}`)}</div>
                    {item.nestedText && item.nestedText.length > 0 && (
                      <div className={css({ mt: '0.375rem', color: 'var(--text)', fontSize: '0.92em', opacity: 0.8 })}>
                        {item.nestedText.map((text, idx) => (
                          <p key={idx}>{renderInline(text, `ul-${index}-${itemIndex}-nested-${idx}`)}</p>
                        ))}
                      </div>
                    )}
                    {item.children.length > 0 && (
                      <>
                        {item.children.some((child) => /^(\d+)\.\s*(.*)$/.test(child)) ? (
                          <ol>
                            {item.children.map((child, childIndex) => {
                              const subOrderedMatch = child.match(/^(\d+)\.\s*(.*)$/);
                              return (
                                <li key={childIndex}>
                                  {renderInline(subOrderedMatch ? subOrderedMatch[2] : child, `ul-${index}-${itemIndex}-child-${childIndex}`)}
                                </li>
                              );
                            })}
                          </ol>
                        ) : (
                          <ul>
                            {item.children.map((child, childIndex) => (
                              <li key={childIndex}>
                                {renderInline(child, `ul-${index}-${itemIndex}-child-${childIndex}`)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={`${block.type}-${index}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${item.text}-${itemIndex}`}>
                    <div>{renderInline(item.text, `ol-${index}-${itemIndex}`)}</div>
                    {item.nestedText && item.nestedText.length > 0 && (
                      <div className={css({ mt: '0.375rem', color: 'var(--text)', fontSize: '0.92em', opacity: 0.8 })}>
                        {item.nestedText.map((text, idx) => (
                          <p key={idx}>{renderInline(text, `ol-${index}-${itemIndex}-nested-${idx}`)}</p>
                        ))}
                      </div>
                    )}
                    {item.children.length > 0 && (
                      <>
                        {item.children.some((child) => /^(\d+)\.\s*(.*)$/.test(child)) ? (
                          <ol>
                            {item.children.map((child, childIndex) => {
                              const subOrderedMatch = child.match(/^(\d+)\.\s*(.*)$/);
                              return (
                                <li key={childIndex}>
                                  {renderInline(subOrderedMatch ? subOrderedMatch[2] : child, `ul-${index}-${itemIndex}-child-${childIndex}`)}
                                </li>
                              );
                            })}
                          </ol>
                        ) : (
                          <ul>
                            {item.children.map((child, childIndex) => (
                              <li key={childIndex}>
                                {renderInline(child, `ul-${index}-${itemIndex}-child-${childIndex}`)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ol>
            );
          case 'blockquote':
            return (
              <blockquote key={`${block.type}-${index}`} className={css({ mt: '1.5rem', borderLeft: '4px solid var(--theme)', bg: 'var(--theme-soft)', px: '1rem', py: '0.75rem', color: 'var(--text)' })}>
                {renderInline(block.text)}
              </blockquote>
            );
          case 'code': {
            const normalizedLanguage = normalizeLanguage(block.language);
            const highlightedCode = highlightCode(block.text, normalizedLanguage);
            return (
              <CodeBlock 
                key={`${block.type}-${index}`}
                language={block.language}
                code={block.text}
                highlightedHtml={highlightedCode}
              />
            );
          }
          case 'p':
            return (
              <p key={`${block.type}-${index}`} className={css({ mt: '1rem', lineHeight: { base: '1.75rem', md: '2rem' }, fontSize: { base: '0.9375rem', md: '1rem' } })}>
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
