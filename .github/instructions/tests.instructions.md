---
applyTo: "src/**/*.js"
---

# Test conventions for src/

When writing or editing tests in `src/**`:

- Use the built-in `node --test` runner. Import from `node:test` and `node:assert/strict`.
- Test files live next to the source as `<name>.test.js`.
- One `describe` per exported function, one `test` per behavior.
- Avoid mocks unless absolutely required.
- No external test frameworks (no Jest, Mocha, Vitest, Chai).

Example skeleton:

```js
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { thing } from "./thing.js";

describe("thing", () => {
  test("does X when Y", () => {
    assert.equal(thing(1), 2);
  });
});
```
