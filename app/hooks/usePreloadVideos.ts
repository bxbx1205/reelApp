"use client";

import { useEffect, useRef, useCallback } from "react";
import { Ivideo } from "@/models/Video";

// Reduced to 1 to save processing units - only preload next video
const PRELOAD_COUNT = 1;

export function usePreloadVideos(videos: Ivideo[], currentIndex: number) {
  const preloadedUrls = useRef<Set<string>>(new Set());

  const preloadVideo = useCallback((url: string) => {
    if (preloadedUrls.current.has(url)) return;
    if (typeof window === "undefined") return;
    
    // Use prefetch hint instead of preload - lighter on bandwidth
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "video";
    link.href = url;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
    
    preloadedUrls.current.add(url);
    
    // Auto-cleanup after 30s to prevent memory buildup
    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
    }, 30000);
  }, []);

  useEffect(() => {
    if (!videos.length) return;
    
    // Only preload next video, not previous (saves tokens)
    const nextIndex = currentIndex + 1;
    if (nextIndex < videos.length) {
      preloadVideo(videos[nextIndex].videoUrl);
    }
  }, [videos, currentIndex, preloadVideo]);
}
