## ADDED Requirements

### Requirement: Stats API route handler
The web app SHALL expose a `GET /api/stats` route handler that calls the shared `fetchNetworkStats()` function and returns the result as JSON.

#### Scenario: Successful response
- **WHEN** a GET request is made to `/api/stats`
- **THEN** the response SHALL be a JSON object with HTTP 200 containing all `NetworkStats` fields

#### Scenario: Upstream API failure
- **WHEN** the shared `fetchNetworkStats()` throws an error
- **THEN** the route handler SHALL return HTTP 500 with a JSON error message

### Requirement: Network stats display component
The web app SHALL display live ICP network statistics on the landing page using a client component that fetches data via TanStack Query.

#### Scenario: Stats loaded successfully
- **WHEN** the page loads and the `/api/stats` endpoint returns data
- **THEN** the page SHALL display labeled values for node count, canister count, subnet count, cycle burn rate, total neurons, and total proposals

#### Scenario: Loading state
- **WHEN** the page is loading stats data
- **THEN** a loading indicator SHALL be visible

#### Scenario: Error state
- **WHEN** the `/api/stats` endpoint returns an error
- **THEN** an error message SHALL be displayed to the user

### Requirement: TanStack Query provider
The web app SHALL wrap the component tree with a `QueryClientProvider` so that `useQuery` hooks function correctly.

#### Scenario: Provider configured
- **WHEN** the app renders
- **THEN** TanStack Query's `QueryClientProvider` SHALL be present in the component tree above any components using `useQuery`
