export const getImageUrl = (url) => {

  if (!url) return null;

  if (url.startsWith('blob:')) return url;

  if (url.startsWith('http://') || url.startsWith('https://')) return url;

 
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace(/\/api$/, '');

 
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};