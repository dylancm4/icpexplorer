## 1. Shared Time-Series Data Layer

- [ ] 1.1 Add `TimeSeriesPoint` and `TimeSeriesData` types to `packages/shared/src/types.ts`
- [ ] 1.2 Add `timeSeriesPointSchema` to `packages/shared/src/schemas.ts`
- [ ] 1.3 Create `fetchTimeSeries()` function in `packages/shared/src/api/metrics.ts` with metric-to-key mapping for the 4 supported time-series endpoints
- [ ] 1.4 Update `packages/shared/src/index.ts` to re-export new types, schemas, and `fetchTimeSeries`
- [ ] 1.5 Verify shared package builds

## 2. Chat API Route

- [ ] 2.1 Add `@ai-sdk/react` as a dependency to `packages/web/package.json`
- [ ] 2.2 Create `packages/web/src/app/api/chat/route.ts` with `POST` handler using `streamText()`, `anthropic()` provider, system prompt, and three tool definitions (`getNetworkStats`, `getTimeSeries`, `getGovernanceStats`)
- [ ] 2.3 Verify the chat route builds and responds to a test request (requires `ANTHROPIC_API_KEY` in `.env.local`)

## 3. Chat UI Component

- [ ] 3.1 Create `packages/web/src/app/components/chat.tsx` client component with `useChat()`, message list, tool invocation indicators, and text input
- [ ] 3.2 Update `packages/web/src/app/page.tsx` to include the `Chat` component below the stats grid

## 4. Integration Verification

- [ ] 4.1 Run `npm run build` (all packages build)
- [ ] 4.2 Run `npm run lint` (Biome passes)
- [ ] 4.3 Run `npm test` (Vitest passes)
- [ ] 4.4 Verify chat works in dev mode: ask "How many nodes are running?" and confirm Claude uses tools to answer
