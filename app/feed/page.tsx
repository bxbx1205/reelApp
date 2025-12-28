import { ReelFeed, BottomNav } from "@/app/components";
import { connectToDatabase } from "@/lib/db";
import Video, { Ivideo } from "@/models/Video";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getVideos(): Promise<Ivideo[]> {
  try {
    await connectToDatabase();
    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .select("_id title description videoUrl thumbnailUrl likes likedBy userEmail createdAt")
      .lean();
    
    return JSON.parse(JSON.stringify(videos));
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
}

export default async function FeedPage() {
  const videos = await getVideos();

  return (
    <main className="w-full h-[100dvh] bg-[var(--background)] relative overflow-hidden">
      <ReelFeed videos={videos} />
      <BottomNav />
    </main>
  );
}
