// New template engine. All new emails should use render(); legacy
// code still calls renderLegacy() until migrated.

const TEMPLATES = {
  welcome: ({ name }) => `Hi ${name}, welcome to the demo!`,
  order_confirmation_v2: ({ name, orderId, total }) =>
    `Hi ${name},\n\nYour order ${orderId} for $${total} is on the way.\n`,
};

export function render(templateId, data) {
  const t = TEMPLATES[templateId];
  if (!t) throw new Error(`Unknown template: ${templateId}`);
  return t(data);
}

// Legacy renderer — string-concat style. Slated for removal.
export function renderLegacy(templateId, data) {
  if (templateId === "order_confirmation_v1") {
    let s = "Hi " + data.name + ",\n\n";
    s += "Order " + data.orderId + " confirmed. Total: $" + data.total + "\n";
    s += "Items:\n";
    for (const it of data.items || []) s += " - " + it + "\n";
    return s;
  }
  throw new Error("legacy template missing: " + templateId);
}
