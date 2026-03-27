## Requirements

### Requirement: MCP client bridge spawns MCP server via stdio
The web package SHALL provide a bridge module that spawns the `@icpexplorer/mcp-server` as a child process using stdio transport and maintains a singleton MCP client connection.

#### Scenario: First request initializes the client
- **WHEN** the bridge is called for the first time
- **THEN** it SHALL spawn the MCP server child process, establish a stdio connection, and return a connected MCP client

#### Scenario: Subsequent requests reuse the client
- **WHEN** the bridge is called after initialization
- **THEN** it SHALL return the existing MCP client without spawning a new process

#### Scenario: Client reconnects after disconnection
- **WHEN** the MCP server child process exits or becomes unresponsive
- **THEN** the bridge SHALL detect the disconnection and respawn the process on the next request

### Requirement: Bridge dynamically derives AI SDK tools from MCP metadata
The bridge SHALL call `client.listTools()` to discover available MCP tools and generate Vercel AI SDK `tool()` definitions from the MCP tool schemas (name, description, inputSchema). Tool execution SHALL call `client.callTool()`.

#### Scenario: MCP tools are bridged to AI SDK tools
- **WHEN** the bridge generates AI SDK tools
- **THEN** each MCP tool SHALL produce a corresponding AI SDK tool with matching name, description, and input schema

#### Scenario: New MCP tool is automatically available
- **WHEN** a new tool is registered in the MCP server
- **THEN** the bridge SHALL expose it as an AI SDK tool without any changes to the web package

### Requirement: Bridge returns structured tool results
The bridge SHALL parse MCP tool results and return them as structured data to the AI SDK.

#### Scenario: Successful tool execution
- **WHEN** an MCP tool returns a result with `content[].type === "text"`
- **THEN** the bridge SHALL parse the text as JSON and return it as the AI SDK tool result

#### Scenario: Tool execution error
- **WHEN** an MCP tool returns a result with `isError: true`
- **THEN** the bridge SHALL propagate the error message to the AI SDK
