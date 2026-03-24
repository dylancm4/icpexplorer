## MODIFIED Requirements

### Requirement: Chat UI component
The web app SHALL include a client component that provides a chat interface using `useChat()` from `@ai-sdk/react`, built with shadcn/ui primitives (Card, ScrollArea, Button, Badge, Textarea).

#### Scenario: Message display
- **WHEN** the chat component renders with messages
- **THEN** it SHALL display messages inside a shadcn Card with a ScrollArea, using the flex-col-reverse pattern for automatic scroll anchoring to the newest message

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
