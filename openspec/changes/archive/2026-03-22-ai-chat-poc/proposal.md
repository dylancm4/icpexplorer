## Why

The ICP Explorer advertises itself as "AI-powered" but has no AI functionality yet. The end-to-end POC proved the data layer works — now we need a minimal chat interface where users can ask natural-language questions about ICP network data and get answers powered by Claude via tool use. This is the core value proposition of the project.

## What Changes

- Add a chat API route (`POST /api/chat`) using Vercel AI SDK's `streamText()` with `@ai-sdk/anthropic`, defining tools that call shared data functions
- Add a chat UI component using Vercel AI SDK's `useChat()` hook with streaming message display, tool result rendering, and input handling
- Expand the shared data layer with time-series query functions so Claude can answer historical questions (e.g., "How has the node count changed this week?")
- Add `ANTHROPIC_API_KEY` environment variable configuration for the Claude API

## Capabilities

### New Capabilities
- `ai-chat`: Chat API route and UI component that streams Claude responses with tool-calling support for ICP data queries
- `icp-time-series`: Shared functions for querying historical time-series data from the Metrics API, complementing the existing snapshot in `fetchNetworkStats()`

### Modified Capabilities
- `web-stats-display`: Landing page updated to include the chat interface alongside the existing stats grid

## Impact

- **packages/shared**: New time-series query functions and types. No new dependencies.
- **packages/web**: New chat API route, chat UI component, updated landing page. No new dependencies (`ai` and `@ai-sdk/anthropic` already installed).
- **Environment**: Requires `ANTHROPIC_API_KEY` env var.
- **External APIs**: Continues using `metrics-api.internetcomputer.org` (existing). Adds calls to Anthropic API for Claude model inference.
