// import React, { useRef, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   FiSave,
//   FiCamera,
//   FiUser,
//   FiMail,
//   FiShield,
//   FiCreditCard,
//   FiCalendar,
//   FiXCircle,
//   FiAlertTriangle,
// } from "react-icons/fi";
// import { Link, useNavigate } from "react-router-dom"; // ✅ added useNavigate
// import toast from "react-hot-toast";
// import { motion, AnimatePresence } from "framer-motion";
// import { format } from "date-fns";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// import DefaultAvatar from "../assets/default_avatar.png";

// const getAvatarSrc = (url) => {
//   if (!url) return DefaultAvatar;
//   if (url.startsWith("blob:") || url.startsWith("http")) return url;

//   const base =
//     import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
//     "http://localhost:5000";
//   return `${base}${url.startsWith("/") ? url : `/${url}`}`;
// };

// const ProfileSettings = () => {
//   const { user, updateUser } = useAuth();
//   const queryClient = useQueryClient();
//   const navigate = useNavigate(); // ✅ initialize navigation

//   const fileInputRef = useRef(null);

//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");
//   const [showCancelModal, setShowCancelModal] = useState(false);

//   const { register, handleSubmit } = useForm({
//     defaultValues: {
//       name: user?.name || "",
//       email: user?.email || "",
//     },
//   });

//   const updateProfileMutation = useMutation({
//     mutationFn: async (formData) => {
//       const res = await api.put("/user/profile", formData);
//       return res;
//     },
//     onSuccess: (data) => {
//       if (data?.user) {
//         queryClient.invalidateQueries(["user"]);
//         updateUser(data.user);
//       }
//       toast.success("Profile saved successfully");
//       navigate("/"); // ✅ navigate to home page after successful save
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Update failed");
//     },
//   });

//   const cancelMutation = useMutation({
//     mutationFn: () => api.post("/payment/cancel"),
//     onSuccess: () => {
//       toast.success("Subscription cancelled.");
//       queryClient.invalidateQueries(["user"]);
//       updateUser((prev) => ({ ...prev, plan: "Free", planExpiry: null }));
//       setShowCancelModal(false);
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Failed to cancel");
//       setShowCancelModal(false);
//     },
//   });

//   const onSubmit = (form) => {
//     const formData = new FormData();
//     formData.append("name", form.name);
//     if (file) formData.append("avatar", file);
//     updateProfileMutation.mutate(formData);
//   };

//   const handleFileChange = (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;

//     if (!f.type.startsWith("image/")) {
//       toast.error("Please select an image");
//       return;
//     }
//     if (f.size > 5 * 1024 * 1024) {
//       toast.error("Image must be under 5MB");
//       return;
//     }

//     setFile(f);
//     setPreviewUrl(URL.createObjectURL(f));
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return format(new Date(dateString), "MMMM dd, yyyy");
//   };

//   return (
//     <div className="max-w-5xl mx-auto pb-12 relative">
//       <div className="mb-6 md:mb-10 relative z-10">
//         <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
//           Account Settings
//         </h1>
//         <p className="text-gray-400 mt-1 text-sm md:text-base">
//           Manage your personal information and subscription.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
//         {/* Left */}
//         <div className="space-y-4">
//           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg flex flex-row md:flex-col gap-2 overflow-x-auto">
//             <button className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-[#38E07B]/10 text-[#38E07B] font-bold rounded-xl border border-[#38E07B]/20 transition-all whitespace-nowrap">
//               <FiUser /> General Profile
//             </button>
//             <Link
//               to="/plans"
//               className="flex-shrink-0 flex items-center gap-3 px-4 py-3 text-gray-400 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all whitespace-nowrap"
//             >
//               <FiCreditCard /> Subscription
//             </Link>
//           </div>
//         </div>

//         {/* Right */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
//         >
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-8 md:space-y-10 relative z-10"
//           >
//             {/* Avatar Section */}
//             <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 pb-8 border-b border-white/10">
//               <div className="relative group">
//                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-[#38E07B] to-emerald-900">
//                   <img
//                     src={getAvatarSrc(previewUrl)}
//                     alt="Profile"
//                     className="w-full h-full rounded-full object-cover border-4 border-[#122017] group-hover:opacity-80 transition-opacity"
//                   />
//                 </div>

//                 <label className="absolute bottom-1 right-1 bg-[#38E07B] p-2.5 rounded-full text-[#122017] shadow-lg cursor-pointer hover:bg-white transition-colors">
//                   <FiCamera className="w-5 h-5" />
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </label>
//               </div>

//               <div className="text-center md:text-left">
//                 <h3 className="text-lg md:text-xl font-bold text-white">
//                   Profile Picture
//                 </h3>
//                 <p className="text-sm text-gray-400 mt-1 mb-4 max-w-xs mx-auto md:mx-0">
//                   Upload a new avatar. Max 5MB.
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg border border-white/10 transition-all"
//                 >
//                   Upload New
//                 </button>
//               </div>
//             </div>

//             {/* Name + Email Fields */}
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B]">
//                   Full Name
//                 </label>
//                 <div className="relative group">
//                   <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
//                   <input
//                     {...register("name", { required: true })}
//                     className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] transition-all"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
//                   <input
//                     {...register("email")}
//                     disabled
//                     className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <FiShield className="inline" /> Email cannot be changed.
//                 </p>
//               </div>
//             </div>

//             {/* Subscription Section */}
//             <div className="pt-8 border-t border-white/10">
//               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                 <FiCreditCard className="text-[#38E07B]" /> Subscription Status
//               </h3>

//               <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
//                 <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
//                   <div>
//                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
//                       Current Plan
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xl md:text-2xl font-bold text-[#38E07B]">
//                         {user?.plan}
//                       </span>
//                       {user?.plan !== "Free" && (
//                         <span className="px-2 py-0.5 bg-[#38E07B]/20 text-[#38E07B] text-[10px] font-bold rounded-full border border-[#38E07B]/30">
//                           PREMIUM
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {user?.plan === "Free" ? (
//                     <div className="text-left md:text-right">
//                       <p className="text-gray-400 text-sm mb-2">
//                         Upgrade to unlock AI & Limits
//                       </p>
//                       <Link
//                         to="/plans"
//                         className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition border border-white/10"
//                       >
//                         Upgrade Plan
//                       </Link>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
//                       <div className="flex items-center gap-4 bg-black/20 px-4 py-3 rounded-xl border border-white/5 w-full md:w-auto">
//                         <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
//                           <FiCalendar size={20} />
//                         </div>
//                         <div>
//                           <p className="text-xs font-bold text-gray-400 uppercase">
//                             Renews / Expires
//                           </p>
//                           <p className="text-white font-mono font-bold text-sm">
//                             {formatDate(user?.planExpiry)}
//                           </p>
//                         </div>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => setShowCancelModal(true)}
//                         className="w-full md:w-auto text-red-400 text-xs font-bold hover:text-red-300 transition flex items-center justify-center md:justify-start gap-1 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
//                       >
//                         <FiXCircle /> Cancel Subscription
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Actions Section */}
//             <div className="pt-6 flex flex-col-reverse md:flex-row items-center gap-4 border-t border-white/10">
//               <button
//                 type="button"
//                 onClick={() => window.history.back()}
//                 className="w-full md:w-auto px-6 py-3 text-gray-400 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-all"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={updateProfileMutation.isPending}
//                 className="w-full md:w-auto flex items-center justify-center px-8 py-3 bg-[#38E07B] text-[#122017] font-bold rounded-xl shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:bg-[#2fc468] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
//               >
//                 <FiSave className="mr-2" />
//                 {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSettings;

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiSave,
  FiCamera,
  FiUser,
  FiMail,
  FiShield,
  FiCreditCard,
  FiCalendar,
  FiXCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import DefaultAvatar from "../assets/default_avatar.png";

const getAvatarSrc = (url) => {
  if (!url) return DefaultAvatar;
  if (url.startsWith("blob:") || url.startsWith("http")) return url;

  const base =
    import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
    "http://localhost:5000";
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
};

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // cleanup blob preview
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => api.put("/user/profile", formData),
    onSuccess: (data) => {
      if (data?.user) {
        queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
        updateUser(data.user);
      }
      toast.success("Profile saved successfully");
      navigate("/"); // keep your behavior
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.post("/payment/cancel"),
    onSuccess: () => {
      toast.success("Subscription cancelled.");
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
      updateUser((prev) => ({ ...prev, plan: "Free", planExpiry: null }));
      setShowCancelModal(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to cancel");
      setShowCancelModal(false);
    },
  });

  const onSubmit = (form) => {
    const formData = new FormData();
    formData.append("name", form.name);
    if (file) formData.append("avatar", file);
    updateProfileMutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    // revoke previous blob if any
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);

    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMMM dd, yyyy");
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 relative">
      <div className="mb-6 md:mb-10 relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">
          Manage your personal information and subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
        {/* Left */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg flex flex-row md:flex-col gap-2 overflow-x-auto">
            <button
              type="button"
              className="flex-shrink-0 flex items-center gap-3 px-4 py-3 bg-[#38E07B]/10 text-[#38E07B] font-bold rounded-xl border border-[#38E07B]/20 transition-all whitespace-nowrap"
            >
              <FiUser /> General Profile
            </button>

            <Link
              to="/plans"
              className="flex-shrink-0 flex items-center gap-3 px-4 py-3 text-gray-400 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all whitespace-nowrap"
            >
              <FiCreditCard /> Subscription
            </Link>
          </div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 md:space-y-10 relative z-10"
          >
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 pb-8 border-b border-white/10">
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-[#38E07B] to-emerald-900">
                  <img
                    src={getAvatarSrc(previewUrl)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-[#122017] group-hover:opacity-80 transition-opacity"
                  />
                </div>

                <label className="absolute bottom-1 right-1 bg-[#38E07B] p-2.5 rounded-full text-[#122017] shadow-lg cursor-pointer hover:bg-white transition-colors">
                  <FiCamera className="w-5 h-5" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  Profile Picture
                </h3>
                <p className="text-sm text-gray-400 mt-1 mb-4 max-w-xs mx-auto md:mx-0">
                  Upload a new avatar. Max 5MB.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg border border-white/10 transition-all"
                >
                  Upload New
                </button>
              </div>
            </div>

            {/* Name + Email Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B]">
                  Full Name
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
                  <input
                    {...register("name", { required: true })}
                    className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                  <input
                    {...register("email")}
                    disabled
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FiShield className="inline" /> Email cannot be changed.
                </p>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FiCreditCard className="text-[#38E07B]" /> Subscription Status
              </h3>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Current Plan
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl md:text-2xl font-bold text-[#38E07B]">
                        {user?.plan}
                      </span>
                      {user?.plan !== "Free" && (
                        <span className="px-2 py-0.5 bg-[#38E07B]/20 text-[#38E07B] text-[10px] font-bold rounded-full border border-[#38E07B]/30">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>

                  {user?.plan === "Free" ? (
                    <div className="text-left md:text-right">
                      <p className="text-gray-400 text-sm mb-2">
                        Upgrade to unlock AI & Limits
                      </p>
                      <Link
                        to="/plans"
                        className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition border border-white/10"
                      >
                        Upgrade Plan
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                      <div className="flex items-center gap-4 bg-black/20 px-4 py-3 rounded-xl border border-white/5 w-full md:w-auto">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                          <FiCalendar size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase">
                            Renews / Expires
                          </p>
                          <p className="text-white font-mono font-bold text-sm">
                            {formatDate(user?.planExpiry)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCancelModal(true)}
                        className="w-full md:w-auto text-red-400 text-xs font-bold hover:text-red-300 transition flex items-center justify-center md:justify-start gap-1 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                      >
                        <FiXCircle /> Cancel Subscription
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="pt-6 flex flex-col-reverse md:flex-row items-center gap-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full md:w-auto px-6 py-3 text-gray-400 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full md:w-auto flex items-center justify-center px-8 py-3 bg-[#38E07B] text-[#122017] font-bold rounded-xl shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:bg-[#2fc468] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FiSave className="mr-2" />
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Cancel subscription modal */}
          <AnimatePresence>
            {showCancelModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onMouseDown={(e) => {
                  if (e.target === e.currentTarget) setShowCancelModal(false);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.98 }}
                  className="bg-[#1a2c23] border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px]" />

                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-red-500/20">
                    <FiAlertTriangle />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Cancel subscription?
                  </h3>

                  <p className="text-gray-400 mb-6 text-sm">
                    You will be downgraded to the Free plan. This action may end premium
                    features immediately.
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 py-2.5 rounded-xl font-bold text-gray-400 bg-white/5 hover:bg-white/10 transition text-sm border border-white/5"
                    >
                      Keep Plan
                    </button>

                    <button
                      type="button"
                      onClick={() => cancelMutation.mutate()}
                      disabled={cancelMutation.isPending}
                      className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 text-sm shadow-lg shadow-red-900/20"
                    >
                      {cancelMutation.isPending ? "Cancelling..." : "Cancel Plan"}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;