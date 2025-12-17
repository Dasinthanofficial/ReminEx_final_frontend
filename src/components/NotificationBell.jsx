// frontend/src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiBell, FiClock } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // per-user, per-day key
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const storageKey = `notifSeen:${user?.id || "anon"}:${todayKey}`;

  // Load "seen" state on mount
  useEffect(() => {
    if (localStorage.getItem(storageKey) === "1") {
      setSeen(true);
    }
  }, [storageKey]);

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get("/user/notifications"),
    staleTime: 60 * 1000,
  });

  const notifications = data?.notifications || [];
  const count = data?.count || 0;

  // Extract summary + other notifications
  const summaryNotification = useMemo(
    () => notifications.find((n) => n.type === "summary"),
    [notifications]
  );

  const expiryNotifications = useMemo(
    () => notifications.filter((n) => n.type !== "summary"),
    [notifications]
  );

  // Group by severity
  const todayNotifs = expiryNotifications.filter((n) => n.diffDays === 0);
  const soonNotifs = expiryNotifications.filter(
    (n) => n.diffDays > 0 && n.diffDays <= 3
  );
  const weekNotifs = expiryNotifications.filter((n) => n.diffDays > 3);

  // Determine overall severity for badge color
  const minDiff = expiryNotifications.length
    ? Math.min(...expiryNotifications.map((n) => n.diffDays))
    : null;

  let badgeColor = "bg-yellow-500";
  if (minDiff === 0) badgeColor = "bg-red-500";
  else if (minDiff !== null && minDiff <= 3) badgeColor = "bg-orange-500";

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next && !seen) {
        setSeen(true);
        try {
          localStorage.setItem(storageKey, "1");
        } catch {
          // ignore storage error
        }
      }
      return next;
    });
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleNotificationClick = (notif) => {
    // Navigate to Products page; you can later use notif.productId to highlight
    navigate("/products");
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={toggleOpen}
        className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 transition-colors"
        aria-label="Notifications"
      >
        <FiBell className="text-xl" />
        {/* Show badge only if there are notifications and user hasn't opened the bell today */}
        {!seen && count > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full ${badgeColor} text-[10px] font-bold text-white flex items-center justify-center px-1`}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-hidden rounded-2xl bg-[#122017]/95 border border-white/10 shadow-2xl backdrop-blur-xl z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Notifications
            </span>
            {isLoading && (
              <span className="text-[10px] text-gray-500">Loading…</span>
            )}
          </div>

          {/* Body */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No upcoming expiries.
              </div>
            ) : (
              <div className="py-2">
                {/* Summary at top if exists */}
                {summaryNotification && (
                  <div className="px-4 pb-3 border-b border-white/10">
                    <p className="text-xs font-bold text-white">
                      {summaryNotification.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {summaryNotification.message}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {formatDistanceToNow(
                        new Date(summaryNotification.createdAt),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                )}

                {/* Today */}
                {todayNotifs.length > 0 && (
                  <div className="pt-2">
                    <p className="px-4 text-[10px] uppercase text-red-400 font-bold tracking-wider mb-1">
                      Today
                    </p>
                    {todayNotifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className="cursor-pointer px-4 py-2 border-b border-white/5 flex gap-3 items-start hover:bg-white/10"
                      >
                        <div className="mt-1 text-red-400">
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
                            {formatDistanceToNow(new Date(n.expiryDate), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Next 3 days */}
                {soonNotifs.length > 0 && (
                  <div className="pt-2">
                    <p className="px-4 text-[10px] uppercase text-orange-300 font-bold tracking-wider mb-1">
                      Next 3 days
                    </p>
                    {soonNotifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className="cursor-pointer px-4 py-2 border-b border-white/5 flex gap-3 items-start hover:bg-white/10"
                      >
                        <div className="mt-1 text-orange-300">
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
                            {formatDistanceToNow(new Date(n.expiryDate), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Later this week */}
                {weekNotifs.length > 0 && (
                  <div className="pt-2">
                    <p className="px-4 text-[10px] uppercase text-yellow-300 font-bold tracking-wider mb-1">
                      Later this week
                    </p>
                    {weekNotifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className="cursor-pointer px-4 py-2 border-b border-white/5 flex gap-3 items-start hover:bg-white/10"
                      >
                        <div className="mt-1 text-yellow-300">
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
                            {formatDistanceToNow(new Date(n.expiryDate), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;