# AGENTS.md

Guidance for AI coding agents (Copilot, Claude Code, Cursor, Aider, etc.) working in this repo.

## Build / test / lint

- Install: `npm install`
- Run: `npm start`
- Test: `npm test`
- Lint: `npm run lint`

## Conventions

- Node.js 20+. Plain JavaScript (ES modules), no TypeScript.
- One module = one file. Keep files under ~150 lines.
- Use **named exports**. No default exports.
- Tests live next to the source as `*.test.js` and use the built-in `node --test` runner.
- Use camelCase for variables/functions, PascalCase for classes.

## Don't touch

- `dist/` — generated. Never read or edit.
- Any `*.snapshot.json` — test fixtures.
- `.github/prompts/*.prompt.md` — these are runtime artifacts, edit only with intent.

## Output style

- Be concise. No preamble. No re-explaining the request back to the user.
- Return diffs, not full files, when editing.
- If you need more context, ask one targeted question instead of guessing.
