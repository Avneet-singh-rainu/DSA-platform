// URL slug for a topic name. Appends a trailing "s" only when missing,
// so "Array" -> "arrays" but "Prompts" -> "prompts" (not "promptss").
export function topicSlug(name) {
  const s = (name || "misc").trim().toLowerCase();
  return s.endsWith("s") ? s : `${s}s`;
}

export function trackSlug(track) {
  return (track || "dsa").trim().toLowerCase();
}
