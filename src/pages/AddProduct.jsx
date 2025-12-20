// import React, { useState, useRef, useEffect, useMemo } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { BrowserMultiFormatReader } from "@zxing/browser";
// import { FiUpload, FiLink, FiCamera, FiX, FiZap, FiMic } from "react-icons/fi";

// import api from "../services/api";
// import { productService } from "../services/productService";
// import { useAuth } from "../context/AuthContext";
// import { convertLocalToUSD } from "../utils/currencyHelper";
// import SelectMenu from "../components/SelectMenu";

// import { useSpeechRecognition as useSpeechRecognitionHook } from "../hooks/useSpeechRecognition.js";
// import {
//   extractFirstNumber,
//   parseSpokenDateToISO,
//   parseUnitFromText,
//   parseCategoryFromText,
// } from "../utils/speechParsers.js";

// const CATEGORY_OPTIONS = [
//   { value: "Food", label: "Food" },
//   { value: "Non-Food", label: "Non-Food" },
// ];

// const UNIT_OPTIONS = [
//   { value: "g", label: "g" },
//   { value: "kg", label: "kg" },
//   { value: "ml", label: "ml" },
//   { value: "L", label: "L" },
//   { value: "pcs", label: "pcs" },
// ];

// const VOICE_LANGS = [
//   { label: "English", code: "en-US" },
//   { label: "Tamil", code: "ta-IN" },
//   { label: "Sinhala", code: "si-LK" },
//   { label: "Hindi", code: "hi-IN" },
//   { label: "Arabic", code: "ar-SA" },
// ];

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const { currency } = useAuth();

//   const todayISO = useMemo(() => {
//     const d = new Date();
//     const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
//     return local.toISOString().slice(0, 10);
//   }, []);

//   const [form, setForm] = useState({
//     name: "",
//     category: "Food",
//     expiryDate: "",
//     price: "",
//     weight: "",
//     unit: "g",
//     image: "",
//   });

//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [barcode, setBarcode] = useState("");

//   const [showScanner, setShowScanner] = useState(false);
//   const [scanning, setScanning] = useState(false);
//   const [predicting, setPredicting] = useState(false);

//   // Voice
//   const [voiceLang, setVoiceLang] = useState("en-US");
//   const { isSupported: voiceSupported, listening, listenOnce } =
//     useSpeechRecognitionHook();

//   const videoRef = useRef(null);
//   const readerRef = useRef(null);

//   // Cleanup blob previews
//   useEffect(() => {
//     return () => {
//       if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   // Barcode scanner
//   useEffect(() => {
//     if (!showScanner) return;

//     const reader = new BrowserMultiFormatReader();
//     readerRef.current = reader;
//     let cancelled = false;

//     reader
//       .decodeFromConstraints(
//         {
//           video: {
//             facingMode: { ideal: "environment" },
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//         },
//         videoRef.current,
//         (result, err) => {
//           if (cancelled) return;

//           if (result) {
//             const code = result.getText();
//             setBarcode(code);
//             setShowScanner(false);
//             handleAutoFill(code);

//             try {
//               reader.reset();
//             } catch {}
//           }

//           if (err && err.name !== "NotFoundException") {
//             console.warn("ZXing decode error:", err);
//           }
//         }
//       )
//       .catch((err) => {
//         console.error("Camera/decoder error:", err);
//         toast.error("Unable to access camera or decode barcode.");
//         setShowScanner(false);
//       });

//     return () => {
//       cancelled = true;

//       try {
//         readerRef.current?.reset?.();
//       } catch {}

//       const stream = videoRef.current?.srcObject;
//       if (stream && typeof stream.getTracks === "function") {
//         stream.getTracks().forEach((t) => t.stop());
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showScanner]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;

//     if (!f.type.startsWith("image/")) return toast.error("Please upload an image file");
//     if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");

//     setFile(f);

//     setPreview((prev) => {
//       if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
//       return URL.createObjectURL(f);
//     });

//     setForm((p) => ({ ...p, image: "" }));
//   };

//   const speakToFill = async (field) => {
//     if (!voiceSupported) {
//       toast.error("Voice input not supported in this browser. Use Chrome/Edge.");
//       return;
//     }

//     try {
//       toast.loading("Listening...", { id: "voice" });
//       const text = await listenOnce({ lang: voiceLang, timeoutMs: 12000 });
//       toast.dismiss("voice");

//       if (!text) return toast.error("Didn't catch that. Try again.");

//       if (field === "name") {
//         setForm((p) => ({ ...p, name: text }));
//         return;
//       }

//       if (field === "category") {
//         const cat = parseCategoryFromText(text);
//         if (!cat) return toast.error("Say 'Food' or 'Non food'.");
//         setForm((p) => ({ ...p, category: cat }));
//         return;
//       }

//       if (field === "expiryDate") {
//         const iso = parseSpokenDateToISO(text);
//         if (!iso) return toast.error("Say '2025-12-31' or 'tomorrow'.");
//         setForm((p) => ({ ...p, expiryDate: iso }));
//         return;
//       }

//       if (field === "price") {
//         const n = extractFirstNumber(text);
//         if (n == null) return toast.error("Could not find a number for price.");
//         setForm((p) => ({ ...p, price: String(n) }));
//         return;
//       }

//       if (field === "weight") {
//         const n = extractFirstNumber(text);
//         if (n == null) return toast.error("Could not find a number for quantity.");
//         const unit = parseUnitFromText(text);
//         setForm((p) => ({ ...p, weight: String(n), unit: unit || p.unit }));
//         return;
//       }
//     } catch {
//       toast.dismiss("voice");
//       toast.error("Voice input failed. Try again or type manually.");
//     }
//   };

//   const handleAutoFill = async (code) => {
//     const trimmed = (code || "").trim();
//     if (!trimmed) return toast.error("Please enter or scan a barcode first.");

//     setScanning(true);
//     try {
//       const info = await api.get(`/products/scan/barcode/${trimmed}`);

//       setForm((prev) => {
//         let weightVal = prev.weight;
//         let unitVal = prev.unit;

//         if (info?.quantity) {
//           const match = info.quantity.match(/(\d+\.?\d*)\s*(g|kg|ml|l|L)/i);
//           if (match) {
//             weightVal = match[1];
//             unitVal = match[2];
//             if (unitVal === "l") unitVal = "L";
//           }
//         }

//         return {
//           ...prev,
//           name: info?.name || prev.name,
//           category: "Food",
//           weight: weightVal,
//           unit: unitVal,
//           image: info?.image || prev.image,
//         };
//       });

//       if (info?.image) {
//         setPreview(info.image);
//         setFile(null);
//       }

//       toast.success("✓ Auto-filled! Add expiry date & price.", { icon: "📦" });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to auto-fill");
//     } finally {
//       setScanning(false);
//     }
//   };

//   const handlePredictFromImage =import React, { useState, useRef, useEffect, useMemo } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { BrowserMultiFormatReader } from "@zxing/browser";
// import { FiUpload, FiLink, FiCamera, FiX, FiZap, FiMic } from "react-icons/fi";

// import api from "../services/api";
// import { productService } from "../services/productService";
// import { useAuth } from "../context/AuthContext";
// import { convertLocalToUSD } from "../utils/currencyHelper";
// import SelectMenu from "../components/SelectMenu";

// import { useSpeechRecognition as useSpeechRecognitionHook } from "../hooks/useSpeechRecognition.js";
// import {
//   extractFirstNumber,
//   parseSpokenDateToISO,
//   parseUnitFromText,
//   parseCategoryFromText,
// } from "../utils/speechParsers.js";

// const CATEGORY_OPTIONS = [
//   { value: "Food", label: "Food" },
//   { value: "Non-Food", label: "Non-Food" },
// ];

// const UNIT_OPTIONS = [
//   { value: "g", label: "g" },
//   { value: "kg", label: "kg" },
//   { value: "ml", label: "ml" },
//   { value: "L", label: "L" },
//   { value: "pcs", label: "pcs" },
// ];

// const VOICE_LANGS = [
//   { label: "English", code: "en-US" },
//   { label: "Tamil", code: "ta-IN" },
//   { label: "Sinhala", code: "si-LK" },
//   { label: "Hindi", code: "hi-IN" },
//   { label: "Arabic", code: "ar-SA" },
// ];

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const { currency } = useAuth();

//   const todayISO = useMemo(() => {
//     const d = new Date();
//     const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
//     return local.toISOString().slice(0, 10);
//   }, []);

//   const [form, setForm] = useState({
//     name: "",
//     category: "Food",
//     expiryDate: "",
//     price: "",
//     weight: "",
//     unit: "g",
//     image: "",
//   });

//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [barcode, setBarcode] = useState("");

//   const [showScanner, setShowScanner] = useState(false);
//   const [scanning, setScanning] = useState(false);
//   const [predicting, setPredicting] = useState(false);

//   // Voice
//   const [voiceLang, setVoiceLang] = useState("en-US");
//   const { isSupported: voiceSupported, listening, listenOnce } =
//     useSpeechRecognitionHook();

//   const videoRef = useRef(null);
//   const readerRef = useRef(null);

//   // Cleanup blob previews
//   useEffect(() => {
//     return () => {
//       if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   // Barcode scanner
//   useEffect(() => {
//     if (!showScanner) return;

//     const reader = new BrowserMultiFormatReader();
//     readerRef.current = reader;
//     let cancelled = false;

//     reader
//       .decodeFromConstraints(
//         {
//           video: {
//             facingMode: { ideal: "environment" },
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//           },
//         },
//         videoRef.current,
//         (result, err) => {
//           if (cancelled) return;

//           if (result) {
//             const code = result.getText();
//             setBarcode(code);
//             setShowScanner(false);
//             handleAutoFill(code);

//             try {
//               reader.reset();
//             } catch {}
//           }

//           if (err && err.name !== "NotFoundException") {
//             console.warn("ZXing decode error:", err);
//           }
//         }
//       )
//       .catch((err) => {
//         console.error("Camera/decoder error:", err);
//         toast.error("Unable to access camera or decode barcode.");
//         setShowScanner(false);
//       });

//     return () => {
//       cancelled = true;

//       try {
//         readerRef.current?.reset?.();
//       } catch {}

//       const stream = videoRef.current?.srcObject;
//       if (stream && typeof stream.getTracks === "function") {
//         stream.getTracks().forEach((t) => t.stop());
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showScanner]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;

//     if (!f.type.startsWith("image/")) return toast.error("Please upload an image file");
//     if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");

//     setFile(f);

//     setPreview((prev) => {
//       if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
//       return URL.createObjectURL(f);
//     });

//     setForm((p) => ({ ...p, image: "" }));
//   };

//   const speakToFill = async (field) => {
//     if (!voiceSupported) {
//       toast.error("Voice input not supported in this browser. Use Chrome/Edge.");
//       return;
//     }

//     try {
//       toast.loading("Listening...", { id: "voice" });
//       const text = await listenOnce({ lang: voiceLang, timeoutMs: 12000 });
//       toast.dismiss("voice");

//       if (!text) return toast.error("Didn't catch that. Try again.");

//       if (field === "name") {
//         setForm((p) => ({ ...p, name: text }));
//         return;
//       }

//       if (field === "category") {
//         const cat = parseCategoryFromText(text);
//         if (!cat) return toast.error("Say 'Food' or 'Non food'.");
//         setForm((p) => ({ ...p, category: cat }));
//         return;
//       }

//       if (field === "expiryDate") {
//         const iso = parseSpokenDateToISO(text);
//         if (!iso) return toast.error("Say '2025-12-31' or 'tomorrow'.");
//         setForm((p) => ({ ...p, expiryDate: iso }));
//         return;
//       }

//       if (field === "price") {
//         const n = extractFirstNumber(text);
//         if (n == null) return toast.error("Could not find a number for price.");
//         setForm((p) => ({ ...p, price: String(n) }));
//         return;
//       }

//       if (field === "weight") {
//         const n = extractFirstNumber(text);
//         if (n == null) return toast.error("Could not find a number for quantity.");
//         const unit = parseUnitFromText(text);
//         setForm((p) => ({ ...p, weight: String(n), unit: unit || p.unit }));
//         return;
//       }
//     } catch {
//       toast.dismiss("voice");
//       toast.error("Voice input failed. Try again or type manually.");
//     }
//   };

//   const handleAutoFill = async (code) => {
//     const trimmed = (code || "").trim();
//     if (!trimmed) return toast.error("Please enter or scan a barcode first.");

//     setScanning(true);
//     try {
//       const info = await api.get(`/products/scan/barcode/${trimmed}`);

//       setForm((prev) => {
//         let weightVal = prev.weight;
//         let unitVal = prev.unit;

//         if (info?.quantity) {
//           const match = info.quantity.match(/(\d+\.?\d*)\s*(g|kg|ml|l|L)/i);
//           if (match) {
//             weightVal = match[1];
//             unitVal = match[2];
//             if (unitVal === "l") unitVal = "L";
//           }
//         }

//         return {
//           ...prev,
//           name: info?.name || prev.name,
//           category: "Food",
//           weight: weightVal,
//           unit: unitVal,
//           image: info?.image || prev.image,
//         };
//       });

//       if (info?.image) {
//         setPreview(info.image);
//         setFile(null);
//       }

//       toast.success("✓ Auto-filled! Add expiry date & price.", { icon: "📦" });
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to auto-fill");
//     } finally {
//       setScanning(false);
//     }
//   };

//   const handlePredictFromImage = async () => {
//     if (!file) return toast.error("Upload or capture a produce image first");

//     const fd = new FormData();
//     fd.append("image", file);

//     setPredicting(true);
//     try {
//       const res = await api.post("/products/predict-image", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (!res?.success || !res?.expiryDateISO) {
//         toast.error("Could not predict from image. Please set date manually.");
//         return;
//       }

//       setForm((prev) => ({ ...prev, expiryDate: res.expiryDateISO }));

//       toast.success(
//         res.aiUsed
//           ? `AI: ${res.condition}, ~${res.days} day(s)`
//           : `Default estimate: ${res.days} day(s)`,
//         { duration: 3500 }
//       );
//     } catch (err) {
//       if (err.response?.status === 429) toast.error("AI service busy. Try again.");
//       else toast.error("Image analysis unavailable. Set expiry manually.");
//     } finally {
//       setPredicting(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setSaving(true);

//       const fd = new FormData();
//       fd.append("name", form.name);
//       fd.append("category", form.category);
//       fd.append("expiryDate", form.expiryDate);

//       if (form.price) {
//         const priceInUSD = convertLocalToUSD(parseFloat(form.price), currency);
//         fd.append("price", priceInUSD);
//       }

//       if (form.weight) {
//         fd.append("weight", form.weight);
//         fd.append("unit", form.unit);
//       }

//       if (file) fd.append("image", file);
//       else if (form.image) fd.append("image", form.image);

//       await productService.addProduct(fd);
//       toast.success("Product added!");
//       navigate("/products");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add product");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputStyle =
//     "w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] outline-none transition-all";
//   const labelStyle =
//     "block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2";

//   const micBtnOuter =
//     "w-12 h-[52px] rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 flex items-center justify-center";

//   const voiceLangOptions = VOICE_LANGS.map((l) => ({
//     value: l.code,
//     label: l.label,
//   }));

//   return (
//     <div className="max-w-3xl mx-auto p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl my-8">
//       <div className="mb-8 border-b border-white/10 pb-4">
//         <h1 className="text-3xl font-bold text-white tracking-tight">Add New Product</h1>
//         <p className="text-gray-300 mt-1">Enter details below to track your inventory.</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {voiceSupported && (
//           <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
//             <label className={labelStyle}>Voice Language</label>
//             <SelectMenu
//               value={voiceLang}
//               onChange={(val) => setVoiceLang(val)}
//               options={voiceLangOptions}
//               size="sm"
//               className="mt-1"
//             />
//             <p className="text-[10px] text-gray-500 mt-2">
//               Use mic buttons to fill fields. If voice fails, type manually.
//             </p>
//           </div>
//         )}

//         {/* Barcode */}
//         <div>
//           <label className={labelStyle}>Barcode</label>
//           <div className="flex gap-2 mb-2">
//             <input
//               type="text"
//               value={barcode}
//               onChange={(e) => setBarcode(e.target.value)}
//               placeholder="e.g. 5601234567890"
//               className={`${inputStyle} flex-1`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowScanner(!showScanner)}
//               className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
//                 showScanner
//                   ? "bg-red-500 text-white hover:bg-red-600"
//                   : "bg-[#38E07B] text-[#122017] hover:bg-[#2fc468]"
//               }`}
//             >
//               {showScanner ? <FiX /> : <FiCamera />}
//               {showScanner ? "Close" : "Scan"}
//             </button>

//             <button
//               type="button"
//               onClick={() => handleAutoFill(barcode)}
//               disabled={scanning || !barcode.trim()}
//               className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50"
//             >
//               {scanning ? "Loading..." : "Auto-fill"}
//             </button>
//           </div>

//           {showScanner && (
//             <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-[#38E07B] bg-black">
//               <video
//                 ref={videoRef}
//                 className="w-full h-64 object-cover"
//                 autoPlay
//                 playsInline
//                 muted
//               />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-48 h-48 border-4 border-[#38E07B] rounded-lg animate-pulse" />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Name + Category */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className={labelStyle}>Product Name</label>
//             <div className="flex gap-2 items-stretch">
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Milk, Apples..."
//                 className={`${inputStyle} flex-1`}
//                 required
//               />
//               {voiceSupported && (
//                 <button
//                   type="button"
//                   onClick={() => speakToFill("name")}
//                   disabled={listening}
//                   className={micBtnOuter}
//                   title="Voice: name"
//                 >
//                   <FiMic />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className={labelStyle}>Category</label>
//             <div className="flex gap-2 items-stretch">
//               <div className="flex-1">
//                 <SelectMenu
//                   value={form.category}
//                   onChange={(val) => setForm((p) => ({ ...p, category: val }))}
//                   options={CATEGORY_OPTIONS}
//                 />
//               </div>
//               {voiceSupported && (
//                 <button
//                   type="button"
//                   onClick={() => speakToFill("category")}
//                   disabled={listening}
//                   className={micBtnOuter}
//                   title="Voice: category"
//                 >
//                   <FiMic />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Expiry */}
//         <div>
//           <label className={labelStyle}>Expiry Date</label>
//           <div className="flex gap-2 items-stretch">
//             <input
//               type="date"
//               name="expiryDate"
//               value={form.expiryDate}
//               onChange={handleChange}
//               required
//               min={todayISO}
//               className={`${inputStyle} flex-1`}
//               style={{ colorScheme: "dark" }}
//             />
//             {voiceSupported && (
//               <button
//                 type="button"
//                 onClick={() => speakToFill("expiryDate")}
//                 disabled={listening}
//                 className={micBtnOuter}
//                 title="Voice: expiry date"
//               >
//                 <FiMic />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Price + Weight */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className={labelStyle}>Price ({currency})</label>
//             <div className="flex gap-2 items-stretch">
//               <input
//                 type="number"
//                 name="price"
//                 value={form.price}
//                 onChange={handleChange}
//                 placeholder="0.00"
//                 className={`${inputStyle} flex-1`}
//                 step="0.01"
//                 min="0"
//               />
//               {voiceSupported && (
//                 <button
//                   type="button"
//                   onClick={() => speakToFill("price")}
//                   disabled={listening}
//                   className={micBtnOuter}
//                   title="Voice: price"
//                 >
//                   <FiMic />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className={labelStyle}>Quantity / Size</label>
//             <div className="flex gap-2 items-stretch">
//               <div className="flex gap-2 flex-1">
//                 <input
//                   type="number"
//                   name="weight"
//                   value={form.weight}
//                   onChange={handleChange}
//                   placeholder="500"
//                   className={`${inputStyle} flex-1`}
//                   min="0"
//                 />
//                 <SelectMenu
//                   value={form.unit}
//                   onChange={(val) => setForm((p) => ({ ...p, unit: val }))}
//                   options={UNIT_OPTIONS}
//                   className="w-28"
//                 />
//               </div>

//               {voiceSupported && (
//                 <button
//                   type="button"
//                   onClick={() => speakToFill("weight")}
//                   disabled={listening}
//                   className={micBtnOuter}
//                   title="Voice: quantity"
//                 >
//                   <FiMic />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <hr className="border-white/10 my-6" />

//         {/* Image + AI predict */}
//         <div>
//           <label className={labelStyle}>Product Image (Produce)</label>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//               <div className="relative h-40 rounded-xl border-2 border-dashed border-white/20 overflow-hidden cursor-pointer group">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   capture="environment"
//                   onChange={handleFile}
//                   className="absolute inset-0 opacity-0 cursor-pointer z-10"
//                 />
//                 {preview ? (
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="w-full h-full object-cover rounded-lg border border-white/10"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex flex-col items-center justify-center text-center">
//                     <div className="w-12 h-12 rounded-full bg-[#38E07B]/10 flex items-center justify-center mb-3 text-[#38E07B]">
//                       <FiUpload className="text-xl" />
//                     </div>
//                     <span className="text-sm text-gray-300">
//                       Tap to capture or upload produce photo
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <button
//                 type="button"
//                 onClick={handlePredictFromImage}
//                 disabled={!file || predicting}
//                 className="mt-4 w-full text-xs font-bold bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
//               >
//                 {predicting ? "Analyzing..." : (<><FiZap /> Predict expiry from image</>)}
//               </button>
//             </div>

//             <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
//               <p className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
//                 <FiLink className="text-[#38E07B]" /> Or paste image URL
//               </p>
//               <input
//                 type="url"
//                 name="image"
//                 value={form.image}
//                 onChange={handleChange}
//                 placeholder="https://example.com/image.jpg"
//                 className={inputStyle}
//                 disabled={!!file}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 pt-6">
//           <Link
//             to="/products"
//             className="flex-1 text-center py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
//           >
//             Cancel
//           </Link>

//           <button
//             type="submit"
//             disabled={saving}
//             className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] transition disabled:opacity-60"
//           >
//             {saving ? "Adding..." : "Save Product"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct; async () => {
//     if (!file) return toast.error("Upload or capture a produce image first");

//     const fd = new FormData();
//     fd.append("image", file);

//     setPredicting(true);
//     try {
//       const res = await api.post("/products/predict-image", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (!res?.success || !res?.expiryDateISO) {
//         toast.error("Could not predict from image. Please set date manually.");
//         return;
//       }

//       setForm((prev) => ({ ...prev, expiryDate: res.expiryDateISO }));

//       toast.success(
//         res.aiUsed
//           ? `AI: ${res.condition}, ~${res.days} day(s)`
//           : `Default estimate: ${res.days} day(s)`,
//         { duration: 3500 }
//       );
//     } catch (err) {
//       if (err.response?.status === 429) toast.error("AI service busy. Try again.");
//       else toast.error("Image analysis unavailable. Set expiry manually.");
//     } finally {
//       setPredicting(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setSaving(true);

//       const fd = new FormData();
//       fd.append("name", form.name);
//       fd.append("category", form.category);
//       fd.append("expiryDate", form.expiryDate);

//       if (form.price) {
//         const priceInUSD = convertLocalToUSD(parseFloat(form.price), currency);
//         fd.append("price", priceInUSD);
//       }

//       if (form.weight) {
//         fd.append("weight", form.weight);
//         fd.append("unit", form.unit);
//       }

//       if (file) fd.append("image", file);
//       else if (form.image) fd.append("image", form.image);

//       await productService.addProduct(fd);
//       toast.success("Product added!");
//       navigate("/products");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add product");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputStyle =
//     "w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] outline-none transition-all";
//   const labelStyle =
//     "block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2";

//   const micBtnOuter =
//     "w-12 h-[52px] rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 flex items-center justify-center";

//   const voiceLangOptions = VOICE_LANGS.map((l) => ({
//     value: l.code,
//     label: l.label,
//   }));

//   return (
//     <div className="max-w-3xl mx-auto p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl my-8">
//       <div className="mb-8 border-b border-white/10 pb-4">
//         <h1 className="text-3xl font-bold text-white tracking-tight">Add New Product</h1>
//         <p className="text-gray-300 mt-1">Enter details below to track your inventory.</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {voiceSupported && (
//           <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
//             <label className={labelStyle}>Voice Language</label>
//             <SelectMenu
//               value={voiceLang}
//               onChange={(val) => setVoiceLang(val)}
//               options={voiceLangOptions}
//               size="sm"
//               className="mt-1"
//             />
//             <p className="text-[10px] text-gray-500 mt-2">
//               Use mic buttons to fill fields. If voice fails, type manually.
//             </p>
//           </div>
//         )}

//         {/* Barcode */}
//         <div>
//           <label className={labelStyle}>Barcode</label>
//           <div className="flex gap-2 mb-2">
//             <input
//               type="text"
//               value={barcode}
//               onChange={(e) => setBarcode(e.target.value)}
//               placeholder="e.g. 5601234567890"
//               className={`${inputStyle} flex-1`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowScanner(!showScanner)}
//               className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
//                 showScanner
//                   ? "bg-red-500 text-white hover:bg-red-600"
//                   : "bg-[#38E07B] text-[#122017] hover:bg-[#2fc468]"
//               }`}
//             >
//               {showScanner ? <FiX /> : <FiCamera />}
//               {showScanner ? "Close" : "Scan"}
//             </button>

//             <button
//               type="button"
//               onClick={() => handleAutoFill(barcode)}
//               disabled={scanning || !barcode.trim()}
//               className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50"
//             >
//               {scanning ? "Loading..." : "Auto-fill"}
//             </button>
//           </div>

//           {showScanner && (
//             <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-[#38E07B] bg-black">
//               <video
//                 ref={videoRef}
//                 className="w-full h-64 object-cover"
//                 autoPlay
//                 playsInline
//                 muted
//               />
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-48 h-48 border-4 border-[#38E07B] rounded-lg animate-pulse" />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Name + Category */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className={labelStyle}>Product Name</label>
//             <div className="flex gap-2 items-stretch">
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Milk, Apples..."
//                 className={`${inputStyle} flex-1`}
//                 required
//               />
//               {voiceSupported && (
//                 <button
//                   type="button"
//                   onClick={() => speakToFill("name")}
//                   disabled={listening}
//                   className={micBtnOuter}
//                   title="Voice: name"
//                 >
//                   <FiMic />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className={labelStyle}>Category</label>
//             <div className="flex gap-2 items-stretch">
//               <div className="flex-1">
//                 <SelectMenu
//                   value={form.category}
//                   onChange={(val) => setForm((p) => ({ ...p, category: val }))}
//                   options={CATEGORY_OPTIONS}
//                 />
//               </div>
//               {voiceSupported && (
//                 <button
//                   type="button"
//                   onClick={() => speakToFill("category")}
//                   disabled={listening}
//                   className={micBtnOuter}
//                   title="Voice: category"
//                 >
//                   <FiMic />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Expiry */}
//         <div>
//           <label className={labelStyle}>Expiry Date</label>
//           <div className="flex gap-2 items-stretch">
//             <input
//               type="date"
//               name="expiryDate"
//               value={form.expiryDate}
//               onChange={handleChange}
//               required
//               min={todayISO}
//               className={`${inputStyle} flex-1`}
//               style={{ colorScheme: "dark" }}
//             />
//             {voiceSupported && (
//               <button
//                 type="button"
//                 onClick={() => speakToFill("expiryDate")}
//                 disabled={listening}
//                 className={micBtnOuter}
//                 title="Voice: expiry date"
//               >
//                 <FiMic />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Price + Weight */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className={labelStyle}>Price ({currency})</label>
//             <div className="flex gap-2 items-stretch">
//               <input
//                 type="number"
//                 name="price"
//                 value={form.price}
//                 onChange={handleChange}
//                 placeholder="0.00"
//                 className={`${inputStyle} flex-1`}
//                 step="0.01"
//                 min="0"
//               />
//               {voiceSupported && (
//                 <button
//                   type="button"
//                   onClick={() => speakToFill("price")}
//                   disabled={listening}
//                   className={micBtnOuter}
//                   title="Voice: price"
//                 >
//                   <FiMic />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div>
//             <label className={labelStyle}>Quantity / Size</label>
//             <div className="flex gap-2 items-stretch">
//               <div className="flex gap-2 flex-1">
//                 <input
//                   type="number"
//                   name="weight"
//                   value={form.weight}
//                   onChange={handleChange}
//                   placeholder="500"
//                   className={`${inputStyle} flex-1`}
//                   min="0"
//                 />
//                 <SelectMenu
//                   value={form.unit}
//                   onChange={(val) => setForm((p) => ({ ...p, unit: val }))}
//                   options={UNIT_OPTIONS}
//                   className="w-28"
//                 />
//               </div>

//               {voiceSupported && (
//                 <button
//                   type="button"
//                   onClick={() => speakToFill("weight")}
//                   disabled={listening}
//                   className={micBtnOuter}
//                   title="Voice: quantity"
//                 >
//                   <FiMic />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <hr className="border-white/10 my-6" />

//         {/* Image + AI predict */}
//         <div>
//           <label className={labelStyle}>Product Image (Produce)</label>
//           <div className="grid md:grid-cols-2 gap-6">
//             <div className="bg-white/5 border border-white/10 rounded-xl p-6">
//               <div className="relative h-40 rounded-xl border-2 border-dashed border-white/20 overflow-hidden cursor-pointer group">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   capture="environment"
//                   onChange={handleFile}
//                   className="absolute inset-0 opacity-0 cursor-pointer z-10"
//                 />
//                 {preview ? (
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="w-full h-full object-cover rounded-lg border border-white/10"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex flex-col items-center justify-center text-center">
//                     <div className="w-12 h-12 rounded-full bg-[#38E07B]/10 flex items-center justify-center mb-3 text-[#38E07B]">
//                       <FiUpload className="text-xl" />
//                     </div>
//                     <span className="text-sm text-gray-300">
//                       Tap to capture or upload produce photo
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <button
//                 type="button"
//                 onClick={handlePredictFromImage}
//                 disabled={!file || predicting}
//                 className="mt-4 w-full text-xs font-bold bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
//               >
//                 {predicting ? "Analyzing..." : (<><FiZap /> Predict expiry from image</>)}
//               </button>
//             </div>

//             <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
//               <p className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
//                 <FiLink className="text-[#38E07B]" /> Or paste image URL
//               </p>
//               <input
//                 type="url"
//                 name="image"
//                 value={form.image}
//                 onChange={handleChange}
//                 placeholder="https://example.com/image.jpg"
//                 className={inputStyle}
//                 disabled={!!file}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 pt-6">
//           <Link
//             to="/products"
//             className="flex-1 text-center py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
//           >
//             Cancel
//           </Link>

//           <button
//             type="submit"
//             disabled={saving}
//             className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] transition disabled:opacity-60"
//           >
//             {saving ? "Adding..." : "Save Product"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { FiUpload, FiLink, FiCamera, FiX, FiZap, FiMic } from "react-icons/fi";

import api from "../services/api";
import { productService } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { convertLocalToUSD } from "../utils/currencyHelper";
import SelectMenu from "../components/SelectMenu";

import { useSpeechRecognition as useSpeechRecognitionHook } from "../hooks/useSpeechRecognition.js";
import {
  extractFirstNumber,
  parseSpokenDateToISO,
  parseUnitFromText,
  parseCategoryFromText,
} from "../utils/speechParsers.js";

const CATEGORY_OPTIONS = [
  { value: "Food", label: "Food" },
  { value: "Non-Food", label: "Non-Food" },
];

const UNIT_OPTIONS = [
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "pcs", label: "pcs" },
];

const VOICE_LANGS = [
  { label: "English", code: "en-US" },
  { label: "Tamil", code: "ta-IN" },
  { label: "Sinhala", code: "si-LK" },
  { label: "Hindi", code: "hi-IN" },
  { label: "Arabic", code: "ar-SA" },
];

const AddProduct = () => {
  const navigate = useNavigate();
  const { currency } = useAuth();

  const todayISO = useMemo(() => {
    const d = new Date();
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }, []);

  const [form, setForm] = useState({
    name: "",
    category: "Food",
    expiryDate: "",
    price: "",
    weight: "",
    unit: "g",
    image: "",
  });

  // Main product image
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  // Barcode
  const [barcode, setBarcode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState(false);

  // AI predict (produce)
  const [predicting, setPredicting] = useState(false);

  // ✅ OCR front/back files
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // Input reset keys (so "clear" truly clears the hidden file input)
  const [frontKey, setFrontKey] = useState(0);
  const [backKey, setBackKey] = useState(0);

  // Voice
  const [voiceLang, setVoiceLang] = useState("en-US");
  const { isSupported: voiceSupported, listening, listenOnce } =
    useSpeechRecognitionHook();

  const videoRef = useRef(null);
  const readerRef = useRef(null);

  // Cleanup blob previews (main product image)
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Barcode scanner
  useEffect(() => {
    if (!showScanner) return;

    if (!videoRef.current) {
      toast.error("Camera element not ready.");
      setShowScanner(false);
      return;
    }

    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    let cancelled = false;

    reader
      .decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        },
        videoRef.current,
        (result, err) => {
          if (cancelled) return;

          if (result) {
            const code = result.getText();
            setBarcode(code);
            setShowScanner(false);
            handleAutoFill(code);

            try {
              reader.reset();
            } catch {}
          }

          if (err && err.name !== "NotFoundException") {
            console.warn("ZXing decode error:", err);
          }
        }
      )
      .catch((err) => {
        console.error("Camera/decoder error:", err);
        toast.error("Unable to access camera or decode barcode.");
        setShowScanner(false);
      });

    return () => {
      cancelled = true;
      try {
        readerRef.current?.reset?.();
      } catch {}

      const stream = videoRef.current?.srcObject;
      if (stream && typeof stream.getTracks === "function") {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScanner]);

  const inputStyle =
    "w-full p-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] outline-none transition-all";
  const labelStyle =
    "block text-xs font-bold text-[#38E07B] uppercase tracking-wider mb-2";
  const micBtnOuter =
    "w-12 h-[52px] rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 flex items-center justify-center";

  const voiceLangOptions = VOICE_LANGS.map((l) => ({ value: l.code, label: l.label }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) return toast.error("Please upload an image file");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");

    setFile(f);
    setPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
    setForm((p) => ({ ...p, image: "" }));
  };

  const speakToFill = async (field) => {
    if (!voiceSupported) {
      toast.error("Voice input not supported in this browser. Use Chrome/Edge.");
      return;
    }

    try {
      toast.loading("Listening...", { id: "voice" });
      const text = await listenOnce({ lang: voiceLang, timeoutMs: 12000 });
      toast.dismiss("voice");

      if (!text) return toast.error("Didn't catch that. Try again.");

      if (field === "name") return setForm((p) => ({ ...p, name: text }));

      if (field === "category") {
        const cat = parseCategoryFromText(text);
        if (!cat) return toast.error("Say 'Food' or 'Non food'.");
        return setForm((p) => ({ ...p, category: cat }));
      }

      if (field === "expiryDate") {
        const iso = parseSpokenDateToISO(text);
        if (!iso) return toast.error("Say '2025-12-31' or 'tomorrow'.");
        return setForm((p) => ({ ...p, expiryDate: iso }));
      }

      if (field === "price") {
        const n = extractFirstNumber(text);
        if (n == null) return toast.error("Could not find a number for price.");
        return setForm((p) => ({ ...p, price: String(n) }));
      }

      if (field === "weight") {
        const n = extractFirstNumber(text);
        if (n == null) return toast.error("Could not find a number for quantity.");
        const unit = parseUnitFromText(text);
        return setForm((p) => ({ ...p, weight: String(n), unit: unit || p.unit }));
      }
    } catch {
      toast.dismiss("voice");
      toast.error("Voice input failed. Try again or type manually.");
    }
  };

  const handleAutoFill = async (code) => {
    const trimmed = (code || "").trim();
    if (!trimmed) return toast.error("Please enter or scan a barcode first.");

    setScanning(true);
    try {
      const info = await api.get(`/products/scan/barcode/${trimmed}`);

      setForm((prev) => {
        let weightVal = prev.weight;
        let unitVal = prev.unit;

        if (info?.quantity) {
          const match = info.quantity.match(/(\d+\.?\d*)\s*(g|kg|ml|l|L)/i);
          if (match) {
            weightVal = match[1];
            unitVal = match[2];
            if (unitVal === "l") unitVal = "L";
          }
        }

        return {
          ...prev,
          name: info?.name || prev.name,
          category: "Food",
          weight: weightVal,
          unit: unitVal,
          image: info?.image || prev.image,
        };
      });

      if (info?.image) {
        setPreview(info.image);
        setFile(null);
      }

      toast.success("✓ Auto-filled! Add expiry date & price.", { icon: "📦" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to auto-fill");
    } finally {
      setScanning(false);
    }
  };

  // ✅ OCR using backend Tesseract
  const handleOCR = async () => {
    if (!frontFile && !backFile) {
      toast.error("Upload front and/or back image first.");
      return;
    }

    const fd = new FormData();
    if (frontFile) fd.append("front", frontFile);
    if (backFile) fd.append("back", backFile);

    setOcrLoading(true);
    setOcrResult(null);

    try {
      const res = await api.post("/products/ocr", fd);

      if (!res?.success) {
        toast.error("OCR failed. Please fill manually.");
        return;
      }

      setOcrResult(res);

      const safeExpiry =
        res.expiryDateISO && res.expiryDateISO >= todayISO ? res.expiryDateISO : "";

      setForm((p) => ({
        ...p,
        name: res.name || p.name,
        category: res.category || p.category,
        expiryDate: safeExpiry || p.expiryDate,
        price: res.priceNumber != null ? String(res.priceNumber) : p.price,
        weight: res.quantityNumber != null ? String(res.quantityNumber) : p.weight,
        unit: res.quantityUnit || p.unit,
      }));

      // Optional: set product image to front photo
      if (frontFile && !file) {
        setFile(frontFile);
        setPreview((prev) => {
          if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
          return URL.createObjectURL(frontFile);
        });
        setForm((p) => ({ ...p, image: "" }));
      }

      toast.success("OCR completed! Please review and save.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "OCR error");
    } finally {
      setOcrLoading(false);
    }
  };

  // AI expiry prediction (produce only)
  const handlePredictFromImage = async () => {
    if (!file) return toast.error("Upload or capture a produce image first");

    const fd = new FormData();
    fd.append("image", file);

    setPredicting(true);
    try {
      const res = await api.post("/products/predict-image", fd);

      if (!res?.success || !res?.expiryDateISO) {
        toast.error("Could not predict from image. Please set date manually.");
        return;
      }

      setForm((prev) => ({ ...prev, expiryDate: res.expiryDateISO }));

      toast.success(
        res.aiUsed
          ? `AI: ${res.condition}, ~${res.days} day(s)`
          : `Default estimate: ${res.days} day(s)`,
        { duration: 3500 }
      );
    } catch (err) {
      if (err.response?.status === 429) toast.error("AI service busy. Try again.");
      else toast.error("Image analysis unavailable. Set expiry manually.");
    } finally {
      setPredicting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("expiryDate", form.expiryDate);

      if (form.price) {
        const priceInUSD = convertLocalToUSD(parseFloat(form.price), currency);
        fd.append("price", String(priceInUSD));
      }

      if (form.weight) {
        fd.append("weight", String(form.weight));
        fd.append("unit", String(form.unit));
      }

      if (file) fd.append("image", file);
      else if (form.image) fd.append("image", form.image);

      await productService.addProduct(fd);
      toast.success("Product added!");
      navigate("/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Custom styled picker for OCR files
  const OCRFilePicker = ({ label, fileValue, onPick, onClear, inputKey }) => {
    const inputId = `ocr-${label.toLowerCase()}-${inputKey}`;
    return (
      <div>
        <p className="text-[11px] text-gray-400 mb-2 font-bold uppercase tracking-widest">
          {label}
        </p>

        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3">
          <label
            htmlFor={inputId}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 hover:border-[#38E07B]/30 transition cursor-pointer text-xs font-bold"
          >
            <FiUpload />
            Choose
          </label>

          <span className="flex-1 min-w-0 text-sm text-gray-300 truncate">
            {fileValue?.name || "No file selected"}
          </span>

          {fileValue && (
            <button
              type="button"
              onClick={onClear}
              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition"
              title="Clear"
            >
              <FiX />
            </button>
          )}
        </div>

        <input
          key={inputKey}
          id={inputId}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] || null)}
        />

        <p className="text-[10px] text-gray-500 mt-2">
          Tip: take a close, sharp photo with good lighting.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl my-8">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Add New Product</h1>
        <p className="text-gray-300 mt-1">Enter details below to track your inventory.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Voice */}
        {voiceSupported && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className={labelStyle}>Voice Language</label>
            <SelectMenu
              value={voiceLang}
              onChange={(val) => setVoiceLang(val)}
              options={voiceLangOptions}
              size="sm"
              className="mt-1"
            />
          </div>
        )}

        {/* ✅ OCR Front/Back (styled inputs) */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <label className={labelStyle}>OCR (Front / Back)</label>

          <div className="grid md:grid-cols-2 gap-4">
            <OCRFilePicker
              label="Front"
              fileValue={frontFile}
              inputKey={frontKey}
              onPick={(f) => setFrontFile(f)}
              onClear={() => {
                setFrontFile(null);
                setFrontKey((k) => k + 1);
              }}
            />

            <OCRFilePicker
              label="Back"
              fileValue={backFile}
              inputKey={backKey}
              onPick={(f) => setBackFile(f)}
              onClear={() => {
                setBackFile(null);
                setBackKey((k) => k + 1);
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleOCR}
            disabled={ocrLoading || (!frontFile && !backFile)}
            className="mt-4 w-full bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-60 font-bold text-sm"
          >
            {ocrLoading ? "Reading..." : "Extract Details (OCR)"}
          </button>

          {ocrResult?.rawText && (
            <details className="mt-4">
              <summary className="text-xs text-gray-400 cursor-pointer">
                Show OCR text
              </summary>
              <pre className="mt-2 whitespace-pre-wrap text-[11px] text-gray-300 bg-black/30 p-3 rounded-xl border border-white/10 max-h-48 overflow-auto">
                {ocrResult.rawText}
              </pre>
            </details>
          )}
        </div>

        {/* Barcode */}
        <div>
          <label className={labelStyle}>Barcode</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g. 5601234567890"
              className={`${inputStyle} flex-1`}
            />

            <button
              type="button"
              onClick={() => setShowScanner((p) => !p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                showScanner
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-[#38E07B] text-[#122017] hover:bg-[#2fc468]"
              }`}
            >
              {showScanner ? <FiX /> : <FiCamera />}
              {showScanner ? "Close" : "Scan"}
            </button>

            <button
              type="button"
              onClick={() => handleAutoFill(barcode)}
              disabled={scanning || !barcode.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {scanning ? "Loading..." : "Auto-fill"}
            </button>
          </div>

          {showScanner && (
            <div className="relative mt-4 rounded-xl overflow-hidden border-2 border-[#38E07B] bg-black">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                autoPlay
                playsInline
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-[#38E07B] rounded-lg animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Name + Category */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Product Name</label>
            <div className="flex gap-2 items-stretch">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Milk, Apples..."
                className={`${inputStyle} flex-1`}
                required
              />
              {voiceSupported && (
                <button
                  type="button"
                  onClick={() => speakToFill("name")}
                  disabled={listening}
                  className={micBtnOuter}
                  title="Voice: name"
                >
                  <FiMic />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className={labelStyle}>Category</label>
            <div className="flex gap-2 items-stretch">
              <div className="flex-1">
                <SelectMenu
                  value={form.category}
                  onChange={(val) => setForm((p) => ({ ...p, category: val }))}
                  options={CATEGORY_OPTIONS}
                />
              </div>
              {voiceSupported && (
                <button
                  type="button"
                  onClick={() => speakToFill("category")}
                  disabled={listening}
                  className={micBtnOuter}
                  title="Voice: category"
                >
                  <FiMic />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Expiry */}
        <div>
          <label className={labelStyle}>Expiry Date</label>
          <div className="flex gap-2 items-stretch">
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
              min={todayISO}
              className={`${inputStyle} flex-1`}
              style={{ colorScheme: "dark" }}
            />
            {voiceSupported && (
              <button
                type="button"
                onClick={() => speakToFill("expiryDate")}
                disabled={listening}
                className={micBtnOuter}
                title="Voice: expiry date"
              >
                <FiMic />
              </button>
            )}
          </div>
        </div>

        {/* Price + Weight */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Price ({currency})</label>
            <div className="flex gap-2 items-stretch">
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`${inputStyle} flex-1`}
                step="0.01"
                min="0"
              />
              {voiceSupported && (
                <button
                  type="button"
                  onClick={() => speakToFill("price")}
                  disabled={listening}
                  className={micBtnOuter}
                  title="Voice: price"
                >
                  <FiMic />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className={labelStyle}>Quantity / Size</label>
            <div className="flex gap-2 items-stretch">
              <div className="flex gap-2 flex-1">
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="500"
                  className={`${inputStyle} flex-1`}
                  min="0"
                />
                <SelectMenu
                  value={form.unit}
                  onChange={(val) => setForm((p) => ({ ...p, unit: val }))}
                  options={UNIT_OPTIONS}
                  className="w-28"
                />
              </div>

              {voiceSupported && (
                <button
                  type="button"
                  onClick={() => speakToFill("weight")}
                  disabled={listening}
                  className={micBtnOuter}
                  title="Voice: quantity"
                >
                  <FiMic />
                </button>
              )}
            </div>
          </div>
        </div>

        <hr className="border-white/10 my-6" />

        {/* Image + AI predict */}
        <div>
          <label className={labelStyle}>Product Image (Produce)</label>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="relative h-40 rounded-xl border-2 border-dashed border-white/20 overflow-hidden cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFile}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-[#38E07B]/10 flex items-center justify-center mb-3 text-[#38E07B]">
                      <FiUpload className="text-xl" />
                    </div>
                    <span className="text-sm text-gray-300">
                      Tap to capture or upload produce photo
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handlePredictFromImage}
                disabled={!file || predicting}
                className="mt-4 w-full text-xs font-bold bg-purple-600 text-white py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {predicting ? "Analyzing..." : (
                  <>
                    <FiZap /> Predict expiry from image
                  </>
                )}
              </button>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <FiLink className="text-[#38E07B]" /> Or paste image URL
              </p>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={inputStyle}
                disabled={!!file}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <Link
            to="/products"
            className="flex-1 text-center py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#38E07B] text-[#122017] font-bold py-3.5 rounded-xl hover:bg-[#2fc468] transition disabled:opacity-60"
          >
            {saving ? "Adding..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;