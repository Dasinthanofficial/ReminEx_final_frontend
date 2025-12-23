import React from "react";

export default function AdminPageShell({ children, className = "" }) {
  return (
    <div className={`w-full min-w-0 max-w-7xl mx-auto overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
}