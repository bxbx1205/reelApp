// File: app/api/imagekit-auth/route.ts
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
        const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

        if (!publicKey || !privateKey || !urlEndpoint) {
            console.error("Missing ImageKit credentials:", { 
                publicKey: !!publicKey, 
                privateKey: !!privateKey, 
                urlEndpoint: !!urlEndpoint 
            });
            return NextResponse.json(
                { error: "ImageKit credentials not configured" },
                { status: 500 }
            );
        }

        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint,
        });

        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error("ImageKit auth error:", error);
        return NextResponse.json(
            { error: "ImageKit Auth Failed" },
            { status: 500 }
        );
    }
}