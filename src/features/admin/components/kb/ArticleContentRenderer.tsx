import React, { useState } from 'react';
import { Copy, Check, Terminal, Info, AlertTriangle, Lightbulb } from 'lucide-react';

interface ArticleContentRendererProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-border bg-slate-950 text-slate-100 shadow-md">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/90 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="h-3.5 w-3.5 text-brand-indigo" />
          <span className="font-mono uppercase font-semibold text-[11px] tracking-wider">
            {language || 'Terminal / Code'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-xs sm:text-[13px] font-mono leading-relaxed overflow-x-auto whitespace-pre text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Simple inline parser for bold, italic, code, and links
function parseInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  // Regex to split by bold, inline code, and links
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  parts.forEach((part, idx) => {
    if (!part) return;

    if (part.startsWith('**') && part.endsWith('**')) {
      tokens.push(<strong key={idx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>);
    } else if (part.startsWith('`') && part.endsWith('`')) {
      tokens.push(
        <code
          key={idx}
          className="font-mono text-xs px-1.5 py-0.5 rounded-md bg-surface-subtle border border-border text-brand-indigo font-semibold"
        >
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        tokens.push(
          <a
            key={idx}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-indigo font-semibold underline underline-offset-2 hover:opacity-80"
          >
            {match[1]}
          </a>,
        );
      } else {
        tokens.push(part);
      }
    } else {
      tokens.push(part);
    }
  });

  return tokens;
}

export const ArticleContentRenderer: React.FC<ArticleContentRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content || !content.trim()) {
    return (
      <div className="py-6 text-center text-xs text-foreground-muted italic">
        No content provided for this article.
      </div>
    );
  }

  // Parse lines and blocks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';

  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    const ListTag = listBuffer.type;
    const items = listBuffer.items;
    elements.push(
      <ListTag
        key={`list-${elements.length}`}
        className={`my-3 space-y-1.5 ${
          ListTag === 'ol' ? 'list-decimal list-outside pl-5' : 'list-disc list-outside pl-5'
        } text-sm sm:text-base text-foreground/90 leading-relaxed`}
      >
        {items.map((item, i) => (
          <li key={i} className="pl-1">
            {parseInline(item)}
          </li>
        ))}
      </ListTag>,
    );
    listBuffer = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i] ?? '';
    const line = rawLine.trim();

    // Code block start / end
    if (line.startsWith('```')) {
      flushList();
      if (inCodeBlock) {
        // End code block
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBuffer.join('\n')}
            language={codeLang}
          />,
        );
        inCodeBlock = false;
        codeBuffer = [];
        codeLang = '';
      } else {
        // Start code block
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Blank line
    if (!line) {
      flushList();
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-6 mb-3 pb-1 border-b border-border/40"
        >
          {parseInline(line.slice(2))}
        </h1>,
      );
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-6 mb-2.5 pb-1 border-b border-border/40"
        >
          {parseInline(line.slice(3))}
        </h2>,
      );
      continue;
    }
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-base sm:text-lg font-bold text-foreground tracking-tight mt-5 mb-2"
        >
          {parseInline(line.slice(4))}
        </h3>,
      );
      continue;
    }
    if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4
          key={`h4-${elements.length}`}
          className="text-sm sm:text-base font-bold text-foreground mt-4 mb-1.5"
        >
          {parseInline(line.slice(5))}
        </h4>,
      );
      continue;
    }

    // Callouts / Blockquotes
    if (line.startsWith('> ')) {
      flushList();
      const quoteText = line.slice(2).trim();
      const isTip = quoteText.toLowerCase().includes('[!tip]') || quoteText.toLowerCase().startsWith('tip:');
      const isWarn = quoteText.toLowerCase().includes('[!warning]') || quoteText.toLowerCase().startsWith('warning:') || quoteText.toLowerCase().startsWith('caution:');
      const cleanQuote = quoteText.replace(/\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/gi, '').trim();

      const IconComponent = isTip ? Lightbulb : isWarn ? AlertTriangle : Info;
      const borderCol = isTip ? 'border-emerald-500 bg-emerald-500/5 text-emerald-950 dark:text-emerald-100' : isWarn ? 'border-amber-500 bg-amber-500/5 text-amber-950 dark:text-amber-100' : 'border-brand-indigo bg-brand-indigo/5 text-foreground';

      elements.push(
        <div
          key={`quote-${elements.length}`}
          className={`my-4 p-3.5 sm:p-4 rounded-xl border-l-4 ${borderCol} flex items-start gap-3 text-xs sm:text-sm leading-relaxed`}
        >
          <IconComponent className="h-4 w-4 shrink-0 mt-0.5 text-brand-indigo" />
          <div className="flex-1 font-medium">{parseInline(cleanQuote)}</div>
        </div>,
      );
      continue;
    }

    // Numbered step (e.g. "Step 1: ...", "Step 2. ...", "1. ...")
    const stepMatch = line.match(/^(?:Step\s*(\d+)[:.]?|\b(\d+)\.)\s+(.+)$/i);
    if (stepMatch) {
      flushList();
      const stepNum = stepMatch[1] || stepMatch[2] || '•';
      const stepContent = stepMatch[3] || '';

      elements.push(
        <div
          key={`step-${elements.length}`}
          className="my-3.5 p-3.5 rounded-xl bg-surface-subtle/50 border border-border flex items-start gap-3 transition-all hover:border-brand-indigo/30"
        >
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-indigo text-white font-bold text-xs shrink-0 mt-0.5 shadow-sm">
            {stepNum}
          </span>
          <div className="flex-1 text-sm sm:text-base text-foreground font-medium leading-relaxed">
            {parseInline(stepContent)}
          </div>
        </div>,
      );
      continue;
    }

    // Unordered List (- item or * item)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const itemText = line.slice(2).trim();
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [itemText] };
      } else {
        listBuffer.items.push(itemText);
      }
      continue;
    }

    // Horizontal Rule
    if (line === '---' || line === '***' || line === '___') {
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} className="my-6 border-border" />);
      continue;
    }

    // Standard Paragraph
    flushList();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="my-2.5 text-sm sm:text-base text-foreground/90 leading-relaxed font-normal"
      >
        {parseInline(line)}
      </p>,
    );
  }

  // Flush any lingering list or code block
  flushList();
  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <CodeBlock
        key={`code-${elements.length}`}
        code={codeBuffer.join('\n')}
        language={codeLang}
      />,
    );
  }

  return <div className={`space-y-1 text-foreground ${className}`}>{elements}</div>;
};
