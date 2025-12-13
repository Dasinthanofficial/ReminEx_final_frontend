export const extractFirstNumber = (text = "") => {
  const m = String(text).match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  return Number(m[1].replace(",", "."));
};

export const parseSpokenDateToISO = (text = "") => {
  const s = String(text).trim().toLowerCase();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const toISO = (d) => {
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  if (s.includes("today") || s.includes("இன்று") || s.includes("අද")) return toISO(today);

  if (s.includes("tomorrow") || s.includes("நாளை") || s.includes("හෙට")) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return toISO(d);
  }

  // YYYY-MM-DD or YYYY/MM/DD
  let m = s.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if (!Number.isNaN(d.getTime())) return toISO(d);
  }

  // DD-MM-YYYY or DD/MM/YYYY
  m = s.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (m) {
    const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!Number.isNaN(d.getTime())) return toISO(d);
  }

  return null;
};

export const parseUnitFromText = (text = "") => {
  const s = String(text).toLowerCase();
  if (s.includes("kg") || s.includes("kilo")) return "kg";
  if (s.includes("gram") || s.includes(" g ")) return "g";
  if (s.includes("ml")) return "ml";
  if (s.includes("liter") || s.includes("litre") || s.includes(" l ")) return "L";
  if (s.includes("piece") || s.includes("pcs")) return "pcs";
  return null;
};

export const parseCategoryFromText = (text = "") => {
  const s = String(text).toLowerCase();
  if (s.includes("non food") || s.includes("non-food") || s.includes("nonfood")) return "Non-Food";
  if (s.includes("food")) return "Food";
  return null;
};
