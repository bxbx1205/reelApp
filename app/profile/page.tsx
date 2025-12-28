"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BottomNav } from "@/app/components";
import { Ivideo } from "@/models/Video";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [videos, setVideos] = useState<Ivideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchVideos();
    }
  }, [session]);

  const fetchVideos = () => {
    fetch("/api/videos/user")
      .then(res => res.json())
      .then(data => {
        setVideos(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    
    setDeletingId(videoId);
    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setVideos(videos.filter(v => v._id?.toString() !== videoId));
      } else {
        alert("Failed to delete video");
      }
    } catch (error) {
      alert("Failed to delete video");
    }
    setDeletingId(null);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const isAdmin = session.user?.role === "admin";

  return (
    <main className="h-[100dvh] bg-[var(--background)] flex flex-col overflow-hidden">
      <header className="flex-shrink-0 bg-[var(--background)] border-b border-white/10">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-lg font-semibold text-white">Profile</h1>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link 
                href="/admin"
                className="text-[var(--admin)] text-sm font-medium"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-400 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[var(--background-elevated)] flex items-center justify-center">
              <span className="text-2xl text-white/70">
                {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">
              {session.user?.name || "User"}
            </h2>
            <p className="text-white/50 text-sm">{session.user?.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[var(--admin)]/20 text-[var(--admin)] text-xs rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                Admin
              </span>
            )}
          </div>
        </div>
        </div>

        <div className="py-4 border-y border-white/10">
          <div className="text-center">
            <p className="text-xl font-semibold text-white">{videos.length}</p>
            <p className="text-white/50 text-xs">Videos</p>
          </div>
        </div>

        <div className="mt-4 px-1">
          <h3 className="text-white font-medium mb-3 px-3">My Videos</h3>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-3 gap-0.5">
              {videos.map((video) => (
                <div key={video._id?.toString()} className="relative aspect-square bg-[var(--background-elevated)] overflow-hidden group">
                  <video
                    src={video.videoUrl + "#t=0.1"}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <button
                    onClick={() => handleDelete(video._id?.toString() || "")}
                    disabled={deletingId === video._id?.toString()}
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-500/80 transition-all"
                  >
                    {deletingId === video._id?.toString() ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                  <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {video.likes || 0}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-white/50 text-sm">No videos yet</p>
              <Link href="/upload" className="inline-block mt-3 px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-lg">
                Upload your first video
              </Link>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
