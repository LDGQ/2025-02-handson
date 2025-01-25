import Stripe from 'stripe';
import {NextResponse} from "next/server";

interface Product {
    id: string;
    name: string;
    images: string[];
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function GET() {
    const products = await stripe.products.list();
    const productList = await Promise.all(
        products.data.map(async (product: Product) => {
            // 価格情報を取得
            const priceList = await stripe.prices.search({
                query: `active:'true' AND product:'${product.id}'`,
            });

            // 一回払い（one_time）の価格のみ取得
            const oneTimePrices = priceList.data.filter((price) => price.type === "one_time");

            // oneTimePricesが空(継続購入のみ)なら null を返し、最終的に除外
            if (oneTimePrices.length === 0) return null;

            return {
                id: product.id,
                name: product.name,
                images: product.images,
                prices: oneTimePrices.map((price) => ({
                    currency: price.currency,
                    unit_amount: price.unit_amount,
                    type: price.type,
                })),
            };
        })
    );

    // null を除外して返却
    return NextResponse.json(productList.filter(Boolean));
}