'use client';

import { useState } from 'react';
import { css } from '@/styled-system/css';

type Props = {
  language: string;
  code: string;
  highlightedHtml: string;
};

export default function CodeBlock({ language, code, highlightedHtml }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={css({ mt: '1.25rem', overflow: 'hidden', borderRadius: '0.5rem', border: '1px solid var(--line)' })}>
      <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', bg: 'var(--theme-soft)', px: '0.75rem', py: '0.375rem' })}>
        <span className={css({ fontFamily: 'FiraCode-Medium, monospace', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.025em' })}>{language}</span>
        <button 
          onClick={handleCopy}
          className={css({ 
            fontSize: '0.75rem', 
            fontWeight: '600', 
            color: 'var(--muted)', 
            cursor: 'pointer', 
            transition: 'color 0.2s',
            _hover: { color: 'var(--theme)' } 
          })}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={css({ 
        margin: 0, 
        overflowX: 'auto', 
        bg: '#1f2937', 
        p: '1rem', 
        fontFamily: 'FiraCode-Medium, monospace', 
        fontSize: '0.875rem', 
        lineHeight: '1.5rem', 
        color: '#f9fafb',
        /* 스크롤바는 globals.css 설정을 따름 */
      })}>
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </div>
  );
}
