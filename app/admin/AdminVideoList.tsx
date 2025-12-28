"use client";

import { useState } from "react";
import { Ivideo } from "@/models/Video";

interface AdminVideoListProps {
  videos: Ivideo[];
}

export function AdminVideoList({ videos: initialVideos }: AdminVideoListProps) {
  const [videos, setVideos] = useState(initialVideos);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    
    setDeletingId(videoId);
    try {
      const res = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setVideos(videos.filter((v) => v._id?.toString() !== videoId));
      } else {
        alert("Failed to delete video");
      }
    } catch (error) {
      alert("Error deleting video");
    } finally {
      setDeletingId(null);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--foreground-muted)]">
        No videos uploaded yet
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {videos.map((video) => (
        <div
          key={video._id?.toString()}
          className="flex items-center gap-4 p-4 rounded-xl bg-[var(--background-elevated)] border border-white/5"
        >
          {/* Thumbnail */}
          <div className="w-20 h-28 rounded-lg bg-[var(--background-subtle)] overflow-hidden flex-shrink-0">
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--foreground-subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{video.title}</h3>
            {video.description && (
              <p className="text-sm text-[var(--foreground-muted)] truncate mt-1">
                {video.description}
              </p>
            )}
            <p className="text-xs text-[var(--foreground-subtle)] mt-2">
              ID: {video._id?.toString()}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[var(--background-subtle)] text-[var(--foreground-muted)] hover:text-white hover:bg-white/10 transition-colors"
              title="View video"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={() => handleDelete(video._id?.toString() || "")}
              disabled={deletingId === video._id?.toString()}
              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
              title="Delete video"
            >
              {deletingId === video._id?.toString() ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
