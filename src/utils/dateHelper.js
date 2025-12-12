export const toDateInputValue = (dateLike) => {
  if (!dateLike) return "";
  const d = new Date(dateLike);

  
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};