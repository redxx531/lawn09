/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_SECRET: 'secure_nextauth_secret_for_jwt_encryption',
    NEXTAUTH_URL: 'http://localhost:3000',
    PLATFORM_FEE_PERCENTAGE: 5,
  },
}

module.exports = nextConfig