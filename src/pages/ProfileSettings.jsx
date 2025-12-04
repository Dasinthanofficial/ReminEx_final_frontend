

// // import React, { useState } from "react";
// // import { useForm } from "react-hook-form";
// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import { FiSave, FiCamera, FiUser, FiMail, FiShield, FiCreditCard, FiCalendar, FiCheckCircle } from "react-icons/fi";
// // import { Link } from "react-router-dom";
// // import toast from "react-hot-toast";
// // import { motion } from "framer-motion";
// // import { format } from "date-fns"; // 👈 Import date formatter
// // import api from "../services/api";
// // import { useAuth } from "../context/AuthContext";

// // const getAvatarSrc = (url) => {
// //   const fallback = "/uploads/default_avatar.png";
// //   if (!url) url = fallback;
// //   if (url.startsWith("blob:") || url.startsWith("http")) return url;
// //   const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
// //   return `${base}${url.startsWith("/") ? url : `/${url}`}`;
// // };

// // const ProfileSettings = () => {
// //   const { user, updateUser } = useAuth();
// //   const queryClient = useQueryClient();
// //   const [file, setFile] = useState(null);
// //   const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

// //   const { register, handleSubmit } = useForm({
// //     defaultValues: {
// //       name: user?.name || "",
// //       email: user?.email || "",
// //     },
// //   });

// //   const updateProfileMutation = useMutation({
// //     mutationFn: async (formData) => {
// //       const res = await api.put("/user/profile", formData, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });
// //       return res;
// //     },
// //     onSuccess: (data) => {
// //       if (data?.user) {
// //         queryClient.invalidateQueries(["user"]);
// //         updateUser(data.user);
// //       }
// //       toast.success("Profile saved successfully");
// //     },
// //     onError: (err) => {
// //       toast.error(err.response?.data?.message || "Update failed");
// //     },
// //   });

// //   const onSubmit = (form) => {
// //     const formData = new FormData();
// //     formData.append("name", form.name);
// //     if (file) formData.append("avatar", file);
// //     updateProfileMutation.mutate(formData);
// //   };

// //   const handleFileChange = (e) => {
// //     const f = e.target.files[0];
// //     if (f) {
// //       setFile(f);
// //       setPreviewUrl(URL.createObjectURL(f));
// //     }
// //   };

// //   // Helper to format date safely
// //   const formatDate = (dateString) => {
// //     if (!dateString) return "N/A";
// //     return format(new Date(dateString), "MMMM dd, yyyy");
// //   };

// //   return (
// //     <div className="max-w-5xl mx-auto pb-12 relative">
      
// //       {/* 🌌 Liquid Background Animation */}
// //       <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
// //         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#38E07B]/10 rounded-full blur-[120px]"></div>
// //       </div>

// //       {/* Header */}
// //       <div className="mb-10 relative z-10">
// //         <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
// //         <p className="text-gray-400 mt-1">Manage your personal information and subscription.</p>
// //       </div>

// //       {/* Main Card */}
// //       <div className="grid md:grid-cols-3 gap-8 relative z-10">
        
// //         {/* Left Sidebar */}
// //         <div className="space-y-4">
// //           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg">
// //             <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#38E07B]/10 text-[#38E07B] font-bold rounded-xl border border-[#38E07B]/20 transition-all">
// //                <FiUser /> General Profile
// //             </button>
// //             <Link to="/plans" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all mt-2">
// //                <FiCreditCard /> Subscription
// //             </Link>
// //           </div>
// //         </div>

// //         {/* Right Content */}
// //         <motion.div 
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
// //         >
// //           <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
            
// //             {/* Avatar Section */}
// //             <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/10">
// //               <div className="relative group">
// //                 <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#38E07B] to-emerald-900">
// //                   <img
// //                     src={getAvatarSrc(previewUrl)}
// //                     alt="Profile"
// //                     className="w-full h-full rounded-full object-cover border-4 border-[#122017] group-hover:opacity-80 transition-opacity"
// //                   />
// //                 </div>
// //                 <label className="absolute bottom-1 right-1 bg-[#38E07B] p-2.5 rounded-full text-[#122017] shadow-lg cursor-pointer hover:bg-white transition-colors">
// //                   <FiCamera className="w-5 h-5" />
// //                   <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
// //                 </label>
// //               </div>
              
// //               <div className="text-center md:text-left">
// //                  <h3 className="text-xl font-bold text-white">Profile Picture</h3>
// //                  <p className="text-sm text-gray-400 mt-1 mb-4 max-w-xs">
// //                    Upload a new avatar. Recommended size: 400x400px.
// //                  </p>
// //                  <div className="flex gap-3 justify-center md:justify-start">
// //                     <button 
// //                         type="button"
// //                         onClick={() => document.querySelector('input[type="file"]').click()}
// //                         className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg border border-white/10 transition-all"
// //                     >
// //                         Upload New
// //                     </button>
// //                  </div>
// //               </div>
// //             </div>

// //             {/* Form Inputs */}
// //             <div className="space-y-6">
// //               <div className="space-y-2">
// //                 <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B]">Full Name</label>
// //                 <div className="relative group">
// //                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
// //                    <input
// //                      {...register("name", { required: true })}
// //                      className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] transition-all"
// //                    />
// //                 </div>
// //               </div>

// //               <div className="space-y-2">
// //                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
// //                 <div className="relative">
// //                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
// //                    <input
// //                      {...register("email")}
// //                      disabled
// //                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
// //                    />
// //                 </div>
// //                 <p className="text-xs text-gray-500 flex items-center gap-1">
// //                   <FiShield className="inline" /> Email cannot be changed for security reasons.
// //                 </p>
// //               </div>
// //             </div>

// //             {/* 🟢 NEW: Subscription Status Section */}
// //             <div className="pt-8 border-t border-white/10">
// //                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
// //                  <FiCreditCard className="text-[#38E07B]" /> Subscription Status
// //                </h3>
               
// //                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
// //                   <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                     
// //                      {/* Plan Name */}
// //                      <div>
// //                         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Plan</p>
// //                         <div className="flex items-center gap-2">
// //                           <span className="text-2xl font-bold text-[#38E07B]">{user?.plan}</span>
// //                           {user?.plan !== 'Free' && (
// //                             <span className="px-2 py-0.5 bg-[#38E07B]/20 text-[#38E07B] text-[10px] font-bold rounded-full border border-[#38E07B]/30">
// //                               PREMIUM
// //                             </span>
// //                           )}
// //                         </div>
// //                      </div>

// //                      {/* Expiry Date Logic */}
// //                      {user?.plan === 'Free' ? (
// //                         <div className="text-right">
// //                           <p className="text-gray-400 text-sm mb-2">Upgrade to unlock AI & Limits</p>
// //                           <Link to="/plans" className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition border border-white/10">
// //                              Upgrade Plan
// //                           </Link>
// //                         </div>
// //                      ) : (
// //                         <div className="flex items-center gap-4 bg-black/20 px-4 py-3 rounded-xl border border-white/5">
// //                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
// //                               <FiCalendar size={20} />
// //                            </div>
// //                            <div>
// //                               <p className="text-xs font-bold text-gray-400 uppercase">Expires On</p>
// //                               <p className="text-white font-mono font-bold">
// //                                 {formatDate(user?.planExpiry)}
// //                               </p>
// //                            </div>
// //                            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
// //                            <div className="text-green-400 text-xs font-bold flex items-center gap-1">
// //                              <FiCheckCircle /> Active
// //                            </div>
// //                         </div>
// //                      )}
// //                   </div>
// //                </div>
// //             </div>

// //             {/* Action Bar */}
// //             <div className="pt-6 flex items-center gap-4 border-t border-white/10">
// //               <button
// //                 type="submit"
// //                 disabled={updateProfileMutation.isPending}
// //                 className="flex items-center justify-center px-8 py-3 bg-[#38E07B] text-[#122017] font-bold rounded-xl shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:shadow-[0_0_30px_rgba(56,224,123,0.5)] hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
// //               >
// //                 {updateProfileMutation.isPending ? (
// //                    <span className="flex items-center gap-2">
// //                      <div className="w-4 h-4 border-2 border-[#122017] border-t-transparent rounded-full animate-spin"/> 
// //                      Saving...
// //                    </span>
// //                 ) : (
// //                    <><FiSave className="mr-2" /> Save Changes</>
// //                 )}
// //               </button>
              
// //               <button 
// //                 type="button" 
// //                 onClick={() => window.history.back()} 
// //                 className="px-6 py-3 text-gray-400 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-all"
// //               >
// //                  Cancel
// //               </button>
// //             </div>

// //           </form>
// //         </motion.div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfileSettings;


// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { FiSave, FiCamera, FiUser, FiMail, FiShield, FiCreditCard, FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";
// import { format } from "date-fns"; 
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const getAvatarSrc = (url) => {
//   const fallback = "/uploads/default_avatar.png";
//   if (!url) url = fallback;
//   if (url.startsWith("blob:") || url.startsWith("http")) return url;
//   const base = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
//   return `${base}${url.startsWith("/") ? url : `/${url}`}`;
// };

// const ProfileSettings = () => {
//   const { user, updateUser } = useAuth();
//   const queryClient = useQueryClient();
//   const [file, setFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(user?.avatar || "");

//   const { register, handleSubmit } = useForm({
//     defaultValues: {
//       name: user?.name || "",
//       email: user?.email || "",
//     },
//   });

//   // Profile Update Mutation
//   const updateProfileMutation = useMutation({
//     mutationFn: async (formData) => {
//       const res = await api.put("/user/profile", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return res;
//     },
//     onSuccess: (data) => {
//       if (data?.user) {
//         queryClient.invalidateQueries(["user"]);
//         updateUser(data.user);
//       }
//       toast.success("Profile saved successfully");
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Update failed");
//     },
//   });

//   // Cancel Subscription Mutation
//   const cancelMutation = useMutation({
//     mutationFn: () => api.post("/payment/cancel"),
//     onSuccess: () => {
//       toast.success("Subscription cancelled.");
//       queryClient.invalidateQueries(["user"]);
//       updateUser((prev) => ({ ...prev, plan: "Free", planExpiry: null }));
//     },
//     onError: (err) => toast.error(err.response?.data?.message || "Failed to cancel"),
//   });

//   const onSubmit = (form) => {
//     const formData = new FormData();
//     formData.append("name", form.name);
//     if (file) formData.append("avatar", file);
//     updateProfileMutation.mutate(formData);
//   };

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (f) {
//       setFile(f);
//       setPreviewUrl(URL.createObjectURL(f));
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm("Are you sure? If you cancel now, you will lose Premium access immediately.")) {
//       cancelMutation.mutate();
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return format(new Date(dateString), "MMMM dd, yyyy");
//   };

//   return (
//     <div className="max-w-5xl mx-auto pb-12 relative">
      
//       {/* 🌌 Liquid Background Animation */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
//         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#38E07B]/10 rounded-full blur-[120px]"></div>
//       </div>

//       {/* Header */}
//       <div className="mb-10 relative z-10">
//         <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
//         <p className="text-gray-400 mt-1">Manage your personal information and subscription.</p>
//       </div>

//       {/* Main Card */}
//       <div className="grid md:grid-cols-3 gap-8 relative z-10">
        
//         {/* Left Sidebar */}
//         <div className="space-y-4">
//           <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg">
//             <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#38E07B]/10 text-[#38E07B] font-bold rounded-xl border border-[#38E07B]/20 transition-all">
//                <FiUser /> General Profile
//             </button>
//             <Link to="/plans" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all mt-2">
//                <FiCreditCard /> Subscription
//             </Link>
//           </div>
//         </div>

//         {/* Right Content */}
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
//         >
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative z-10">
            
//             {/* Avatar Section */}
//             <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/10">
//               <div className="relative group">
//                 <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#38E07B] to-emerald-900">
//                   <img
//                     src={getAvatarSrc(previewUrl)}
//                     alt="Profile"
//                     className="w-full h-full rounded-full object-cover border-4 border-[#122017] group-hover:opacity-80 transition-opacity"
//                   />
//                 </div>
//                 <label className="absolute bottom-1 right-1 bg-[#38E07B] p-2.5 rounded-full text-[#122017] shadow-lg cursor-pointer hover:bg-white transition-colors">
//                   <FiCamera className="w-5 h-5" />
//                   <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
//                 </label>
//               </div>
              
//               <div className="text-center md:text-left">
//                  <h3 className="text-xl font-bold text-white">Profile Picture</h3>
//                  <p className="text-sm text-gray-400 mt-1 mb-4 max-w-xs">
//                    Upload a new avatar. Recommended size: 400x400px.
//                  </p>
//                  <div className="flex gap-3 justify-center md:justify-start">
//                     <button 
//                         type="button"
//                         onClick={() => document.querySelector('input[type="file"]').click()}
//                         className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg border border-white/10 transition-all"
//                     >
//                         Upload New
//                     </button>
//                  </div>
//               </div>
//             </div>

//             {/* Form Inputs */}
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-xs font-bold uppercase tracking-wider text-[#38E07B]">Full Name</label>
//                 <div className="relative group">
//                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#38E07B] transition-colors text-lg" />
//                    <input
//                      {...register("name", { required: true })}
//                      className="w-full pl-12 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 outline-none focus:border-[#38E07B] focus:ring-1 focus:ring-[#38E07B] transition-all"
//                    />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
//                 <div className="relative">
//                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
//                    <input
//                      {...register("email")}
//                      disabled
//                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
//                    />
//                 </div>
//                 <p className="text-xs text-gray-500 flex items-center gap-1">
//                   <FiShield className="inline" /> Email cannot be changed for security reasons.
//                 </p>
//               </div>
//             </div>

//             {/* 🟢 Subscription Status Section */}
//             <div className="pt-8 border-t border-white/10">
//                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
//                  <FiCreditCard className="text-[#38E07B]" /> Subscription Status
//                </h3>
               
//                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
//                   <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                     
//                      {/* Plan Name */}
//                      <div>
//                         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Plan</p>
//                         <div className="flex items-center gap-2">
//                           <span className="text-2xl font-bold text-[#38E07B]">{user?.plan}</span>
//                           {user?.plan !== 'Free' && (
//                             <span className="px-2 py-0.5 bg-[#38E07B]/20 text-[#38E07B] text-[10px] font-bold rounded-full border border-[#38E07B]/30">
//                               ACTIVE TRIAL / PREMIUM
//                             </span>
//                           )}
//                         </div>
//                      </div>

//                      {/* Logic for Free vs Premium */}
//                      {user?.plan === 'Free' ? (
//                         <div className="text-right">
//                           <p className="text-gray-400 text-sm mb-2">Upgrade to unlock AI & Limits</p>
//                           <Link to="/plans" className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition border border-white/10">
//                              Upgrade Plan
//                           </Link>
//                         </div>
//                      ) : (
//                         <div className="flex flex-col items-end gap-3">
//                            <div className="flex items-center gap-4 bg-black/20 px-4 py-3 rounded-xl border border-white/5">
//                               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
//                                  <FiCalendar size={20} />
//                               </div>
//                               <div>
//                                  <p className="text-xs font-bold text-gray-400 uppercase">Renews / Expires</p>
//                                  <p className="text-white font-mono font-bold">
//                                    {formatDate(user?.planExpiry)}
//                                  </p>
//                               </div>
//                               <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
//                               <div className="text-green-400 text-xs font-bold flex items-center gap-1">
//                                 <FiCheckCircle /> Active
//                               </div>
//                            </div>

//                            {/* 🔴 CANCEL BUTTON */}
//                            <button 
//                               onClick={handleCancel}
//                               disabled={cancelMutation.isPending}
//                               className="text-red-400 text-xs font-bold hover:text-red-300 transition flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
//                            >
//                               {cancelMutation.isPending ? "Cancelling..." : <><FiXCircle /> Cancel Subscription</>}
//                            </button>
//                         </div>
//                      )}
//                   </div>
//                </div>
//             </div>

//             {/* Action Bar */}
//             <div className="pt-6 flex items-center gap-4 border-t border-white/10">
//               <button
//                 type="submit"
//                 disabled={updateProfileMutation.isPending}
//                 className="flex items-center justify-center px-8 py-3 bg-[#38E07B] text-[#122017] font-bold rounded-xl shadow-[0_0_20px_rgba(56,224,123,0.3)] hover:shadow-[0_0_30px_rgba(56,224,123,0.5)] hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
//               >
//                 {updateProfileMutation.isPending ? (
//                    <span className="flex items-center gap-2">
//                      <div className="w-4 h-4 border-2 border-[#122017] border-t-transparent rounded-full animate-spin"/> 
//                      Saving...
//                    </span>
//                 ) : (
//                    <><FiSave className="mr-2" /> Save Changes</>
//                 )}
//               </button>
              
//               <button 
//                 type="button" 
//                 onClick={() => window.history.back()} 
//                 className="px-6 py-3 text-gray-400 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-all"
//               >
//                  Cancel
//               </button>
//             </div>

//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSettings;


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FiSave, FiCamera, FiUser, FiMail, FiShield, FiCreditCard, 
  FiCalendar, FiCheckCircle, FiXCircle, FiAlertTriangle 
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { format } from "date-fns"; 
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
  
  // 🆕 State for the Custom Modal
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Profile Update Mutation
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

  // Cancel Subscription Mutation
  const cancelMutation = useMutation({
    mutationFn: () => api.post("/payment/cancel"),
    onSuccess: () => {
      toast.success("Subscription cancelled.");
      queryClient.invalidateQueries(["user"]);
      updateUser((prev) => ({ ...prev, plan: "Free", planExpiry: null }));
      setShowCancelModal(false); // Close modal on success
    },
    onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to cancel");
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
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  // 🆕 Actual function to run when user confirms in Modal
  const confirmCancel = () => {
    cancelMutation.mutate();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMMM dd, yyyy");
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
        <p className="text-gray-400 mt-1">Manage your personal information and subscription.</p>
      </div>

      {/* Main Card */}
      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Sidebar */}
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#38E07B]/10 text-[#38E07B] font-bold rounded-xl border border-[#38E07B]/20 transition-all">
               <FiUser /> General Profile
            </button>
            <Link to="/plans" className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all mt-2">
               <FiCreditCard /> Subscription
            </Link>
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
                   Upload a new avatar. Recommended size: 400x400px.
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

            {/* 🟢 Subscription Status Section */}
            <div className="pt-8 border-t border-white/10">
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <FiCreditCard className="text-[#38E07B]" /> Subscription Status
               </h3>
               
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                     
                     {/* Plan Name */}
                     <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Plan</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-[#38E07B]">{user?.plan}</span>
                          {user?.plan !== 'Free' && (
                            <span className="px-2 py-0.5 bg-[#38E07B]/20 text-[#38E07B] text-[10px] font-bold rounded-full border border-[#38E07B]/30">
                              ACTIVE TRIAL / PREMIUM
                            </span>
                          )}
                        </div>
                     </div>

                     {/* Logic for Free vs Premium */}
                     {user?.plan === 'Free' ? (
                        <div className="text-right">
                          <p className="text-gray-400 text-sm mb-2">Upgrade to unlock AI & Limits</p>
                          <Link to="/plans" className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition border border-white/10">
                             Upgrade Plan
                          </Link>
                        </div>
                     ) : (
                        <div className="flex flex-col items-end gap-3">
                           <div className="flex items-center gap-4 bg-black/20 px-4 py-3 rounded-xl border border-white/5">
                              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                 <FiCalendar size={20} />
                              </div>
                              <div>
                                 <p className="text-xs font-bold text-gray-400 uppercase">Renews / Expires</p>
                                 <p className="text-white font-mono font-bold">
                                   {formatDate(user?.planExpiry)}
                                 </p>
                              </div>
                              <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
                              <div className="text-green-400 text-xs font-bold flex items-center gap-1">
                                <FiCheckCircle /> Active
                              </div>
                           </div>

                           {/* 🔴 CANCEL BUTTON TRIGGER */}
                           <button 
                              type="button"
                              onClick={() => setShowCancelModal(true)} // Opens the modal
                              className="text-red-400 text-xs font-bold hover:text-red-300 transition flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20"
                           >
                              <FiXCircle /> Cancel Subscription
                           </button>
                        </div>
                     )}
                  </div>
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

      {/* 🛑 CUSTOM CONFIRMATION MODAL */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#122017] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="text-3xl text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure? If you cancel now, you will lose Premium access and AI features immediately.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/5"
                >
                  No, Keep It
                </button>
                <button 
                  onClick={confirmCancel}
                  disabled={cancelMutation.isPending}
                  className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                >
                  {cancelMutation.isPending ? "Processing..." : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProfileSettings;