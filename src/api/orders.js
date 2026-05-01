export async function listOrders(userId) {
  return [
    { id: "o_1001", total: 49.5, items: ["Mug", "Sticker pack"] },
    { id: "o_1002", total: 120.0, items: ["T-shirt", "Hoodie"] },
  ];
}
