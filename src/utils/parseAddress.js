// Parses a single-line address string like:
//   "221B Baker Street, London, NW1 6XE, UK"
// into { street, city, postalCode, country }.
//
// Intentionally lacks a unit test — used in the
// "instructions before/after" demo (demo 04).
export function parseAddress(input) {
  if (typeof input !== "string") throw new TypeError("address must be a string");
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 4) throw new Error("address requires street, city, postal, country");
  const [street, city, postalCode, country] = parts;
  return { street, city, postalCode, country };
}
