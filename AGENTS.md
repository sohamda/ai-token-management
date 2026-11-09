# AGENTS.md

Guidance for AI coding agents (Claude Code, Copilot, Cursor, Aider, etc.) working in this repo.
Claude Code reads this file natively when there is no CLAUDE.md.

## Build / test / lint

- Build: `mvn package`
- Run: `mvn spring-boot:run`
- Test: `mvn test` (one class: `mvn test -Dtest=<ClassName>Test`)

## Conventions

- Java 17+, Spring Boot 3.4. No Kotlin, no Groovy.
- One class per file. Keep files under ~150 lines.
- Use **records** for simple data carriers.
- Tests live under `src/test/java/` mirroring the main source tree, using JUnit 5 + AssertJ.
- Use camelCase for variables/methods, PascalCase for classes.

## Don't touch

- `target/` — generated. Never read or edit.
- `.github/prompts/*.prompt.md` and `.claude/agents/*.md` — demo artifacts, edit only with intent.

## Output style

- Be concise. No preamble. No re-explaining the request back to the user.
- Return diffs, not full files, when editing.
- If you need more context, ask one targeted question instead of guessing.
