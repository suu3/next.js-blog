export function splitSlugToSegments(slug: string): string[] {
  return slug.split('/').map(encodeURIComponent);
}
