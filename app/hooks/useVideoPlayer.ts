"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface UseVideoPlayerOptions {
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onEnded?: () => void;
}

interface VideoState {
  isPlaying: boolean;
  isMuted: boolean;
  isLoading: boolean;
  hasError: boolean;
  progress: number;
  duration: number;
  currentTime: number;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const { autoPlay = true, loop = true, muted = true, onEnded } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<VideoState>({
    isPlaying: false,
    isMuted: muted,
    isLoading: true,
    hasError: false,
    progress: 0,
    duration: 0,
    currentTime: 0,
  });

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    } catch (err) {
      if (video.muted === false) {
        video.muted = true;
        setState((prev) => ({ ...prev, isMuted: true }));
        try {
          await video.play();
          setState((prev) => ({ ...prev, isPlaying: true }));
        } catch {
          console.warn("Video autoplay blocked");
        }
      }
    }
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setState((prev) => ({ ...prev, isMuted: video.muted }));
  }, []);

  const seek = useCallback((position: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    video.currentTime = position * video.duration;
  }, []);

  const reset = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setState((prev) => ({ ...prev, progress: 0, currentTime: 0 }));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setState((prev) => ({ ...prev, isLoading: true, hasError: false }));
    };

    const handleCanPlay = () => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        duration: video.duration,
      }));
      if (autoPlay) {
        play();
      }
    };

    const handleTimeUpdate = () => {
      const progress = video.duration ? video.currentTime / video.duration : 0;
      setState((prev) => ({
        ...prev,
        progress,
        currentTime: video.currentTime,
      }));
    };

    const handleEnded = () => {
      if (loop) {
        video.currentTime = 0;
        play();
      } else {
        setState((prev) => ({ ...prev, isPlaying: false }));
        onEnded?.();
      }
    };

    const handleError = () => {
      setState((prev) => ({ ...prev, hasError: true, isLoading: false }));
    };

    const handleWaiting = () => {
      setState((prev) => ({ ...prev, isLoading: true }));
    };

    const handlePlaying = () => {
      setState((prev) => ({ ...prev, isLoading: false, isPlaying: true }));
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [autoPlay, loop, play, onEnded]);

  return {
    videoRef,
    state,
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
    reset,
  };
}
