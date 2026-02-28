export function splitSlugToSegments(slug: string): string[] {
  return slug.split('/').map(encodeURIComponent);
}

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s\u00A0]+/g, '-')
    .replace(/[^\w\u3131-\u318e\uac00-\ud7a3-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
