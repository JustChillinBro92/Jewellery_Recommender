// Vite serves files in public/ from the site root in dev and production.
export const inventoryImage = (file) => `/inventory/${encodeURIComponent(file)}`;
