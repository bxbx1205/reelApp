"use client";

import { useEffect, useRef, useCallback } from "react";
import { Ivideo } from "@/models/Video";

const PRELOAD_COUNT = 2;

export function usePreloadVideos(videos: Ivideo[], currentIndex: number) {
  const preloadedUrls = useRef<Set<string>>(new Set());
  const linkElements = useRef<Map<string, HTMLLinkElement>>(new Map());

  const preloadVideo = useCallback((url: string) => {
    if (preloadedUrls.current.has(url)) return;
    if (typeof window === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = url;
    document.head.appendChild(link);

    preloadedUrls.current.add(url);
    linkElements.current.set(url, link);
  }, []);

  const cleanupPreload = useCallback((url: string) => {
    const link = linkElements.current.get(url);
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
    linkElements.current.delete(url);
    preloadedUrls.current.delete(url);
  }, []);

  useEffect(() => {
    if (!videos.length) return;

    const urlsToPreload = new Set<string>();
    
    for (let i = 0; i <= PRELOAD_COUNT; i++) {
      const index = currentIndex + i;
      if (index < videos.length) {
        urlsToPreload.add(videos[index].videoUrl);
      }
    }

    if (currentIndex > 0) {
      urlsToPreload.add(videos[currentIndex - 1].videoUrl);
    }

    urlsToPreload.forEach(preloadVideo);

    preloadedUrls.current.forEach((url) => {
      if (!urlsToPreload.has(url)) {
        cleanupPreload(url);
      }
    });
  }, [videos, currentIndex, preloadVideo, cleanupPreload]);

  useEffect(() => {
    return () => {
      linkElements.current.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
      linkElements.current.clear();
      preloadedUrls.current.clear();
    };
  }, []);
}
