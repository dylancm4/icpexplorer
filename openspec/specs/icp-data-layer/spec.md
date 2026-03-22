## ADDED Requirements

### Requirement: Fetch network statistics from Metrics API
The shared package SHALL export a `fetchNetworkStats()` async function that queries the ICP Metrics API (`metrics-api.internetcomputer.org`) and returns a `NetworkStats` object containing node count, canister count, subnet count, cycle burn rate, and governance metrics.

#### Scenario: Successful fetch
- **WHEN** `fetchNetworkStats()` is called and the Metrics API is reachable
- **THEN** a `NetworkStats` object is returned with numeric values for `totalNodes`, `upNodes`, `runningCanisters`, `stoppedCanisters`, `totalSubnets`, `averageCycleBurnRate`, `totalNeurons`, and `totalProposals`

#### Scenario: API unreachable
- **WHEN** `fetchNetworkStats()` is called and the Metrics API returns an error or times out
- **THEN** the function SHALL throw an error with a descriptive message

### Requirement: NetworkStats type and Zod schema
The shared package SHALL export a `NetworkStats` TypeScript type and a corresponding `networkStatsSchema` Zod schema for runtime validation of API response data.

#### Scenario: Valid data passes schema
- **WHEN** valid network stats data is parsed with `networkStatsSchema`
- **THEN** parsing succeeds and returns a typed `NetworkStats` object

#### Scenario: Invalid data fails schema
- **WHEN** malformed data is parsed with `networkStatsSchema`
- **THEN** parsing throws a Zod validation error

### Requirement: Prefer Metrics API over IC API
When ICP data is available from both `metrics-api.internetcomputer.org` and `ic-api.internetcomputer.org`, the shared data layer SHALL always use the Metrics API.

#### Scenario: Data source selection
- **WHEN** a data-fetching function needs node count, canister count, or cycle burn rate
- **THEN** it SHALL query `metrics-api.internetcomputer.org`, not `ic-api.internetcomputer.org`
