# TODO

Used by the Ralph Wiggum loop demo (`demos/08-ralph-loop.md`).

Tasks:

- [ ] Add a unit test for `parseAddress` covering: valid input, missing fields, non-string input.
- [ ] Add a JSDoc `@returns` annotation to `formatMoney` in `src/utils/format.js`.
- [ ] In `src/api/orders.js`, add a second mock order with at least 3 items.
- [ ] Add a test for `pluralize`: `pluralize(1, "order")` → `"order"`, `pluralize(2, "order")` → `"orders"`.
- [ ] Migrate `sendOrderConfirmation` from `renderLegacy("order_confirmation_v1", ...)` to `render("order_confirmation_v2", ...)`.
