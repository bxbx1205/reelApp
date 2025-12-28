"use client";

import { memo, useState } from "react";
import { Ivideo } from "@/models/Video";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Ivideo;
}

function ShareModalComponent({ isOpen, onClose, video }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/reel/${video._id}` 
    : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div 
        className="relative w-full max-w-lg bg-[var(--background-elevated)] rounded-t-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-white/30 rounded-full" />
        </div>

        <div className="text-center pb-4 border-b border-white/10">
          <h2 className="text-white font-semibold">Share</h2>
        </div>

        <div className="p-6">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white font-medium">{copied ? "Copied!" : "Copy link"}</p>
              <p className="text-white/50 text-sm truncate">{shareUrl}</p>
            </div>
            {copied && (
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        <div className="px-6 pb-6 safe-area-bottom">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export const ShareModal = memo(ShareModalComponent);
