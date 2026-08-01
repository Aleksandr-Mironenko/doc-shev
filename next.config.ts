import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
            },
        ],
    },

    // 👇 Добавляем разрешённый origin
    allowedDevOrigins: ['172.18.0.1'],
}

export default nextConfig
