import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  

  // imagekit.io : 외부 이미지 사용 옵션적용 : (next는 외부 이미지 사용을 지원하지 않음)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // 최대 10MB까지 허용?? -> 
    },
  },


};

export default nextConfig;
