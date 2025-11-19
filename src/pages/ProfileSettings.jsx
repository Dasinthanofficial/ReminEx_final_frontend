import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiUploadCloud, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    user?.avatar || "/uploads/default_avatar.png"
  );

  /* 🔹 Mutation: update profile */
  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      // 👇 match to your Express route mount location:
      // backend app.use("/api/user", userRoutes);
      // so for baseURL = http://localhost:5000/api  -> use "/user/profile"
      const res = await api.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res; // interceptor already returns response.data
    },

    onSuccess: (data) => {
      const updated = data?.user;
      if (updated) {
        queryClient.invalidateQueries(["user"]);
        updateUser(updated);
        toast.success(data?.message || "Profile updated successfully!");
      } else {
        toast.success(data?.message || "Profile updated.");
      }
    },

    onError: (err) => {
      console.error("Profile update failed:", err);
      toast.error(err.response?.data?.message || "Profile update failed");
    },
  });

  /* 🔹 Submit handler */
  const onSubmit = (form) => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    if (file) formData.append("avatar", file);
    updateProfileMutation.mutate(formData);
  };

  /* 🔹 File preview handler */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f)); // blob preview
    }
  };

  /* 🔹 Safe image‑URL resolver for preview and saved avatars */
  const getAvatarSrc = (url) => {
    if (!url) return "/uploads/default_avatar.png";
    // 🟢 local preview blob -> show directly
    if (url.startsWith("blob:")) return url;
    // 🟢 full external URL
    if (url.startsWith("http")) return url;
    // 🟢 backend upload path like /uploads/filename.png
    const base =
      import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
      "http://localhost:5000";
    return `${base}${url.startsWith("/") ? url : `/${url}`}`;
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">👤 Profile Settings</h1>

      {updateProfileMutation.isError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
          <FiAlertTriangle className="mr-2" />
          Error: Could not save profile changes.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>

          <div className="relative w-32 h-32 mb-4">
            <img
              src={getAvatarSrc(previewUrl)}
              alt="avatar preview"
              className="w-full h-full rounded-full object-cover border-4 border-primary-100 shadow-md"
            />
          </div>

          <label className="cursor-pointer bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 transition flex items-center">
            <FiUploadCloud className="mr-2" />
            {file ? "Change Picture" : "Upload Picture"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">Max 5 MB (JPG, PNG)</p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Email (read‑only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            Email can’t be changed in this form.
          </p>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? "Saving…" : (
              <>
                <FiSave className="mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;