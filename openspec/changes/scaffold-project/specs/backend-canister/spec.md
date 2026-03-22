## ADDED Requirements

### Requirement: Motoko canister with canister.yaml
The backend SHALL be a Motoko canister located at `backend/` with a `canister.yaml` using the `@dfinity/motoko` recipe, a `main.mo` entry point in `backend/src/`, and a `backend.did` Candid interface file.

#### Scenario: Canister builds
- **WHEN** `icp build backend` is executed from the project root
- **THEN** the Motoko source compiles to a WASM module without errors

### Requirement: Minimal actor with a greet function
The backend SHALL expose a minimal `greet` function that accepts a `Text` argument and returns a greeting string. This serves as a smoke test to verify the full stack works end-to-end.

#### Scenario: Greet function returns a greeting
- **WHEN** the `greet` function is called with the argument `"World"`
- **THEN** it returns `"Hello, World!"`

### Requirement: Candid interface matches actor
The `backend.did` file SHALL accurately describe the public interface of the Motoko actor, including the `greet` function signature.

#### Scenario: Candid file is valid
- **WHEN** the Candid file is parsed
- **THEN** it declares a service with a `greet` function that takes a `text` parameter and returns a `text` value

### Requirement: Mops package manager configured
The backend SHALL include a `mops.toml` file for the Motoko package manager, configured and ready for adding dependencies.

#### Scenario: Mops is initialized
- **WHEN** `mops install` is run in `backend/`
- **THEN** it completes without errors
