// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { FiTrash2, FiSearch, FiUser } from 'react-icons/fi';
// import api from '../services/api';
// import toast from 'react-hot-toast';
// import { format } from 'date-fns';

// const AdminUsers = () => {
//   const queryClient = useQueryClient();
//   const [searchTerm, setSearchTerm] = useState("");

//   const { data: users, isLoading } = useQuery({
//     queryKey: ['adminUsers'],
//     queryFn: () => api.get('/admin/users'),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => api.delete(`/admin/users/${id}`),
//     onSuccess: () => {
//       toast.success("User deleted successfully");
//       queryClient.invalidateQueries(['adminUsers']);
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Failed to delete user");
//     }
//   });

//   const handleDelete = (id) => {
//     if(window.confirm("Are you sure you want to delete this user? This action is irreversible.")) {
//       deleteMutation.mutate(id);
//     }
//   };

//   const filteredUsers = users?.filter(user => 
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (isLoading) return <div className="p-8 text-center text-white">Loading users...</div>;

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-end">
//         <div>
//           <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
//           <p className="text-gray-400 text-sm mt-1">Manage system access and roles.</p>
//         </div>
//         <div className="relative">
//           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input 
//             type="text" 
//             placeholder="Search users..." 
//             className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[#38E07B] outline-none text-white placeholder-gray-500 transition-colors w-64"
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg">
//         <table className="w-full text-left">
//           <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
//             <tr>
//               <th className="px-6 py-4">User</th>
//               <th className="px-6 py-4">Role</th>
//               <th className="px-6 py-4">Plan</th>
//               <th className="px-6 py-4">Joined</th>
//               <th className="px-6 py-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-white/5">
//             {filteredUsers?.map((user) => (
//               <tr key={user._id} className="hover:bg-white/[0.02] transition">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-900 p-[2px]">
//                       <div className="w-full h-full rounded-full bg-[#122017] flex items-center justify-center text-white font-bold text-sm">
//                         {user.name.charAt(0)}
//                       </div>
//                     </div>
//                     <div className="ml-3">
//                       <div className="font-bold text-white text-sm">{user.name}</div>
//                       <div className="text-xs text-gray-500">{user.email}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
//                     user.role === 'admin' 
//                       ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
//                       : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
//                   }`}>
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4">
//                   <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
//                     user.plan === 'Free' 
//                       ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
//                       : 'bg-[#38E07B]/20 text-[#38E07B] border-[#38E07B]/30'
//                   }`}>
//                     {user.plan}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-xs text-gray-400 font-mono">
//                   {format(new Date(user.createdAt), 'MMM dd, yyyy')}
//                 </td>
//                 <td className="px-6 py-4 text-right">
//                   {user.role !== 'admin' && (
//                     <button 
//                       onClick={() => handleDelete(user._id)}
//                       className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all"
//                     >
//                       <FiTrash2 />
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {filteredUsers?.length === 0 && (
//           <div className="p-12 text-center text-gray-500">No users found matching your search.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTrash2, FiSearch, FiUser } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => api.get('/admin/users'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  });

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this user? This action is irreversible.")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-8 text-center text-white">Loading users...</div>;

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* 1. Stacked Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage system access and roles.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[#38E07B] outline-none text-white placeholder-gray-500 transition-colors"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Responsive Table Wrapper */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]"> {/* min-w prevents squishing */}
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
              {filteredUsers?.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-900 p-[2px]">
                        <div className="w-full h-full rounded-full bg-[#122017] flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="font-bold text-white text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
                      user.plan === 'Free' 
                        ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
                        : 'bg-[#38E07B]/20 text-[#38E07B] border-[#38E07B]/30'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers?.length === 0 && (
          <div className="p-12 text-center text-gray-500">No users found matching your search.</div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;