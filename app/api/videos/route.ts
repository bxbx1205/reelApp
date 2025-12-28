import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("_id title description videoUrl thumbnailUrl likes likedBy userEmail createdAt")
      .lean();

    const total = await Video.countDocuments();

    const response = NextResponse.json({
      videos,
      total,
      hasMore: skip + videos.length < total,
    });
    
    // Short cache for fresh content
    response.headers.set("Cache-Control", "public, s-maxage=10, stale-while-revalidate=30");
    
    return response;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { title, description, videoUrl, thumbnailUrl, transformation } = body;

    if (!title || !videoUrl || !thumbnailUrl) {
      return NextResponse.json(
        { error: "Title, videoUrl, and thumbnailUrl are required" },
        { status: 400 }
      );
    }

    const video = await Video.create({
      title,
      description: description || "",
      videoUrl,
      thumbnailUrl,
      transformation,
      userEmail: session.user.email,
    });

    revalidatePath("/feed");

    return NextResponse.json({ video }, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create video", details: errorMessage },
      { status: 500 }
    );
  }
}
