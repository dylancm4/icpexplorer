## Context

The current Chat component (`packages/web/src/app/components/chat.tsx`) is a working POC built with raw HTML and inline Tailwind. It uses AI SDK v6 `useChat()` with `sendMessage` and `message.parts` correctly, but has two bugs: no auto-scroll on new messages, and assistant text renders as plain `whitespace-pre-wrap` with no markdown support. shadcn/ui was initialized in the web package on 2026-03-24 with Card, Button, Badge, ScrollArea, and Textarea components already installed. The globals.css has full light/dark CSS variable definitions but no ThemeProvider to toggle between them.

The existing `Providers` component wraps only TanStack Query. The root layout is a Server Component with Geist fonts.

## Goals / Non-Goals

**Goals:**
- Establish dark mode infrastructure using next-themes (official shadcn recommendation)
- Rebuild the Chat component using shadcn primitives for a consistent design language
- Fix auto-scroll with the flex-col-reverse pattern
- Add streaming-safe markdown rendering via Vercel Streamdown
- Improve UX with empty state suggestions, copy button, and Textarea input

**Non-Goals:**
- Changing the `/api/chat` route or tool definitions
- Adding new tools or modifying the system prompt
- Auto-resizing textarea, message grouping, or regenerate button (future work)
- Using community shadcn registries or third-party chat component libraries

## Decisions

### 1. Streamdown for markdown rendering
**Choice**: Vercel Streamdown over react-markdown or prompt-kit.
**Why**: Built by Vercel specifically for AI streaming + Next.js. Uses shadcn design tokens natively (no `@tailwindcss/typography` needed). Handles unterminated markdown during token streaming gracefully. Same ecosystem as AI SDK.
**Alternatives considered**: react-markdown (not streaming-safe), prompt-kit (third-party registry, violates our official-only policy).

### 2. flex-col-reverse for auto-scroll
**Choice**: CSS `flex-direction: column-reverse` on the message container.
**Why**: Browser natively anchors scroll to the bottom. No custom scroll hook, no `useEffect`, no `scrollIntoView`. Proven pattern from shadcn-chat community implementations.
**Alternatives considered**: `useRef` + `scrollIntoView` (requires effect, doesn't handle edge cases like image loading), IntersectionObserver (over-engineered for this use case).

### 3. next-themes for dark mode
**Choice**: `next-themes` with class-based strategy, added to the existing Providers component.
**Why**: Official shadcn/ui recommendation. Our globals.css already has `.dark` class with oklch variables. Just need ThemeProvider + toggle.
**Alternatives considered**: Manual class toggling (no system preference detection, no SSR flash prevention).

### 4. ThemeProvider in existing Providers component
**Choice**: Add ThemeProvider inside the existing `Providers` component rather than creating a separate wrapper.
**Why**: Keeps the provider tree flat and centralized. The Providers component already exists as the "use client" boundary in the layout.

### 5. Textarea with keyboard handling
**Choice**: shadcn Textarea with Enter-to-submit, Shift+Enter for newline.
**Why**: Universal chat pattern across all community implementations. Textarea allows multi-line input which is better for data queries.

## Risks / Trade-offs

**Streamdown is newer than react-markdown** — It has fewer downloads and a smaller community. Mitigation: backed by Vercel, actively maintained (latest release March 2026), and our use case (basic markdown + code blocks) is well within its core feature set.

**flex-col-reverse reverses DOM order** — Screen readers may read messages in reverse. Mitigation: use `aria-live="polite"` on the message container so assistive tech announces new messages in arrival order.

**Streamdown CSS import adds to bundle** — The `@source` directive pulls in Streamdown styles. Mitigation: minimal overhead; Streamdown is designed to be lightweight and tree-shakeable.
