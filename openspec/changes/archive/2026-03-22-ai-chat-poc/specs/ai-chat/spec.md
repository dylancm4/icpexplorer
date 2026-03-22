## ADDED Requirements

### Requirement: Chat API route streams Claude responses with tool use
The web app SHALL expose a `POST /api/chat` route handler that uses Vercel AI SDK's `streamText()` with the Anthropic provider to stream Claude responses, with tools defined for querying ICP network data.

#### Scenario: Successful chat response
- **WHEN** a POST request is made to `/api/chat` with a valid message array
- **THEN** the response SHALL be a streaming text response from Claude, using `claude-sonnet-4-6`

#### Scenario: Tool invocation during chat
- **WHEN** a user asks a question that requires ICP data (e.g., "How many nodes are running?")
- **THEN** Claude SHALL call the appropriate tool, receive the result, and incorporate it into its streamed response

#### Scenario: Missing API key
- **WHEN** the `ANTHROPIC_API_KEY` environment variable is not set
- **THEN** the route handler SHALL return an error response indicating the API key is missing

### Requirement: Chat tools for ICP data
The chat route SHALL define three tools using Vercel AI SDK's `tool()` helper:

#### Scenario: getNetworkStats tool
- **WHEN** Claude calls the `getNetworkStats` tool
- **THEN** the tool SHALL call `fetchNetworkStats()` from `@icpexplorer/shared` and return the full `NetworkStats` object

#### Scenario: getTimeSeries tool
- **WHEN** Claude calls the `getTimeSeries` tool with a `metric` parameter
- **THEN** the tool SHALL call `fetchTimeSeries()` from `@icpexplorer/shared` with the specified metric and return the time-series data

#### Scenario: getGovernanceStats tool
- **WHEN** Claude calls the `getGovernanceStats` tool
- **THEN** the tool SHALL call `fetchNetworkStats()` and return only the governance-related fields (`totalNeurons`, `totalProposals`)

### Requirement: System prompt constrains Claude to ICP data
The chat route SHALL include a system prompt that instructs Claude to act as an ICP network data assistant, use the provided tools to answer questions, and not fabricate data.

#### Scenario: Grounded responses
- **WHEN** a user asks about ICP network data
- **THEN** Claude SHALL use tools to fetch data before answering, rather than relying on training knowledge

#### Scenario: Out-of-scope questions
- **WHEN** a user asks about something unrelated to ICP network data
- **THEN** Claude SHALL explain that it can only help with ICP network data queries

### Requirement: Chat UI component
The web app SHALL include a client component that provides a chat interface using `useChat()` from `@ai-sdk/react`.

#### Scenario: Message display
- **WHEN** the chat component renders
- **THEN** it SHALL display a scrollable list of user and assistant messages

#### Scenario: Message input
- **WHEN** the user types a message and submits it
- **THEN** the message SHALL be sent to `/api/chat` and the assistant's streaming response SHALL appear in the message list

#### Scenario: Tool invocation display
- **WHEN** Claude invokes a tool during a response
- **THEN** the UI SHALL display an indicator showing which tool is being called

#### Scenario: Loading state
- **WHEN** a message has been sent and a response is streaming
- **THEN** the UI SHALL indicate that the assistant is responding
