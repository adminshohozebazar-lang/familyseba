import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

const UPLOAD_FOLDER = "family-seba/products";

// Generates a short-lived signature for a direct browser -> Cloudinary
// upload. Signed (not unsigned-preset) uploads keep the API secret on the
// server while still letting the browser upload the file directly, without
// routing image bytes through our own server.
//
// Also checked here explicitly (not just relying on middleware) since this
// is a security-sensitive endpoint — never trust a single protection layer.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { timestamp, folder: UPLOAD_FOLDER };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder: UPLOAD_FOLDER,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
