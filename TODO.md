# TODO

Used by the Ralph Wiggum loop demo (`demos/08-ralph-loop.md`).

Tasks:

- [ ] Add a test for `AddressParser.parseAddress` when input has empty comma-separated parts (e.g. `"Main St, , 10001, US"`) — verify it either throws or skips blanks.
- [ ] Add a Javadoc `@return` annotation to `FormatUtils.formatMoney`.
- [ ] In `OrderService.listOrders`, add a third mock order with at least 3 items.
- [ ] Add a test for `FormatUtils.pluralize` with a negative count: `pluralize(-1, "order")` → `"orders"` (plural because not exactly 1).
- [ ] Migrate `OrderConfirmationService.sendOrderConfirmation` from `renderLegacy("order_confirmation_v1", ...)` to `render("order_confirmation_v2", ...)`.
