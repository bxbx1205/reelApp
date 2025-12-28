import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import User from "@/models/User";
import Link from "next/link";
import { AdminVideoList } from "./AdminVideoList";

async function getStats() {
  await connectToDatabase();
  const [videoCount, userCount] = await Promise.all([
    Video.countDocuments(),
    User.countDocuments(),
  ]);
  return { videoCount, userCount };
}

async function getVideos() {
  await connectToDatabase();
  const videos = await Video.find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return JSON.parse(JSON.stringify(videos));
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (!session || session.user.role !== "admin") {
    redirect("/feed");
  }

  const [stats, videos] = await Promise.all([getStats(), getVideos()]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-[var(--background)]/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/feed" className="flex items-center">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Clip</span>
              <span className="text-amber-200">Verse</span>
            </span>
          </Link>
          <span className="px-2 py-1 text-xs font-medium bg-[var(--admin)]/20 text-[var(--admin)] rounded-full">
            Admin Panel
          </span>
        </div>
        <Link
          href="/feed"
          className="text-sm text-[var(--foreground-muted)] hover:text-white transition-colors"
        >
          Back to Feed
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[var(--background-elevated)] border border-white/5">
            <p className="text-2xl font-semibold">{stats.videoCount}</p>
            <p className="text-sm text-[var(--foreground-muted)]">Total Videos</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--background-elevated)] border border-white/5">
            <p className="text-2xl font-semibold">{stats.userCount}</p>
            <p className="text-sm text-[var(--foreground-muted)]">Total Users</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--background-elevated)] border border-white/5">
            <p className="text-2xl font-semibold text-[var(--admin)]">Admin</p>
            <p className="text-sm text-[var(--foreground-muted)]">{session.user.email}</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--background-elevated)] border border-white/5">
            <p className="text-2xl font-semibold text-[var(--secondary)]">Active</p>
            <p className="text-sm text-[var(--foreground-muted)]">System Status</p>
          </div>
        </div>

        {/* Videos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Manage Videos</h2>
            <p className="text-sm text-[var(--foreground-muted)]">{videos.length} videos</p>
          </div>
          
          <AdminVideoList videos={videos} />
        </div>
      </div>
    </main>
  );
}
