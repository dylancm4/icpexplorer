## ADDED Requirements

### Requirement: Fetch time-series data from Metrics API
The shared package SHALL export a `fetchTimeSeries()` async function that retrieves historical time-series data for a specified metric from the ICP Metrics API.

#### Scenario: Successful fetch
- **WHEN** `fetchTimeSeries("ic-node-count")` is called and the Metrics API is reachable
- **THEN** an array of `TimeSeriesPoint` objects SHALL be returned, each containing a `timestamp` (number) and `value` (number) parsed from the API's string responses

#### Scenario: Supported metrics
- **WHEN** `fetchTimeSeries()` is called with any of `"ic-node-count"`, `"registered-canisters-count"`, `"ic-subnet-total"`, or `"average-cycle-burn-rate"`
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
The `fetchTimeSeries()` function SHALL map endpoint names to their corresponding response keys (e.g., `"ic-node-count"` maps to `"total_nodes"` and `"up_nodes"` response keys).

#### Scenario: Correct key extraction
- **WHEN** `fetchTimeSeries("ic-node-count")` is called
- **THEN** the function SHALL return data keyed by the actual response field names (e.g., `total_nodes`, `up_nodes`)
