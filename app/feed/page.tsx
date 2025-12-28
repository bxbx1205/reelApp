import { ReelFeed, BottomNav } from "@/app/components";
import { connectToDatabase } from "@/lib/db";
import Video, { Ivideo } from "@/models/Video";

async function getVideos(): Promise<Ivideo[]> {
  try {
    await connectToDatabase();
    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    
    // Serialize MongoDB documents
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
