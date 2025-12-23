import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiAlertTriangle,
  FiCalendar,
  FiCreditCard,
  FiShield,
} from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import AdminPageShell from "../components/AdminPageShell";

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
    queryFn: async () => {
      const res = await api.get("/admin/users");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.users)) return res.users;
      return [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      setIsModalOpen(false);
      setUserToDelete(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete user");
      setIsModalOpen(false);
      setUserToDelete(null);
    },
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => {
      toast.success("User role updated");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update role");
    },
  });

  const openDeleteModal = (u) => {
    setUserToDelete(u);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete?._id) return;
    deleteMutation.mutate(userToDelete._id);
  };

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return (users || []).filter((u) =>
      ((u?.name || "") + " " + (u?.email || "")).toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  if (isLoading) {
    return <div className="p-8 text-center text-white">Loading users...</div>;
  }

  return (
    <AdminPageShell>
      <div className="space-y-6 md:space-y-8 w-full min-w-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              User Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Manage system access and roles.
            </p>
          </div>

          <div className="relative w-full md:w-auto min-w-0">
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

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((u) => {
            const isSelf = currentUser && currentUser.email === u.email;
            const { bg, text, border } = getRoleStyles(u.role);
            const letter = (u?.name || "?").charAt(0).toUpperCase();

            return (
              <div
                key={u._id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg relative overflow-hidden min-w-0"
              >
                <div className="flex justify-between items-start mb-4 gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-900 p-[2px] flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-[#122017] flex items-center justify-center text-white font-bold text-sm">
                        {letter}
                      </div>
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <h3 className="font-bold text-white text-sm truncate pr-2">
                        {u.name}
                      </h3>
                      <p className="text-xs text-gray-400 truncate pr-2">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  {u.role === "user" && (
                    <button
                      onClick={() => openDeleteModal(u)}
                      className="text-red-400 bg-red-500/10 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex-shrink-0"
                      title="Delete user"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 min-w-0">
                  <div className="bg-black/20 rounded-lg p-2 border border-white/5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                      <FiShield className="text-[#38E07B]" /> Role
                    </div>

                    {isSuperAdmin ? (
                      <div className={`relative w-full rounded-md border ${bg} ${text} ${border}`}>
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) =>
                            roleMutation.mutate({ id: u._id, role: e.target.value })
                          }
                          className="w-full bg-transparent p-1 pl-2 text-[10px] font-bold uppercase tracking-wide appearance-none outline-none text-current"
                        >
                          <option value="user" className="bg-[#122017] text-white">User</option>
                          <option value="admin" className="bg-[#122017] text-white">Admin</option>
                          <option value="superadmin" className="bg-[#122017] text-white">Super</option>
                        </select>
                        <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none" />
                      </div>
                    ) : (
                      <span className={`block w-full text-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md border ${bg} ${text} ${border}`}>
                        {u.role}
                      </span>
                    )}
                  </div>

                  <div className="bg-black/20 rounded-lg p-2 border border-white/5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                      <FiCreditCard className="text-blue-400" /> Plan
                    </div>
                    <span
                      className={`block w-full text-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md border ${
                        u.plan === "Free"
                          ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          : "bg-[#38E07B]/20 text-[#38E07B] border-[#38E07B]/30"
                      }`}
                    >
                      {u.plan}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-gray-500 border-t border-white/5 pt-2">
                  <FiCalendar />
                  Joined {format(new Date(u.createdAt), "MMM dd, yyyy")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-lg">
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
                {filteredUsers.map((u) => {
                  const isSelf = currentUser && currentUser.email === u.email;
                  const { bg, text, border } = getRoleStyles(u.role);
                  const letter = (u?.name || "?").charAt(0).toUpperCase();

                  return (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38E07B] to-emerald-900 p-[2px] shrink-0">
                            <div className="w-full h-full rounded-full bg-[#122017] flex items-center justify-center text-white font-bold text-sm">
                              {letter}
                            </div>
                          </div>
                          <div className="ml-3 min-w-0">
                            <div className="font-bold text-white text-sm truncate">{u.name}</div>
                            <div className="text-xs text-gray-500 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {isSuperAdmin ? (
                          <div className={`inline-flex items-center relative rounded-lg border ${bg} ${text} ${border} px-2 pr-6 py-1 text-[10px] font-bold uppercase tracking-wide`}>
                            <select
                              value={u.role}
                              disabled={isSelf}
                              onChange={(e) =>
                                roleMutation.mutate({ id: u._id, role: e.target.value })
                              }
                              className={`appearance-none bg-transparent border-none outline-none text-current text-[10px] font-bold uppercase tracking-wide pr-4 ${
                                isSelf ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                              }`}
                            >
                              <option value="user" className="bg-[#122017] text-white">User</option>
                              <option value="admin" className="bg-[#122017] text-white">Admin</option>
                              <option value="superadmin" className="bg-[#122017] text-white">Superadmin</option>
                            </select>
                            <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] pointer-events-none" />
                          </div>
                        ) : (
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${bg} ${text} ${border}`}>
                            {u.role}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border ${
                            u.plan === "Free"
                              ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                              : "bg-[#38E07B]/20 text-[#38E07B] border-[#38E07B]/30"
                          }`}
                        >
                          {u.plan}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                        {format(new Date(u.createdAt), "MMM dd, yyyy")}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {u.role === "user" && (
                          <button
                            onClick={() => openDeleteModal(u)}
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
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-500 bg-white/5 rounded-3xl border border-white/5">
            No users found matching your search.
          </div>
        )}

        {/* Delete modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a2c23] border border-white/10 rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[50px]" />

              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-red-500/20">
                <FiAlertTriangle />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Delete User?</h3>

              <p className="text-gray-400 mb-6 text-sm break-words">
                Are you sure you want to remove{" "}
                <span className="text-white font-semibold">{userToDelete?.name}</span>{" "}
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
    </AdminPageShell>
  );
};

export default AdminUsers;