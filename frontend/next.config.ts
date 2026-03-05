import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    // CI/배포 환경에서 ESLint 설정/의존성이 없는 경우에도 빌드가 막히지 않도록 합니다.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
