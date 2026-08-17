// Converts a name into a URL-friendly slug: words joined by single hyphens,
// leading/trailing hyphens trimmed. Keeps letters and numbers from *any*
// script (via Unicode property escapes), not just Latin — a Bengali name
// like "রুচির সিরাপ" becomes "রুচির-সিরাপ" rather than being stripped to
// nothing. Unicode characters are valid in URL paths, and this reads far
// better to a Bengali-speaking admin/customer than a transliterated
// approximation would.
//
// \p{M} (combining marks) has to be kept alongside \p{L}/\p{N}: Bengali and
// other Indic scripts spell a syllable as a base letter plus a combining
// vowel sign (matra) — e.g. "রু" is র (letter) + ু (mark). Without \p{M},
// those marks get treated as "not a letter" and stripped, which breaks
// every conjunct apart into single-letter fragments joined by hyphens.
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
