import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiCamera, FiUser, FiMail, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
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
    <div className="max-w-5xl mx-auto pb-12 relative">
      
      {/* 🌌 Liquid Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#38E07B]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-gray-400 mt-1">Manage your personal information and security.</p>
      </div>

      {/* Main Card */}
      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Sidebar */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#38E07B]/10 text-[#38E07B] font-bold rounded-xl border border-[#38E07B]/20 transition-all">
               <FiUser /> General Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all mt-2">
               <FiShield /> Security & Privacy
            </button>
          </div>
        </div>

        {/* Right Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
            
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#38E07B] to-emerald-900">
                  <img
                    src={getAvatarSrc(previewUrl)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-[#122017] group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <label className="absolute bottom-1 right-1 bg-[#38E07B] p-2.5 rounded-full text-[#122017] shadow-lg cursor-pointer hover:bg-white transition-colors">
                  <FiCamera className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              
              <div className="text-center md:text-left">
                 <h3 className="text-xl font-bold text-white">Profile Picture</h3>
                 <p className="text-sm text-gray-400 mt-1 mb-4 max-w-xs">
                   Upload a new avatar. Recommended size: 400x400px. Max size: 5MB.
                 </p>
                 <div className="flex gap-3 justify-center md:justify-start">
                    <button 
                        type="button"
                        onClick={() => document.querySelector('input[type="file"]').click()}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg border border-white/10 transition-all"
                    >
                        Upload New
                    </button>
                 </div>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B]">Full Name</label>
                <div className="relative group">
                   <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                   <input
                     {...register("name", { required: true })}
                     className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] transition-all"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                <div className="relative">
                   <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                   <input
                     {...register("email")}
                     disabled
                     className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
                   />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FiShield className="inline" /> Email cannot be changed for security reasons.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 flex items-center gap-4 border-t border-white/10">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex items-center justify-center px-8 py-3 bg-[#38E07B] text-[#122017] font-bold rounded-xl shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:shadow-[0_0_30px_rgba(56,224,123,0.5)] hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {updateProfileMutation.isPending ? (
                   <span className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-[#122017] border-t-transparent rounded-full animate-spin"/> 
                     Saving...
                   </span>
                ) : (
                   <><FiSave className="mr-2" /> Save Changes</>
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => window.history.back()} 
                className="px-6 py-3 text-gray-400 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                 Cancel
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;