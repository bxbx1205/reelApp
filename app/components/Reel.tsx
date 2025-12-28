"use client";

import { memo, useEffect, useRef, useCallback } from "react";
import { Ivideo } from "@/models/Video";
import { useVideoPlayer, useIntersectionObserver } from "@/app/hooks";
import { ReelOverlay } from "./ReelOverlay";
import { ReelLoading } from "./ReelLoading";

interface ReelProps {
  video: Ivideo;
  isActive: boolean;
  onLike?: () => void;
  isLiked?: boolean;
  likeCount?: number;
}

function ReelComponent({ video, isActive, onLike, isLiked = false, likeCount = 0 }: ReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [intersectionRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.6,
  });

  const {
    videoRef,
    state,
    play,
    pause,
    togglePlay,
    toggleMute,
  } = useVideoPlayer({
    autoPlay: false,
    loop: true,
    muted: true,
  });

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      (intersectionRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [intersectionRef]
  );

  useEffect(() => {
    if (isActive && isVisible) {
      play();
    } else {
      pause();
    }
  }, [isActive, isVisible, play, pause]);

  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Ignore if tapping on controls
      const target = e.target as HTMLElement;
      if (target.closest("[data-controls]")) return;
      togglePlay();
    },
    [togglePlay]
  );

  const lastTap = useRef<number>(0);
  const handleDoubleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;
      
      if (now - lastTap.current < DOUBLE_TAP_DELAY) {
        onLike?.();
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      }
      lastTap.current = now;
    },
    [onLike]
  );

  return (
    <div
      ref={setRefs}
      className="relative w-full h-full bg-black snap-item flex items-center justify-center"
      onClick={(e) => {
        handleTap(e);
        handleDoubleTap(e);
      }}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover sm:object-contain sm:max-h-full sm:max-w-full"
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        playsInline
        muted={state.isMuted}
        loop
        preload="metadata"
      />

      {state.isLoading && <ReelLoading />}

      {state.hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]">
          <div className="text-center px-8">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-[var(--foreground-subtle)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-[var(--foreground-muted)] text-sm">
              Unable to load video
            </p>
          </div>
        </div>
      )}

      <ReelOverlay
        video={video}
        isPlaying={state.isPlaying}
        isMuted={state.isMuted}
        progress={state.progress}
        onToggleMute={toggleMute}
        onLike={onLike}
        isLiked={isLiked}
        likeCount={likeCount}
      />

      {!state.isPlaying && !state.isLoading && !state.hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-black/40 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export const Reel = memo(ReelComponent, (prev, next) => {
  return (
    prev.video._id === next.video._id &&
    prev.isActive === next.isActive &&
    prev.isLiked === next.isLiked &&
    prev.likeCount === next.likeCount
  );
});
