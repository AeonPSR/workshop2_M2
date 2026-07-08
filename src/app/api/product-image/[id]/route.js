import { NextResponse } from "next/server";
import { getConnectedOdooClient } from "@/lib/api/odoo-client";

// Proxy authenticated Odoo product images so the browser can display them
// without needing direct Odoo credentials.
// Usage: /api/product-image/[id]
export async function GET(request, { params }) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (!Number.isFinite(productId) || productId <= 0) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const odoo = await getConnectedOdooClient();
    const [product] = await odoo.execute_kw("product.template", "read", [
      [productId],
      ["image_512"],
    ]);

    if (!product?.image_512) {
      return new NextResponse(null, { status: 404 });
    }

    const buffer = Buffer.from(product.image_512, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
