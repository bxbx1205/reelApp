"use client";

import { useState, useRef, useCallback, useEffect, memo } from "react";
import { useSession } from "next-auth/react";
import { Ivideo } from "@/models/Video";
import { Reel } from "./Reel";
import { usePreloadVideos } from "@/app/hooks";

interface ReelFeedProps {
  videos: Ivideo[];
  userEmail?: string;
}

interface LikeState {
  isLiked: boolean;
  count: number;
}

function ReelFeedComponent({ videos, userEmail }: ReelFeedProps) {
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likeStates, setLikeStates] = useState<Map<string, LikeState>>(() => {
    const initial = new Map<string, LikeState>();
    videos.forEach((video) => {
      const videoId = video._id?.toString() || "";
      initial.set(videoId, {
        isLiked: video.likedBy?.includes(userEmail || session?.user?.email || "") || false,
        count: video.likes || 0,
      });
    });
    return initial;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  usePreloadVideos(videos, currentIndex);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, videos.length]);

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    if (index < 0 || index >= videos.length) return;

    isScrolling.current = true;
    const itemHeight = containerRef.current.clientHeight;

    containerRef.current.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrolling.current = false;
      setCurrentIndex(index);
    }, 300);
  }, [videos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, scrollToIndex]);

  const handleLike = useCallback(async (videoId: string) => {
    if (!session?.user?.email) {
      return;
    }

    setLikeStates((prev) => {
      const current = prev.get(videoId) || { isLiked: false, count: 0 };
      const newMap = new Map(prev);
      newMap.set(videoId, {
        isLiked: !current.isLiked,
        count: current.isLiked ? current.count - 1 : current.count + 1,
      });
      return newMap;
    });

    try {
      const res = await fetch(`/api/videos/${videoId}/like`, {
        method: "POST",
      });
      
      if (res.ok) {
        const data = await res.json();
        setLikeStates((prev) => {
          const newMap = new Map(prev);
          newMap.set(videoId, {
            isLiked: data.isLiked,
            count: data.likes,
          });
          return newMap;
        });
      }
    } catch (error) {
      console.error("Like error:", error);
    }
  }, [session]);

  if (!videos.length) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--background)]">
        <div className="text-center px-8">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-[var(--foreground-subtle)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[var(--foreground-muted)] text-base">
            No videos yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-scroll snap-container hide-scrollbar"
      onScroll={handleScroll}
    >
      {videos.map((video, index) => {
        const distance = Math.abs(index - currentIndex);
        if (distance > 2) {
          return (
            <div
              key={video._id?.toString() || index}
              className="w-full h-full bg-[var(--background)] snap-item"
            />
          );
        }

        const videoId = video._id?.toString() || "";
        const likeState = likeStates.get(videoId) || { isLiked: false, count: 0 };

        return (
          <div
            key={video._id?.toString() || index}
            className="w-full h-full snap-item"
          >
            <Reel
              video={video}
              isActive={index === currentIndex}
              isLiked={likeState.isLiked}
              likeCount={likeState.count}
              onLike={() => handleLike(videoId)}
            />
          </div>
        );
      })}
    </div>
  );
}

export const ReelFeed = memo(ReelFeedComponent);
