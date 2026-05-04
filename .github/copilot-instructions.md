# Copilot instructions

You are working in a small Java Spring Boot demo app used in a tech session.

## Build, test, lint
- Build: `./mvnw package` (or `mvn package`)
- Run: `./mvnw spring-boot:run`
- Test: `./mvnw test` (uses JUnit 5 + AssertJ)

## Conventions
- Java 17+, Spring Boot 3.4. No Kotlin.
- Keep files under ~150 lines.
- Use **records** for data carriers.
- Tests live under `src/test/java/` mirroring the main source tree.
- camelCase for variables/methods; PascalCase for classes.

## Don't
- Don't read or edit `target/`.
- Don't re-emit whole files when a small diff would do.
- Don't restate the request before answering.

## Output style
- Be concise. No preamble.
- Prefer diffs over full files.
- If context is missing, ask one targeted question.
