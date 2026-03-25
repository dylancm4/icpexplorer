"use client";

/**
 * Streaming-safe markdown renderer using Vercel Streamdown.
 *
 * Wraps the Streamdown component with sensible defaults for
 * rendering AI chat assistant messages with shadcn design tokens.
 */

import { Streamdown } from "streamdown";

/** Props for the Markdown component. */
interface MarkdownProps {
  /** The markdown string to render. */
  children: string;
  /** Additional CSS classes to apply. */
  className?: string;
}

/** Renders markdown content with streaming support and shadcn styling. */
export const Markdown = ({ children, className }: MarkdownProps) => {
  return <Streamdown className={className}>{children}</Streamdown>;
};
