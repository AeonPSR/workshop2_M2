/** @type {import('next').NextConfig} */
const odooUrl = process.env.ODOO_URL || process.env.NEXT_PUBLIC_ODOO_URL;
const odooHost = odooUrl ? new URL(odooUrl).hostname : undefined;

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...(odooHost ? [{ protocol: "https", hostname: odooHost }] : []),
    ],
  },
};

export default nextConfig;
