export const getImageUrl = (url) => {
  if (!url) return null;

  // Local preview (e.g. URL.createObjectURL)
  if (url.startsWith("blob:")) return url;

  // Already full URL
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  // Backend-relative like "/uploads/xxx.png"
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.replace(/\/api$/, "");

  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
};