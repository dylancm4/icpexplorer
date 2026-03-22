## 1. Shared Time-Series Data Layer

- [x] 1.1 Add `TimeSeriesPoint` type (`{ timestamp: number; value: number }`) and `TimeSeriesData` type (`Record<string, TimeSeriesPoint[]>`) to `packages/shared/src/types.ts`
- [x] 1.2 Add `timeSeriesPointSchema` to `packages/shared/src/schemas.ts`
- [x] 1.3 Create `fetchTimeSeries()` function in `packages/shared/src/api/metrics.ts` with metric-to-key mapping for 4 endpoints (`ic-node-count`, `registered-canisters-count`, `ic-subnet-total`, `cycle-burn-rate`), optional `start`/`end`/`step` params, returning `TimeSeriesData` (`Record<string, TimeSeriesPoint[]>`)
- [x] 1.4 Update `packages/shared/src/index.ts` to re-export new types, schemas, and `fetchTimeSeries`
- [x] 1.5 Verify shared package builds

## 2. Chat API Route

- [x] 2.1 Add `@ai-sdk/react` as a dependency to `packages/web/package.json`
- [x] 2.2 Create `packages/web/src/app/api/chat/route.ts` with `POST` handler using `streamText()`, `anthropic()` provider, system prompt, and three tool definitions (`getNetworkStats`, `getTimeSeries`, `getGovernanceStats`)
- [x] 2.3 Verify the chat route builds and responds to a test request (requires `ANTHROPIC_API_KEY` in `.env.local`)

## 3. Chat UI Component

- [x] 3.1 Create `packages/web/src/app/components/chat.tsx` client component with `useChat()`, message list, tool invocation indicators, and text input
- [x] 3.2 Update `packages/web/src/app/page.tsx` to include the `Chat` component below the stats grid

## 4. Integration Verification

- [x] 4.1 Run `npm run build` (all packages build)
- [x] 4.2 Run `npm run lint` (Biome passes)
- [x] 4.3 Run `npm test` (Vitest passes)
- [x] 4.4 Verify chat works in dev mode: ask "How many nodes are running?" and confirm Claude uses tools to answer
