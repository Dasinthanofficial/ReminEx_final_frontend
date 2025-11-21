import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiCamera, FiUser, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const getAvatarSrc = (url) => {
  const fallback = "/uploads/default_avatar.png";
  if (!url) url = fallback;
  if (url.startsWith("blob:") || url.startsWith("http")) return url;
  const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
};

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.put("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res;
    },
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.invalidateQueries(["user"]);
        updateUser(data.user);
      }
      toast.success("Profile saved successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  const onSubmit = (form) => {
    const formData = new FormData();
    formData.append("name", form.name);
    if (file) formData.append("avatar", file);
    updateProfileMutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your profile and preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar (Visual Only) */}
        <div className="w-full md:w-64 bg-gray-50 p-6 border-r border-gray-100 space-y-1 h-full min-h-[400px]">
          <button className="w-full flex items-center px-4 py-2.5 bg-white text-green-600 font-semibold rounded-lg shadow-sm border border-gray-200">
             <FiUser className="mr-3" /> General Profile
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-8">
            
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-4">Profile Photo</label>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src={getAvatarSrc(previewUrl)}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md group-hover:opacity-90 transition"
                  />
                  <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
                    <FiCamera className="w-4 h-4 text-gray-600" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
                <div>
                   <button 
                      type="button"
                      onClick={() => document.querySelector('input[type="file"]').click()}
                      className="text-sm font-semibold text-green-600 border border-green-200 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100 transition"
                   >
                      Upload New Photo
                   </button>
                   <p className="text-xs text-gray-400 mt-2">Allowed: JPG, PNG. Max 5MB.</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Personal Info */}
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                   <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                   <input
                     id="name"
                     type="text"
                     {...register("name", { required: true })}
                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-0 outline-none transition-all"
                   />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                   <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                   <input
                     id="email"
                     type="email"
                     {...register("email")}
                     disabled
                     className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                   />
                </div>
                <p className="text-xs text-gray-400">Contact support to change your email.</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex items-center gap-4">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex items-center justify-center px-6 py-2.5 bg-[#38E07B] text-[#122017] font-bold rounded-xl shadow-sm hover:bg-[#2fc468] hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isPending ? (
                   <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-[#122017] border-t-transparent rounded-full animate-spin"/> Saving...</span>
                ) : (
                   <><FiSave className="mr-2" /> Save Changes</>
                )}
              </button>
              <button type="button" onClick={() => window.history.back()} className="px-4 py-2.5 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition">
                 Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;