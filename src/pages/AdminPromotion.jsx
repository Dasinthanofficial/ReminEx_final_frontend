import React, { useMemo, useRef, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiSend, FiType, FiUsers } from "react-icons/fi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import toast from "react-hot-toast";
import api from "../services/api";
import AdminPageShell from "../components/AdminPageShell";

const AdminPromotion = () => {
  const quillRef = useRef(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("all"); // all | free | premium

  const uploadImage = useCallback(async (file) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await api.post("/admin/upload-image", fd);
    if (!res?.url) throw new Error("Upload failed: no URL returned");
    return res.url;
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }

      toast.loading("Uploading image...", { id: "promoUpload" });

      try {
        const url = await uploadImage(file);

        const editor = quillRef.current?.getEditor?.();
        if (!editor) {
          toast.error("Editor not ready", { id: "promoUpload" });
          return;
        }

        const range = editor.getSelection(true) || { index: editor.getLength() };
        editor.insertEmbed(range.index, "image", url, "user");
        editor.setSelection(range.index + 1);

        toast.success("Image uploaded", { id: "promoUpload" });
      } catch (e) {
        toast.error(e?.message || "Upload failed", { id: "promoUpload" });
      }
    };
  }, [uploadImage]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }], // ✅ toolbar uses bullet value
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler]
  );

  // ✅ IMPORTANT: "bullet" is NOT a format. Use "list" only.
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",     // ✅ keep list
    "align",
    "link",
    "image",
  ];

  const mutation = useMutation({
    mutationFn: (data) => api.post("/admin/promote", data),
    onSuccess: () => {
      toast.success("Promotion campaign started!");
      setSubject("");
      setMessage("");
      setTargetAudience("all");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to send emails.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subject.trim()) return toast.error("Subject required");

    const plain = message.replace(/<(.|\n)*?>/g, "").trim();
    const hasImage = /<img\s/i.test(message);
    if (!plain && !hasImage) return toast.error("Please write a message body");

    const confirmMsg =
      targetAudience === "all"
        ? "Are you sure you want to email ALL users?"
        : `Are you sure you want to email ${targetAudience.toUpperCase()} users?`;

    if (window.confirm(confirmMsg)) {
      mutation.mutate({ subject, message, targetAudience });
    }
  };

  return (
    <AdminPageShell>
      <div className="w-full min-w-0 pb-10">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Email Campaign
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Send formatted newsletters (images upload to Cloudinary).
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-lg min-w-0 overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 min-w-0">
            {/* Audience */}
            <div>
              <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2 flex items-center gap-2">
                <FiUsers /> Target Audience
              </label>

              <div className="relative">
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-3 md:p-4 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#38E07B] outline-none transition-all font-bold appearance-none"
                >
                  <option value="all">All Users</option>
                  <option value="free">Free Users</option>
                  <option value="premium">Premium Users</option>
                </select>

                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2 flex items-center gap-2">
                <FiType /> Subject Line
              </label>
              <input
                type="text"
                placeholder="e.g. Big Updates Coming!"
                className="w-full p-3 md:p-4 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#38E07B] outline-none transition-all font-bold text-base md:text-lg"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Editor */}
            <div className="min-w-0">
              <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2">
                Compose Email
              </label>

              <div
                className="
                  bg-white rounded-xl overflow-hidden text-black min-w-0
                  [&_.ql-toolbar]:border-b-gray-200
                  [&_.ql-toolbar]:flex
                  [&_.ql-toolbar]:flex-wrap
                  [&_.ql-toolbar_.ql-formats]:mr-2
                  [&_.ql-toolbar_.ql-formats]:mb-2
                  [&_.ql-container]:text-base
                  [&_.ql-editor]:min-h-[200px]
                "
              >
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={message}
                  onChange={setMessage}
                  modules={modules}
                  formats={formats}
                  className="h-56 md:h-80 mb-12 md:mb-10"
                  placeholder="Write something amazing..."
                />
              </div>
            </div>

            {/* Send */}
            <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-end">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full md:w-auto bg-[#38E07B] text-[#122017] px-8 py-3 rounded-xl font-bold hover:bg-[#2fc468] transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(56,224,123,0.2)]"
              >
                {mutation.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <FiSend /> Send Blast
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminPageShell>
  );
};

export default AdminPromotion;