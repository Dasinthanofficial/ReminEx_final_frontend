import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiTrash2, FiSearch } from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const { isSuperAdmin, user: currentUser } = useAuth();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.get("/admin/users"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete user");
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

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action is irreversible."
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.name + user.email)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
          <p className="text-gray-400 text-sm mt-1">Manage system access and roles.</p>
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
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition">
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
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    {!isSuperAdmin || currentUser?.id === user._id ? (
                      <span
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
                          user.role === "superadmin"
                            ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                            : user.role === "admin"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {user.role}
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          roleMutation.mutate({
                            id: user._id,
                            role: e.target.value,
                          })
                        }
                        className="bg-black/40 border border-white/10 text-xs text-white rounded-lg px-2 py-1 outline-none focus:border-[#38E07B] cursor-pointer"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="superadmin">superadmin</option>
                      </select>
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
                    {user.role === "user" && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all"
                        title="Delete user"
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
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;