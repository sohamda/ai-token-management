// Old, hand-rolled email builder. The demo refactor replaces this
// with the new templateEngine.render() call.
import { renderLegacy } from "./templateEngine.js";

export async function sendOrderConfirmation(user, order) {
  const subject = `Your order ${order.id} is confirmed`;
  const body = renderLegacy("order_confirmation_v1", {
    name: user.name,
    orderId: order.id,
    total: order.total,
    items: order.items,
  });
  return deliver(user.email, subject, body);
}

async function deliver(to, subject, body) {
  // pretend to send
  return { to, subject, bytes: body.length };
}
