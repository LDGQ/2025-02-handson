import Stripe from 'stripe';
import {NextResponse} from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
    const {amount, currency, customer, metadata} = await req.json();
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customer.id,
        description: "Order from PaymentIntents API",
        metadata: metadata
    });

    return NextResponse.json(paymentIntent);
}
