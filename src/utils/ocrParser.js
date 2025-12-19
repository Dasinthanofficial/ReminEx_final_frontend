import Tesseract from "tesseract.js";

const priceRegex = /(Rs\.?|LKR|\$|USD)\s?(\d+(\.\d+)?)/i;
const dateRegex  = /(\d{2,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/;
const qtyRegex   = /(\d+(?:\.\d+)?)(\s?(g|kg|ml|l|pcs))/i;

export async function parseProductFromImage(file) {
  const { data } = await Tesseract.recognize(file, "eng", {
    logger: (m) => console.log(m.status),
  });

  const text = data.text.replace(/\n+/g, " ").trim();

  const priceMatch = text.match(priceRegex);
  const dateMatch  = text.match(/exp.*?(\d{2,4}[\-\/\.]\d{1,2}[\-\/\.]\d{1,4})/i) || text.match(dateRegex);
  const qtyMatch   = text.match(qtyRegex);

  return {
    text,
    name: text.split(/\s+/).slice(0, 3).join(" "),
    price: priceMatch?.[2] || "",
    expiryDate: dateMatch?.[1] || "",
    quantity: qtyMatch?.[1] || "",
    unit: qtyMatch?.[3] || "",
  };
}