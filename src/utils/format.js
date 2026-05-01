export function formatMoney(n, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);
}

export function pluralize(n, singular, plural) {
  return n === 1 ? singular : plural ?? singular + "s";
}
