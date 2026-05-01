# Copilot instructions

You are working in a small Node.js demo app used in a tech session.

## Build, test, lint
- Install: `npm install`
- Run: `npm start`
- Test: `npm test` (uses the built-in `node --test` runner)

## Conventions
- Plain JavaScript, ES modules. No TypeScript.
- Keep files under ~150 lines.
- Use **named exports**. No default exports.
- Tests live next to the source as `*.test.js`.
- camelCase for variables/functions; PascalCase for classes.

## Don't
- Don't read or edit `dist/`.
- Don't propose adding TypeScript, Jest, or Vitest — `node --test` is the choice here.
- Don't re-emit whole files when a small diff would do.
- Don't restate the request before answering.

## Output style
- Be concise. No preamble.
- Prefer diffs over full files.
- If context is missing, ask one targeted question.
