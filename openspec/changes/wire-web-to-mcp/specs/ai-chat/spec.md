## MODIFIED Requirements

### Requirement: Chat route uses AI tools for data queries
The chat route SHALL consume tools from the MCP server via the client bridge instead of defining AI SDK tools inline. The route SHALL NOT import data-fetching functions from `@icpexplorer/shared` directly.

#### Scenario: Chat route uses MCP-bridged tools
- **WHEN** the chat route initializes its tool set
- **THEN** it SHALL obtain tools from the MCP client bridge, which dynamically generates AI SDK tools from MCP server metadata

#### Scenario: Tool results are returned to the LLM
- **WHEN** the LLM invokes a tool during a chat conversation
- **THEN** the tool execution SHALL go through the MCP client bridge to the MCP server and return the result to the LLM for response generation

#### Scenario: User experience is unchanged
- **WHEN** a user asks a question that previously triggered an inline tool
- **THEN** the response SHALL contain equivalent data as before the change
