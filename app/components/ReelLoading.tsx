"use client";

import { memo } from "react";

function ReelLoadingComponent() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-white/20 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-white/70 rounded-full animate-spin" />
      </div>
    </div>
  );
}

export const ReelLoading = memo(ReelLoadingComponent);
