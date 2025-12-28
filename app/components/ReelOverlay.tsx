"use client";

import { memo, useState } from "react";
import { Ivideo } from "@/models/Video";
import { ShareModal } from "./ShareModal";

interface ReelOverlayProps {
  video: Ivideo;
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  onToggleMute: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  likeCount?: number;
}

function ReelOverlayComponent({
  video,
  isMuted,
  progress,
  onToggleMute,
  onLike,
  isLiked = false,
  likeCount = 0,
}: ReelOverlayProps) {
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="h-[2px] bg-white/20">
          <div
            className="h-full bg-white/70 transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-60 sm:h-80 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

      <div className="absolute bottom-16 sm:bottom-6 left-0 right-16 p-4 z-10">
        <h3 className="text-white text-sm sm:text-base font-medium leading-snug mb-1 text-video line-clamp-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed text-video line-clamp-2">
            {video.description}
          </p>
        )}
      </div>

      <div
        className="absolute right-2 sm:right-4 bottom-20 sm:bottom-20 flex flex-col items-center gap-4 sm:gap-5 z-10"
        data-controls
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike?.();
            if (navigator.vibrate) navigator.vibrate(10);
          }}
          className="btn-tactile flex flex-col items-center gap-1"
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-150 ${
              isLiked ? "bg-white/20" : "bg-black/40"
            }`}
          >
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-150 ${
                isLiked ? "text-red-500 scale-110" : "text-white"
              }`}
              fill={isLiked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="text-white text-xs text-video">{likeCount}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowShare(true);
          }}
          className="btn-tactile flex flex-col items-center gap-1"
          aria-label="Share"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 flex items-center justify-center">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="btn-tactile flex flex-col items-center gap-1"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 flex items-center justify-center">
            {isMuted ? (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            )}
          </div>
        </button>
      </div>

      <ShareModal 
        isOpen={showShare} 
        onClose={() => setShowShare(false)} 
        video={video} 
      />
    </>
  );
}

export const ReelOverlay = memo(ReelOverlayComponent);
