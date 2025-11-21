export const getImageUrl = (url) => {
  // 1. Return null if no URL provided
  if (!url) return null;

  // 2. If it's a local preview (Blob created by URL.createObjectURL)
  if (url.startsWith('blob:')) return url;

  // 3. If it's already a full external URL (e.g., Google Avatar or pasted link)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // 4. If it's a backend upload path (e.g., "/uploads/image-123.png")
  // We need to prepend the backend server URL (removing '/api' from the end)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace(/\/api$/, '');

  // Ensure there is exactly one slash between base and path
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};