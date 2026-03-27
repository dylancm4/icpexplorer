## Requirements

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

### Requirement: System prompt constrains Claude to ICP data
The chat route SHALL include a system prompt that instructs Claude to act as an ICP network data assistant, use the provided tools to answer questions, and not fabricate data.

#### Scenario: Grounded responses
- **WHEN** a user asks about ICP network data
- **THEN** Claude SHALL use tools to fetch data before answering, rather than relying on training knowledge

#### Scenario: Out-of-scope questions
- **WHEN** a user asks about something unrelated to ICP network data
- **THEN** Claude SHALL explain that it can only help with ICP network data queries

### Requirement: Chat UI component
The web app SHALL include a client component that provides a chat interface using `useChat()` from `@ai-sdk/react`, built with shadcn/ui primitives (Card, Button, Badge, Textarea).

#### Scenario: Message display
- **WHEN** the chat component renders with messages
- **THEN** it SHALL display messages inside a shadcn Card with a native overflow container, using the flex-col-reverse pattern for automatic scroll anchoring to the newest message

#### Scenario: Message input
- **WHEN** the user types a message and presses Enter
- **THEN** the message SHALL be sent to `/api/chat` and the assistant's streaming response SHALL appear in the message list
- **WHEN** the user presses Shift+Enter
- **THEN** a newline SHALL be inserted in the Textarea without submitting

#### Scenario: Tool invocation display
- **WHEN** Claude invokes a tool during a response
- **THEN** the UI SHALL display a Badge with a lucide-react icon (Loader2 spinning while running, Check when done, X on error) and the tool's human-readable label

#### Scenario: Loading state
- **WHEN** a message has been sent and a response is streaming
- **THEN** the Send button SHALL be disabled and the UI SHALL indicate the assistant is responding

#### Scenario: Empty state with suggestions
- **WHEN** the chat has no messages
- **THEN** the UI SHALL display an empty state with example question suggestions that the user can click to send

#### Scenario: Copy assistant message
- **WHEN** the user hovers over an assistant message
- **THEN** a copy button SHALL appear that copies the message text to the clipboard

#### Scenario: User message styling
- **WHEN** a user message is displayed
- **THEN** it SHALL be right-aligned with a primary background color using shadcn design tokens

#### Scenario: Assistant message with markdown
- **WHEN** an assistant message contains text
- **THEN** the text SHALL be rendered using the Streamdown markdown component instead of plain text

#### Scenario: Error display
- **WHEN** a chat error occurs
- **THEN** the error SHALL be displayed using destructive-colored text within the Card layout
