## MODIFIED Requirements

### Requirement: Network stats display component
The web app SHALL display live ICP network statistics on the landing page using a client component that fetches data via TanStack Query. The landing page SHALL also include the chat interface component below the stats grid.

#### Scenario: Stats loaded successfully
- **WHEN** the page loads and the `/api/stats` endpoint returns data
- **THEN** the page SHALL display labeled values for node count, canister count, subnet count, cycle burn rate, total neurons, and total proposals

#### Scenario: Loading state
- **WHEN** the page is loading stats data
- **THEN** a loading indicator SHALL be visible

#### Scenario: Error state
- **WHEN** the `/api/stats` endpoint returns an error
- **THEN** an error message SHALL be displayed to the user

#### Scenario: Chat interface present
- **WHEN** the landing page renders
- **THEN** the chat interface component SHALL be visible below the stats grid
