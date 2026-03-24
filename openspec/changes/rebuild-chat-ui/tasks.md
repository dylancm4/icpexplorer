## 1. Dependencies

- [ ] 1.1 Install `next-themes` in `packages/web`
- [ ] 1.2 Install `streamdown` in `packages/web`

## 2. Dark Mode Setup

- [ ] 2.1 Add `suppressHydrationWarning` to `<html>` in `layout.tsx`
- [ ] 2.2 Add `next-themes` ThemeProvider to the existing `Providers` component with `attribute="class"`, `defaultTheme="system"`, `enableSystem`
- [ ] 2.3 Create a mode toggle component at `components/mode-toggle.tsx` using shadcn DropdownMenu with Light/Dark/System options
- [ ] 2.4 Add the mode toggle to the page layout (e.g. top-right corner of the main page)

## 3. Streamdown Markdown Component

- [ ] 3.1 Add Streamdown `@source` directive to `globals.css` so Tailwind processes its utility classes
- [ ] 3.2 Create a `components/markdown.tsx` wrapper that renders Streamdown with appropriate props for chat message content

## 4. Chat UI Rebuild

- [ ] 4.1 Rewrite the Chat component structure using shadcn Card (CardHeader/CardContent/CardFooter)
- [ ] 4.2 Implement message list with ScrollArea and flex-col-reverse for auto-scroll, add `aria-live="polite"`
- [ ] 4.3 Replace plain text rendering with the Streamdown markdown component for assistant messages
- [ ] 4.4 Replace tool status indicators with Badge + lucide-react icons (Loader2, Check, X)
- [ ] 4.5 Replace `<input>` with shadcn Textarea, implement Enter-to-submit and Shift+Enter for newline
- [ ] 4.6 Style user messages right-aligned with primary background using shadcn design tokens
- [ ] 4.7 Add empty state with clickable example question suggestions
- [ ] 4.8 Add copy button on assistant messages (visible on hover)
- [ ] 4.9 Style error display using destructive color tokens within the Card layout

## 5. Verification

- [ ] 5.1 Verify the app builds without errors (`turbo build`)
- [ ] 5.2 Manual test: send a message, verify auto-scroll, markdown rendering, tool badges, copy button, dark mode toggle
