import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';
import { getPriceDisplayData } from '@/lib/price-helpers';

// Google Shopping / Merchant Center product feed (RSS/XML format)
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://gunung.com';
  const products = await getProducts();
  const activeProducts = products.filter((p) => p.is_active);

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Gunung - Climbing Gear</title>
    <link>${baseUrl}</link>
    <description>Premium climbing gear for Malaysian peaks</description>
    ${activeProducts
      .map((product) => {
        const totalStock = product.sizes?.reduce((sum, s) => sum + s.stock, 0) ?? 0;
        const inStock = totalStock > 0 || !product.sizes?.length;

        const priceData = getPriceDisplayData(
          product.price,
          product.sale_price,
          product.sale_end_date
        );

        const regularPrice = (product.price / 100).toFixed(2);
        const currentPrice = (priceData.currentPrice / 100).toFixed(2);
        const salePriceTag = priceData.isOnSale
          ? `<g:sale_price>${currentPrice} ${product.currency.toUpperCase()}</g:sale_price>`
          : '';

        return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${baseUrl}/store/${product.id}</g:link>
      <g:image_link>${product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`}</g:image_link>
      <g:availability>${inStock ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${regularPrice} ${product.currency.toUpperCase()}</g:price>
      ${salePriceTag}
      <g:condition>new</g:condition>
      <g:brand>Gunung</g:brand>
      <g:product_type>Sporting Goods &gt; Outdoor Recreation &gt; Climbing</g:product_type>
      <g:google_product_category>499713</g:google_product_category>
    </item>`;
      })
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
