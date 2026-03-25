## Why

The current Chat component is a POC with raw HTML and inline Tailwind that has two bugs: no auto-scroll when new messages arrive, and no markdown rendering for assistant responses. shadcn/ui was just initialized in the web package — it's time to set it up properly as the project's design system and rebuild the chat UI on shadcn primitives for a polished, consistent experience.

## What Changes

### shadcn/ui design system setup
- Install `next-themes` and add a ThemeProvider wrapper to the root layout (official shadcn recommendation for Next.js)
- Add a dark mode toggle component
- Ensure `<html>` has `suppressHydrationWarning` for hydration safety

### Chat UI rebuild
- Replace raw `<div>` + inline Tailwind chat layout with shadcn Card/CardHeader/CardContent/CardFooter
- Add auto-scroll using `flex-col-reverse` pattern (proven pattern from shadcn-chat community)
- Render assistant text as streaming-safe markdown using Vercel Streamdown instead of plain `whitespace-pre-wrap` text
- Replace inline tool status indicators with Badge components and lucide-react icons
- Replace `<input>` with Textarea supporting Enter-to-submit / Shift+Enter for newline
- Add empty state with example questions / suggestion prompts
- Add copy button on assistant messages

### Dependencies
- Install `streamdown` (Vercel's drop-in react-markdown replacement, designed for AI streaming, uses shadcn design tokens natively)
- Install `next-themes` (official shadcn dark mode recommendation)

## Capabilities

### New Capabilities
- `dark-mode`: Dark mode support via next-themes with ThemeProvider and user toggle
- `markdown-rendering`: Streaming-safe markdown renderer using Vercel Streamdown, styled with shadcn design tokens

### Modified Capabilities
- `ai-chat`: Chat UI rebuilt with shadcn primitives, auto-scroll fix, markdown rendering for assistant text, Badge-based tool indicators, Textarea input, empty state with suggestions, copy button on messages

## Impact

- **Code**: `packages/web/src/app/components/chat.tsx` (full rewrite), new markdown component, new ThemeProvider, new mode toggle, layout.tsx updated with ThemeProvider wrapper
- **Dependencies**: `streamdown`, `next-themes` added to `packages/web/package.json`
- **Styling**: `globals.css` updated with Streamdown `@source` directive
- **No API changes**: `useChat()` integration and `/api/chat` route remain unchanged
