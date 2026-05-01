import { sendOrderConfirmation } from "./email/orderConfirmation.js";
import { sendWelcome } from "./email/welcomeEmail.js";
import { listOrders } from "./api/orders.js";
import { getUser } from "./api/users.js";

async function main() {
  console.log("Demo app starting…");
  const user = await getUser("u_42");
  await sendWelcome(user);
  const orders = await listOrders(user.id);
  for (const o of orders) await sendOrderConfirmation(user, o);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
