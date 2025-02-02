import Stripe from 'stripe';
import {NextResponse} from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId') || '';

    const charges = await stripe.charges.list({ customer: customerId });

    return NextResponse.json({charges});
}
