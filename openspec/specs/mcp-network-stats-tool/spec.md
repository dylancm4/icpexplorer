## ADDED Requirements

### Requirement: Register get_network_stats MCP tool
The MCP server SHALL register a `get_network_stats` tool using `registerTool()` that returns live ICP network statistics.

#### Scenario: Tool invocation
- **WHEN** an MCP client calls the `get_network_stats` tool
- **THEN** the tool SHALL call the shared `fetchNetworkStats()` function and return the results as formatted text content

#### Scenario: Tool has no required parameters
- **WHEN** an MCP client lists available tools
- **THEN** `get_network_stats` SHALL appear with no required input parameters

### Requirement: Tool returns human-readable formatted text
The `get_network_stats` tool SHALL return results as a single text content block with stats formatted as labeled lines (e.g., "Active Nodes: 520").

#### Scenario: Formatted output
- **WHEN** the tool successfully fetches network stats
- **THEN** the returned content SHALL include labeled values for nodes, canisters, subnets, cycle burn rate, total neurons, and total proposals

### Requirement: Tool handles upstream errors
If the shared `fetchNetworkStats()` function throws (e.g., Metrics API unreachable), the tool SHALL return an MCP error response rather than crashing the server.

#### Scenario: Metrics API failure
- **WHEN** an MCP client calls `get_network_stats` and the Metrics API is unreachable
- **THEN** the tool SHALL return an error content block with a descriptive message

### Requirement: Ping tool preserved
The existing `ping` health-check tool SHALL remain registered alongside the new tool.

#### Scenario: Both tools available
- **WHEN** an MCP client lists available tools
- **THEN** both `ping` and `get_network_stats` SHALL be listed
