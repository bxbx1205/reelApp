"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BottomNav } from "@/app/components";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      setError("Please select a video file");
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setError("File size must be less than 100MB");
      return;
    }

    setFile(selectedFile);
    setError("");

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    setError("");
    setUploadProgress(0);

    try {
      const authRes = await fetch("/api/imagekit-auth");
      const authData = await authRes.json();

      if (!authRes.ok) {
        throw new Error("Failed to get upload credentials");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", `reel_${Date.now()}_${file.name}`);
      formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire);
      formData.append("token", authData.token);

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Upload failed");
      }

      setUploadProgress(80);

      const videoUrl = uploadData.url;
      const thumbnailUrl = videoUrl.replace('/video/', '/video/ik-thumbnail.jpg?');

      const saveRes = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl: videoUrl,
          thumbnailUrl: thumbnailUrl,
          transformation: {
            width: 1080,
            height: 1920,
          },
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save video");
      }

      setUploadProgress(100);

      // Navigate and refresh to show new video immediately
      router.push("/feed");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="h-[100dvh] bg-[var(--background)] flex flex-col overflow-hidden">
      <nav className="flex-shrink-0 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <Link href="/feed" className="flex items-center">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Clip</span>
            <span className="text-amber-200">Verse</span>
          </span>
        </Link>
        <Link
          href="/feed"
          className="text-sm text-[var(--foreground-muted)] hover:text-white transition-colors"
        >
          Cancel
        </Link>
      </nav>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="w-full max-w-lg mx-auto px-6 py-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Upload video</h1>
            <p className="text-sm text-[var(--foreground-muted)]">
              Share a short video with the community
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-white/10 rounded-2xl p-12 text-center cursor-pointer hover:border-white/20 transition-colors duration-150"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[var(--background-elevated)] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[var(--foreground-subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium">Click to upload</p>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">MP4, MOV, WebM up to 100MB</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-[var(--background-elevated)]">
                <video
                  src={preview || undefined}
                  className="w-full aspect-square object-cover bg-black"
                  controls
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-[var(--foreground-muted)]">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={100}
                className="w-full px-4 py-3 rounded-lg bg-[var(--background-elevated)] border border-white/10 text-white placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-white/25 transition-colors duration-150"
                placeholder="Give your video a title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground-muted)]">
                Description <span className="text-[var(--foreground-subtle)]">(optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 rounded-lg bg-[var(--background-elevated)] border border-white/10 text-white placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-white/25 transition-colors duration-150 resize-none"
                placeholder="Add a description..."
              />
            </div>

            <button
              type="submit"
              disabled={!file || !title || isUploading}
              className="w-full px-4 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 btn-tactile"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading... {uploadProgress}%
                </span>
              ) : (
                "Upload video"
              )}
            </button>
          </form>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
