export default function slugify(str: string): string {
  return str
    .toLowerCase() // Convert to lowercase once
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .trim(); // Remove whitespaces from both ends of this string
}
