'use client';

import React, { useMemo, type ReactNode, type ReactElement } from 'react';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useContentStyles from '@/hooks/useContentStyles';
import GlossaryTooltip from './GlossaryTooltip';
import type { GlossaryEntry } from '@/types/glossary';

interface ContentRendererProps {
  content: string;
  glossary?: GlossaryEntry[];
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as Record<string, unknown>;
    return extractText(props.children as ReactNode);
  }
  return '';
}

function annotateText(text: string, glossary: GlossaryEntry[]): ReactNode[] {
  if (glossary.length === 0) return [text];

  const pattern = new RegExp(
    `\\b(${glossary.map(g => g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const matched = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const termLower = match[1].toLowerCase();
    if (matched.has(termLower)) continue;
    matched.add(termLower);

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const entry = glossary.find(g => g.term.toLowerCase() === termLower)!;
    parts.push(
      <GlossaryTooltip key={match.index} term={entry.term} definition={entry.definition} detail={entry.detail} url={entry.url}>
        {match[1]}
      </GlossaryTooltip>
    );
    lastIndex = match.index + match[1].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function annotateChildren(children: ReactNode, glossary: GlossaryEntry[]): ReactNode {
  if (glossary.length === 0) return children;

  if (!Array.isArray(children)) {
    if (typeof children === 'string') {
      const parts = annotateText(children, glossary);
      return parts.length === 1 ? parts[0] : <>{parts}</>;
    }
    if (React.isValidElement(children)) {
      return annotateElement(children, glossary);
    }
    return children;
  }

  return children.map((child, i) => {
    if (typeof child === 'string') {
      const parts = annotateText(child, glossary);
      return parts.length === 1 ? <span key={i}>{parts[0]}</span> : <span key={i}>{parts}</span>;
    }
    if (React.isValidElement(child)) {
      return annotateElement(child, glossary, i);
    }
    return child;
  });
}

function annotateElement(el: ReactElement, glossary: GlossaryEntry[], key?: number): ReactNode {
  const props = el.props as Record<string, unknown>;
  const elChildren = props.children as ReactNode | undefined;
  if (!elChildren) return key !== undefined ? React.cloneElement(el, { key }) : el;

  const annotated = annotateChildren(elChildren, glossary);
  return React.cloneElement(el, key !== undefined ? { key } : {}, annotated);
}

export default function ContentRenderer({ content, glossary = [] }: ContentRendererProps) {
  const sx = useContentStyles();

  const glossaryMap = useMemo(() => {
    const map = new Map<string, GlossaryEntry>();
    glossary.forEach(g => map.set(g.term.toLowerCase(), g));
    return map;
  }, [glossary]);

  const components = useMemo<Components>(() => ({
    a: ({ href, children }) => {
      const text = extractText(children);
      const entry = text ? glossaryMap.get(text.toLowerCase()) : undefined;
      const link = (
        <MuiLink href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </MuiLink>
      );
      if (entry) {
        return (
          <GlossaryTooltip term={entry.term} definition={entry.definition} detail={entry.detail} url={entry.url}>
            {link}
          </GlossaryTooltip>
        );
      }
      return link;
    },
    p: ({ children }) => <p>{annotateChildren(children, glossary)}</p>,
    li: ({ children }) => <li>{annotateChildren(children, glossary)}</li>,
    td: ({ children }) => <td>{annotateChildren(children, glossary)}</td>,
  }), [glossary, glossaryMap]);

  return (
    <Box sx={sx} data-testid="content-renderer">
      <ReactMarkdown key={glossary.length} remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}
