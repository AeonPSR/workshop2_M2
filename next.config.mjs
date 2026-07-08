/** @type {import('next').NextConfig} */
const odooHost = process.env.NEXT_PUBLIC_ODOO_URL
  ? new URL(process.env.NEXT_PUBLIC_ODOO_URL).hostname
  : undefined;

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(odooHost ? [{ protocol: "https", hostname: odooHost }] : []),
    ],
  },
};

export default nextConfig;
