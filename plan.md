# plan.md (example)

This file is produced by the `/plan` prompt in demo 10. Treat the version checked
into the repo as a sample — replace it when running the demo live.

## Goal
Migrate the order-confirmation email from the legacy renderer to the new template
engine so we can delete `renderLegacy` in a follow-up PR.

## Acceptance criteria
- [ ] `sendOrderConfirmation` uses `render("order_confirmation_v2", ...)`.
- [ ] The new template includes the customer's name, order id, and total.
- [ ] `npm test` passes.
- [ ] `renderLegacy` is **not** removed in this PR (separate cleanup).

## Tasks
- [ ] T1: Update `src/email/orderConfirmation.js` to import `render` and call it with template id `order_confirmation_v2`.
- [ ] T2: Extend the `order_confirmation_v2` template in `src/email/templateEngine.js` to include the items list, formatted as bullet lines.
- [ ] T3: Add `src/email/orderConfirmation.test.js` asserting subject + body contain the order id and the customer name.

## Files expected to change
- src/email/orderConfirmation.js
- src/email/templateEngine.js
- src/email/orderConfirmation.test.js (new)

## Out of scope
- Removing `renderLegacy`.
- Any change to `welcomeEmail.js`.

## Risks / open questions
- Should the template format currency with `formatMoney`? Currently raw number.
