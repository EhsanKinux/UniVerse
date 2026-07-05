"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a news item's Markdown body. react-markdown does NOT render raw HTML by
 * default (we deliberately omit rehype-raw), so staff-authored content is
 * XSS-safe: a `<script>` in the body renders as literal text. Styled with the
 * app's design tokens for a clean, RTL article look.
 */
export function NewsBody({ children }: { children: string }) {
  return (
    <div className="space-y-4 text-[15px] leading-8 text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="leading-8">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-4"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc space-y-1 ps-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 ps-5">{children}</ol>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          h1: ({ children }) => (
            <h2 className="text-lg font-bold text-foreground">{children}</h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-base font-bold text-foreground">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-sm font-bold text-foreground">{children}</h4>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-s-4 border-primary/30 bg-muted/40 py-2 pe-3 ps-4 text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px]">
              {children}
            </code>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
