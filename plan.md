# plan.md (example)

This file is produced by the `/plan` prompt in demo 10. Treat the version checked
into the repo as a sample — replace it when running the demo live.

## Goal
Migrate the order-confirmation email from the legacy renderer to the new template
engine so we can delete `renderLegacy` in a follow-up PR.

## Acceptance criteria
- [ ] `OrderConfirmationService.sendOrderConfirmation` uses `render("order_confirmation_v2", ...)`.
- [ ] The new template includes the customer's name, order id, and total.
- [ ] `mvn test` passes.
- [ ] `renderLegacy` is **not** removed in this PR (separate cleanup).

## Tasks
- [ ] T1: Update `OrderConfirmationService.java` to call `render` with template id `order_confirmation_v2` instead of `renderLegacy`.
- [ ] T2: Extend the `order_confirmation_v2` template in `TemplateEngine.java` to include the items list, formatted as bullet lines.
- [ ] T3: Add `OrderConfirmationServiceTest.java` asserting subject + body contain the order id and the customer name.

## Files expected to change
- src/main/java/com/example/demo/email/OrderConfirmationService.java
- src/main/java/com/example/demo/email/TemplateEngine.java
- src/test/java/com/example/demo/email/OrderConfirmationServiceTest.java (new)

## Out of scope
- Removing `renderLegacy`.
- Any change to `WelcomeEmailService.java`.

## Risks / open questions
- Should the template format currency with `FormatUtils.formatMoney`? Currently raw number.
