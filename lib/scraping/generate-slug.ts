export function generateSlug(title: string, publishedAt: string): string {
  const datePart = publishedAt.split('T')[0]; // Extract YYYY-MM-DD
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return `${datePart}-${titleSlug}`;
};