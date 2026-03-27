## ADDED Requirements

### Requirement: MCP server provides get_metrics tool
The MCP server SHALL register a `get_metrics` tool that returns the current value(s) of one or more named metrics from the ICP Dashboard APIs.

#### Scenario: Fetch a single metric
- **WHEN** `get_metrics` is called with `metrics: "node_count"`
- **THEN** it SHALL return a JSON object with the metric name as key and its current numeric value

#### Scenario: Fetch multiple metrics
- **WHEN** `get_metrics` is called with `metrics: ["node_count", "subnet_count", "total_neurons"]`
- **THEN** it SHALL return a JSON object with each requested metric name as key and its current numeric value

#### Scenario: Invalid metric name
- **WHEN** `get_metrics` is called with an unsupported metric name
- **THEN** it SHALL return an error result with `isError: true` describing the invalid metric

### Requirement: MCP server provides get_time_series tool
The MCP server SHALL register a `get_time_series` tool that returns historical data points for a single named metric over a time range.

#### Scenario: Fetch time series with start only
- **WHEN** `get_time_series` is called with `metric` and `start`
- **THEN** it SHALL return data points from `start` to the current time

#### Scenario: Fetch time series with start and end
- **WHEN** `get_time_series` is called with `metric`, `start`, and `end`
- **THEN** it SHALL return data points within the specified time range

#### Scenario: Fetch time series with custom step
- **WHEN** `get_time_series` is called with an optional `step` parameter
- **THEN** it SHALL use the provided step interval for data aggregation

#### Scenario: Invalid metric name
- **WHEN** `get_time_series` is called with an unsupported metric name
- **THEN** it SHALL return an error result with `isError: true` describing the invalid metric

### Requirement: Metric tools share a common metric namespace
The `get_metrics` and `get_time_series` tools SHALL use the same set of metric names. A metric supported in `get_metrics` SHALL also be queryable in `get_time_series` where the underlying API supports historical data.

#### Scenario: Same metric name works in both tools
- **WHEN** a metric name is valid for `get_metrics`
- **THEN** the same name SHALL be accepted by `get_time_series` (if the metric supports time-series data)

### Requirement: Metric tools cover current chat route capabilities
The initial metric set SHALL include at minimum: `node_count`, `subnet_count`, `canister_count`, `cycle_burn_rate`, `total_neurons`, and `total_proposals`.

#### Scenario: Network overview metrics are available
- **WHEN** `get_metrics` is called with `["node_count", "subnet_count", "canister_count", "cycle_burn_rate"]`
- **THEN** it SHALL return current values for all four metrics

#### Scenario: Governance metrics are available
- **WHEN** `get_metrics` is called with `["total_neurons", "total_proposals"]`
- **THEN** it SHALL return current values for both metrics
