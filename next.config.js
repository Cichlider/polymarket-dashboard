/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'polymarket.com',
      },
      {
        protocol: 'https',
        hostname: 'polymarket-upload.s3.us-east-2.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/markets',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
