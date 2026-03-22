## ADDED Requirements

### Requirement: Fetch time-series data from Metrics API
The shared package SHALL export a `fetchTimeSeries()` async function that retrieves historical time-series data for a specified metric from the ICP Metrics API.

#### Scenario: Successful fetch
- **WHEN** `fetchTimeSeries("ic-node-count")` is called and the Metrics API is reachable
- **THEN** a `TimeSeriesData` object (`Record<string, TimeSeriesPoint[]>`) SHALL be returned, mapping each response key (e.g., `total_nodes`, `up_nodes`) to an array of `TimeSeriesPoint` objects with `timestamp` (number) and `value` (number) parsed from the API's string responses

#### Scenario: Supported metrics
- **WHEN** `fetchTimeSeries()` is called with any of `"ic-node-count"`, `"registered-canisters-count"`, `"ic-subnet-total"`, or `"cycle-burn-rate"`
- **THEN** the function SHALL return the corresponding time-series data

#### Scenario: Unsupported metric
- **WHEN** `fetchTimeSeries()` is called with an unsupported metric name
- **THEN** the function SHALL throw an error with a descriptive message

#### Scenario: API unreachable
- **WHEN** `fetchTimeSeries()` is called and the Metrics API returns an error or times out
- **THEN** the function SHALL throw an error with a descriptive message

### Requirement: TimeSeriesPoint type and schema
The shared package SHALL export a `TimeSeriesPoint` type with `timestamp` (number) and `value` (number) fields, and a corresponding `timeSeriesPointSchema` Zod schema.

#### Scenario: Valid data
- **WHEN** valid time-series data is parsed with `timeSeriesPointSchema`
- **THEN** parsing succeeds and returns a typed `TimeSeriesPoint` object

### Requirement: Metric key mapping
The `fetchTimeSeries()` function SHALL map endpoint names to their corresponding response keys:
- `"ic-node-count"` → `["total_nodes", "up_nodes"]`
- `"registered-canisters-count"` → `["running_canisters", "stopped_canisters"]`
- `"ic-subnet-total"` → `["ic_subnet_total"]`
- `"cycle-burn-rate"` → `["cycle_burn_rate"]`

#### Scenario: Correct key extraction
- **WHEN** `fetchTimeSeries("ic-node-count")` is called
- **THEN** the function SHALL return a `TimeSeriesData` object with keys `total_nodes` and `up_nodes`, each mapping to a `TimeSeriesPoint[]`

### Requirement: Optional time-range parameters
The `fetchTimeSeries()` function SHALL accept optional `start` (Unix timestamp), `end` (Unix timestamp), and `step` (seconds) parameters to control the time range and resolution of the returned data. These are passed as query parameters to the Metrics API.

#### Scenario: Default time range
- **WHEN** `fetchTimeSeries("ic-node-count")` is called without time-range options
- **THEN** the function SHALL call the endpoint without `start`/`end`/`step` query params, returning the API's default range

#### Scenario: Custom time range
- **WHEN** `fetchTimeSeries("ic-node-count", { start: 1773606374, step: 86400 })` is called
- **THEN** the function SHALL pass `start` and `step` as query parameters to the Metrics API
