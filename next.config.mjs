/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product images are uploaded to Cloudinary via the admin panel (Step 3).
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
