### Requirement: ThemeProvider wraps application
The application SHALL use `next-themes` ThemeProvider to manage dark/light mode, configured with `attribute="class"`, `defaultTheme="system"`, and `enableSystem`.

#### Scenario: System theme detected on first visit
- **WHEN** a user visits the application for the first time
- **THEN** the theme SHALL match the user's OS preference (light or dark)

#### Scenario: No hydration flash
- **WHEN** the page loads with server-side rendering
- **THEN** the `<html>` element SHALL have `suppressHydrationWarning` to prevent hydration mismatch from the injected theme script

### Requirement: Dark mode toggle component
The application SHALL include a mode toggle component that allows users to switch between light, dark, and system themes.

#### Scenario: Toggle between themes
- **WHEN** the user clicks the mode toggle
- **THEN** a dropdown SHALL appear with Light, Dark, and System options

#### Scenario: Theme persists across sessions
- **WHEN** the user selects a theme and refreshes the page
- **THEN** the selected theme SHALL persist (via next-themes localStorage)

### Requirement: shadcn components adapt to theme
All shadcn/ui components SHALL automatically adapt to the active theme via CSS variables defined in the `.dark` class in globals.css.

#### Scenario: Dark mode styling
- **WHEN** dark mode is active
- **THEN** all shadcn components SHALL use the dark color palette defined by the CSS custom properties in `.dark`
