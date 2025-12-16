// import React, { Fragment, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Listbox, Transition } from "@headlessui/react";
// import { FiTrash2, FiSearch, FiChevronDown, FiCheck } from "react-icons/fi";
// import api from "../services/api";
// import toast from "react-hot-toast";
// import { format } from "date-fns";
// import { useAuth } from "../context/AuthContext";

// const getRoleStyles = (role) => {
//   switch (role) {
//     case "superadmin":
//       return {
//         bg: "bg-pink-500/20",
//         text: "text-pink-300",
//         border: "border-pink-500/30",
//         dot: "bg-pink-400",
//       };
//     case "admin":
//       return {
//         bg: "bg-purple-500/20",
//         text: "text-purple-300",
//         border: "border-purple-500/30",
//         dot: "bg-purple-400",
//       };
//     default:
//       return {
//         bg: "bg-blue-500/20",
//         text: "text-blue-300",
//         border: "border-blue-500/30",
//         dot: "bg-blue-400",
//       };
//   }
// };

// const ROLE_OPTIONS = [
//   { value: "user", label: "User" },
//   { value: "admin", label: "Admin" },
//   { value: "superadmin", label: "Superadmin" },
// ];

// /**
//  * Styled role dropdown used only by superadmin
//  */
// const RoleSelect = ({ value, disabled, onChange }) => {
//   const initial =
//     ROLE_OPTIONS.find((o) => o.value === value) || ROLE_OPTIONS[0];
//   const [selected, setSelected] = useState(initial);

//   const styles = getRoleStyles(selected.value);

//   const handleChange = (opt) => {
//     setSelected(opt);
//     if (!disabled) onChange?.(opt.value);
//   };

//   return (
//     <Listbox value={selected} onChange={handleChange} disabled={disabled}>
//       <div className="relative inline-block text-left">
//         {/* Button */}
//         <Listbox.Button
//           className={`
//             inline-flex items-center gap-1 rounded-lg border px-2 pr-6 py-1
//             text-[10px] font-bold uppercase tracking-wide
//             ${styles.bg} ${styles.text} ${styles.border}
//             ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-white/10"}
//           `}
//         >
//           <span
//             className={`w-1.5 h-1.5 rounded-full ${styles.dot} mr-1`}
//           ></span>
//           <span className="truncate">{selected.label}</span>
//           <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px]" />
//         </Listbox.Button>

//         {/* Options */}
//         <Transition
//           as={Fragment}
//           enter="transition ease-out duration-150"
//           enterFrom="opacity-0 translate-y-1"
//           enterTo="opacity-100 translate-y-0"
//           leave="transition ease-in duration-100"
//           leaveFrom="opacity-100 translate-y-0"
//           leaveTo="opacity-0 translate-y-1"
//         >
//           <Listbox.Options
//             className="
//               absolute z-[9999] mt-1 w-40 origin-top-left rounded-xl
//               border border-white/10 bg-[#122017]/95 backdrop-blur-xl
//               shadow-2xl focus:outline-none
//             "
//           >
//             {ROLE_OPTIONS.map((opt) => {
//               const optStyles = getRoleStyles(opt.value);
//               return (
//                 <Listbox.Option
//                   key={opt.value}
//                   value={opt}
//                   className={({ active }) =>
//                     `
//                       flex items-center justify-between px-3 py-2 text-[11px]
//                       cursor-pointer select-none
//                       ${active ? "bg-white/10 text-white" : "text-gray-200"}
//                     `
//                   }
//                 >
//                   {({ selected }) => (
//                     <>
//                       <span className="flex items-center gap-2">
//                         <span
//                           className={`w-1.5 h-1.5 rounded-full ${optStyles.dot}`}
//                         ></span>
//                           <span className="truncate">{opt.label}</span>
//                       </span>
//                       {selected && (
//                         <FiCheck className={`${optStyles.text} text-xs`} />
//                       )}
//                     </>
//                   )}
//                 </Listbox.Option>
//               );
//             })}
//           </Listbox.Options>
//         </Transition>
//       </div>
//     </Listbox>
//   );
// };

// const AdminUsers = () => {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");
//   const { isSuperAdmin, user: currentUser } = useAuth();

//   const { data: users = [], isLoading } = useQuery({
//     queryKey: ["adminUsers"],
//     queryFn: () => api.get("/admin/users"),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => api.delete(`/admin/users/${id}`),
//     onSuccess: () => {
//       toast.success("User deleted successfully");
//       queryClient.invalidateQueries(["adminUsers"]);
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Failed to delete user");
//     },
//   });

//   const roleMutation = useMutation({
//     mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
//     onSuccess: () => {
//       toast.success("User role updated");
//       queryClient.invalidateQueries(["adminUsers"]);
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Failed to update role");
//     },
//   });

//   const handleDelete = (id) => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete this user? This action is irreversible."
//       )
//     ) {
//       deleteMutation.mutate(id);
//     }
//   };

//   const filteredUsers =
//     users.filter((user) =>
//       (user.name + user.email).toLowerCase().includes(searchTerm.toLowerCase())
//     ) || [];

//   if (isLoading)
//     return <div className="p-8 text-center text-white">Loading users...</div>;

//   return (
//     <div className="space-y-6 md:space-y-8">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
//             User Management
//           </h1>
//           <p className="text-gray-400 text-sm mt-1">
//             Manage system access and roles.
//           </p>
//         </div>
//         <div className="relative w-full md:w-auto">
//           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search users..."
//             className="w-full md:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[#38E07B] outline-none text-white placeholder-gray-500 transition-colors"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left min-w-[700px]">
//             <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
//               <tr>
//                 <th className="px-6 py-4">User</th>
//                 <th className="px-6 py-4">Role</th>
//                 <th className="px-6 py-4">Plan</th>
//                 <th className="px-6 py-4">Joined</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {filteredUsers.map((user) => {
//                 const isSelf =
//                   currentUser && currentUser.email === user.email;
//                 const roleStyles = getRoleStyles(user.role);

//                 return (
//                   <tr
//                     key={user._id}
//                     className="hover:bg-white/[0.02] transition"
//                   >
//                     {/* User */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-900 p-[2px]">
//                           <div className="w-full h-full rounded-full bg-[#122017] flex items-center justify-center text-white font-bold text-sm">
//                             {user.name.charAt(0)}
//                           </div>
//                         </div>
//                         <div className="ml-3">
//                           <div className="font-bold text-white text-sm">
//                             {user.name}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {user.email}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Role */}
//                     <td className="px-6 py-4">
//                       {isSuperAdmin ? (
//                         <RoleSelect
//                           value={user.role}
//                           disabled={isSelf}
//                           onChange={(role) =>
//                             roleMutation.mutate({ id: user._id, role })
//                           }
//                         />
//                       ) : (
//                         <span
//                           className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${roleStyles.bg} ${roleStyles.text} ${roleStyles.border}`}
//                         >
//                           {user.role}
//                         </span>
//                       )}
//                     </td>

//                     {/* Plan */}
//                     <td className="px-6 py-4">
//                       <span
//                         className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
//                           user.plan === "Free"
//                             ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
//                             : "bg-[#38E07B]/20 text-[#38E07B] border-[#38E07B]/30"
//                         }`}
//                       >
//                         {user.plan}
//                       </span>
//                     </td>

//                     {/* Joined */}
//                     <td className="px-6 py-4 text-xs text-gray-400 font-mono">
//                       {format(new Date(user.createdAt), "MMM dd, yyyy")}
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-4 text-right">
//                       {user.role === "user" && (
//                         <button
//                           onClick={() => handleDelete(user._id)}
//                           className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all"
//                           title="Delete user"
//                         >
//                           <FiTrash2 />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {filteredUsers.length === 0 && (
//           <div className="p-12 text-center text-gray-500">
//             No users found matching your search.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;




import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiTrash2, FiSearch, FiChevronDown, FiAlertTriangle } from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";

const getRoleStyles = (role) => {
  switch (role) {
    case "superadmin":
      return {
        bg: "bg-pink-500/20",
        text: "text-pink-300",
        border: "border-pink-500/30",
      };
    case "admin":
      return {
        bg: "bg-purple-500/20",
        text: "text-purple-300",
        border: "border-purple-500/30",
      };
    default:
      return {
        bg: "bg-blue-500/20",
        text: "text-blue-300",
        border: "border-blue-500/30",
      };
  }
};

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const { isSuperAdmin, user: currentUser } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.get("/admin/users"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["adminUsers"]);
      setIsModalOpen(false);
      setUserToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
      setIsModalOpen(false);
      setUserToDelete(null);
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      toast.success("User role updated");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update role");
    },
  });

  // Open custom popup instead of window.confirm
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    deleteMutation.mutate(userToDelete._id);
  };

  const filteredUsers =
    users.filter((user) =>
      (user.name + user.email).toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading)
    return <div className="p-8 text-center text-white">Loading users...</div>;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            User Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage system access and roles.
          </p>
        </div>
        <div className="relative w-full md:w-auto">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[#38E07B] outline-none text-white placeholder-gray-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => {
                const isSelf =
                  currentUser && currentUser.email === user.email;
                const { bg, text, border } = getRoleStyles(user.role);

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-white/[0.02] transition"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-900 p-[2px]">
                          <div className="w-full h-full rounded-full bg-[#122017] flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="font-bold text-white text-sm">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      {isSuperAdmin ? (
                        // Styled role selector for superadmin
                        <div
                          className={`inline-flex items-center relative rounded-lg border ${bg} ${text} ${border} px-2 pr-6 py-1 text-[10px] font-bold uppercase tracking-wide`}
                        >
                          <select
                            value={user.role}
                            disabled={isSelf}
                            onChange={(e) =>
                              roleMutation.mutate({
                                id: user._id,
                                role: e.target.value,
                              })
                            }
                            className={`appearance-none bg-transparent border-none outline-none text-current text-[10px] font-bold uppercase tracking-wide pr-4 cursor-pointer ${
                              isSelf
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                            }`}
                          >
                            <option value="user" className="text-black">
                              User
                            </option>
                            <option value="admin" className="text-black">
                              Admin
                            </option>
                            <option value="superadmin" className="text-black">
                              Superadmin
                            </option>
                          </select>
                          {/* Custom arrow */}
                          <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px]" />
                        </div>
                      ) : (
                        // non-superadmin sees badge only
                        <span
                          className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${bg} ${text} ${border}`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
                          user.plan === "Free"
                            ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            : "bg-[#38E07B]/20 text-[#38E07B] border-[#38E07B]/30"
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {/* Only allow delete for normal users (role === user) */}
                      {user.role === "user" && (
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all"
                          title="Delete user"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No users found matching your search.
          </div>
        )}
      </div>

      {/* Delete confirmation popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a2c23] border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px]" />
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-red-500/20">
              <FiAlertTriangle />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Delete User?
            </h3>

            <p className="text-gray-400 mb-6 text-sm">
              Are you sure you want to remove{" "}
              <span className="text-white font-semibold">
                {userToDelete?.name}
              </span>{" "}
              (<span className="text-gray-300">{userToDelete?.email}</span>)?
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setUserToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-400 bg-white/5 hover:bg-white/10 transition text-sm border border-white/5"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 text-sm shadow-lg shadow-red-900/20"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;