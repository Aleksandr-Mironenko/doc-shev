import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.relaxdev.ru',
            },
        ],
    },
    devIndicators: false,

    allowedDevOrigins: ['172.18.0.1'],
}

export default nextConfig
