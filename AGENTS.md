# AGENTS.md

Guidance for AI coding agents (Copilot, Claude Code, Cursor, Aider, etc.) working in this repo.

## Build / test / lint

- Build: `./mvnw package` (or `mvn package`)
- Run: `./mvnw spring-boot:run`
- Test: `./mvnw test`

## Conventions

- Java 17+, Spring Boot 3.4. No Kotlin, no Groovy.
- One class per file. Keep files under ~150 lines.
- Use **records** for simple data carriers.
- Tests live under `src/test/java/` mirroring the main source tree, using JUnit 5 + AssertJ.
- Use camelCase for variables/methods, PascalCase for classes.

## Don't touch

- `target/` — generated. Never read or edit.
- `.github/prompts/*.prompt.md` — these are runtime artifacts, edit only with intent.

## Output style

- Be concise. No preamble. No re-explaining the request back to the user.
- Return diffs, not full files, when editing.
- If you need more context, ask one targeted question instead of guessing.
