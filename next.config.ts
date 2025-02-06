import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
    images: {
        domains: ['files.stripe.com'], // 画像URLのドメインを追加
    },
};

export default nextConfig;
