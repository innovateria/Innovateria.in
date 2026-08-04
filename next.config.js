/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/seo_services',
        destination: '/seo-services',
        permanent: true,
      },
      {
        source: '/digital_marketing',
        destination: '/digital-marketing',
        permanent: true,
      },
      {
        source: '/ui_designing',
        destination: '/web',
        permanent: true,
      },
      {
        source: '/privacy_policy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/refund_policy',
        destination: '/refund-policy',
        permanent: true,
      },
      {
        source: '/android',
        destination: '/mobile',
        permanent: true,
      }
    ];
  },
}

module.exports = nextConfig
