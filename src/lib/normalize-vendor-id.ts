/** Normalize vendor ids from API cart lines (string, ObjectId-like, or populated refs). */
export function normalizeVendorId(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj._id === "string") return obj._id.trim();
    if (typeof obj.id === "string") return obj.id.trim();
    if (obj._id != null) return String(obj._id).trim();
    if (obj.id != null) return String(obj.id).trim();
  }
  return String(value).trim();
}
