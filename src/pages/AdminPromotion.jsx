import React, { useMemo, useRef, useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiSend, FiType, FiUsers } from "react-icons/fi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminPromotion = () => {
  const quillRef = useRef(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("all"); // all | free | premium

  const uploadImage = useCallback(async (file) => {
    const fd = new FormData();
    fd.append("image", file);

    // NOTE: your axios interceptor returns response.data already
    const res =await api.post("/admin/upload-image", fd);

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
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler]
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
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
      toast.error(err.response?.data?.message || "Failed to send emails.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subject.trim()) return toast.error("Subject required");

    // basic empty check: remove tags, allow image-only emails too
    const plain = message.replace(/<(.|\n)*?>/g, "").trim();
    const hasImage = /<img\s/i.test(message);

    if (!plain && !hasImage) {
      return toast.error("Please write a message body");
    }

    const confirmMsg =
      targetAudience === "all"
        ? "Are you sure you want to email ALL users?"
        : `Are you sure you want to email ${targetAudience.toUpperCase()} users?`;

    if (window.confirm(confirmMsg)) {
      mutation.mutate({ subject, message, targetAudience });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Email Campaign
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Send formatted newsletters (images upload to Cloudinary).
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audience */}
          <div>
            <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2 flex items-center gap-2">
              <FiUsers /> Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#38E07B] outline-none transition-all font-bold"
            >
              <option value="all">All Users</option>
              <option value="free">Free Users</option>
              <option value="premium">Premium Users</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2 flex items-center gap-2">
              <FiType /> Subject Line
            </label>
            <input
              type="text"
              placeholder="e.g. Big Updates Coming!"
              className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#38E07B] outline-none transition-all font-bold text-lg"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Editor */}
          <div>
            <label className="block text-xs font-bold text-[#38E07B] uppercase mb-2">
              Compose Email
            </label>

            <div className="bg-white rounded-xl overflow-hidden text-black">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={message}
                onChange={setMessage}
                modules={modules}
                formats={formats}
                className="h-80 mb-12"
                placeholder="Write something amazing... Use the image button to upload."
              />
            </div>
          </div>

          {/* Send */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-[#38E07B] text-[#122017] px-8 py-3 rounded-xl font-bold hover:bg-[#2fc468] transition flex items-center gap-2 disabled:opacity-50"
            >
              {mutation.isPending ? "Sending..." : (
                <>
                  <FiSend /> Send Blast
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPromotion;