// Converts a name into a URL-friendly slug: lowercase, alphanumeric words
// joined by single hyphens, with leading/trailing hyphens trimmed.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
