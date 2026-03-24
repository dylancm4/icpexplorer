## ADDED Requirements

### Requirement: Streaming markdown renderer
The application SHALL include a markdown rendering component using Vercel Streamdown that renders assistant message text as formatted markdown during streaming.

#### Scenario: Basic markdown rendering
- **WHEN** the assistant responds with markdown (headings, bold, italic, lists, links)
- **THEN** the text SHALL render as formatted HTML using Streamdown

#### Scenario: Code block rendering
- **WHEN** the assistant responds with fenced code blocks
- **THEN** the code SHALL render with syntax highlighting via Streamdown's built-in support

#### Scenario: Streaming safety
- **WHEN** markdown is being streamed token-by-token (e.g., an unterminated code block)
- **THEN** the renderer SHALL display the partial content gracefully without layout thrashing or errors

### Requirement: Streamdown uses shadcn design tokens
The Streamdown styles SHALL integrate with the shadcn/ui theme system via CSS variables.

#### Scenario: Theme-consistent markdown
- **WHEN** markdown is rendered in dark mode
- **THEN** the markdown styles (text color, code background, link color) SHALL use the shadcn dark palette

#### Scenario: Streamdown CSS loaded
- **WHEN** the application builds
- **THEN** globals.css SHALL include the Streamdown `@source` directive so Tailwind processes Streamdown's utility classes
