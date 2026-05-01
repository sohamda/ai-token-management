import { render } from "./templateEngine.js";

export async function sendWelcome(user) {
  const subject = `Welcome, ${user.name}!`;
  const body = render("welcome", { name: user.name });
  return { to: user.email, subject, bytes: body.length };
}
