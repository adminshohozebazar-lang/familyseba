import { v2 as cloudinary } from "cloudinary";

// Server-only Cloudinary config (API secret must never reach the browser).
// Used exclusively to generate signed upload signatures — see
// src/app/api/admin/cloudinary-signature/route.ts.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
