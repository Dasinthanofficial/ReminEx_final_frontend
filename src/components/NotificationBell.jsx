// frontend/src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiBell, FiClock } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import api from "../services/api";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);     // 🟢 holds bell + popup
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get("/user/notifications"),
    staleTime: 60 * 1000,
  });

  const markReadMutation = useMutation({
    mutationFn: (ids) => api.post("/user/notifications/read", { ids }),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      // When opening, mark all unread as read (once)
      if (
        next &&
        unreadCount > 0 &&
        !markReadMutation.isPending
      ) {
        const unreadIds = notifications
          .filter((n) => !n.read)
          .map((n) => n._id);
        if (unreadIds.length) {
          markReadMutation.mutate(unreadIds);
        }
      }
      return next;
    });
  };

  // 🟢 Close when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors"
        aria-label="Notifications"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-hidden rounded-2xl bg-[#122017]/95 border border-white/10 shadow-2xl backdrop-blur-xl z-50">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Notifications
            </span>
            {isLoading && (
              <span className="text-[10px] text-gray-500">Loading…</span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className={`px-4 py-3 border-b border-white/5 flex gap-3 items-start ${
                    !n.read ? "bg-white/5" : ""
                  }`}
                >
                  <div className="mt-1 text-[#38E07B]">
                    <FiClock />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38E07B] mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;