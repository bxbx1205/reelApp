import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const userEmail = session.user.email;
    const alreadyLiked = video.likedBy?.includes(userEmail);

    if (alreadyLiked) {
      // Unlike
      video.likedBy = video.likedBy.filter((email: string) => email !== userEmail);
      video.likes = Math.max(0, (video.likes || 0) - 1);
    } else {
      // Like
      if (!video.likedBy) video.likedBy = [];
      video.likedBy.push(userEmail);
      video.likes = (video.likes || 0) + 1;
    }

    await video.save();

    return NextResponse.json({
      likes: video.likes,
      isLiked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Failed to like video" }, { status: 500 });
  }
}
