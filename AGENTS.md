# AGENTS.md

## Agent Guidelines for InheronMUD

1. **Autonomy & Workflow**:
   - Work in branches (`feat/`, `fix/`, `chore/`).
   - Create PRs at the end of logical work units.
   - Summarize commands executed, tests run, and potential risks in PR descriptions.

2. **Data Modeling Constraints**:
   - Do NOT couple the `Player` model irreversibly to real user identity (`Account`). Maintain separation: `Account -> Character/Player`.

3. **Architecture Boundaries**:
   - The `engine` package must be pure TypeScript. It must **not** know about HTTP (Fastify) or WebSockets.

4. **Observability & Logging**:
   - Use `EventLog` for audit, debug, and trace purposes.
   - Required log fields for commands: `request_id`, `command_id`, `player_id`, `input`, `command_type`, `room_id`, `ok/error`, `duration_ms`, `event_ids`.

5. **Safety**:
   - Do not perform destructive database actions without explicit approval.
   - Backups are only considered valid once restoration has been successfully tested.
