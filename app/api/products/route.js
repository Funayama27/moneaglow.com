import { NextResponse } from "next/server";
import { getProducts } from "../../../lib/productProviders";

export async function GET() {
  const products = await getProducts();

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    products,
  });
}
