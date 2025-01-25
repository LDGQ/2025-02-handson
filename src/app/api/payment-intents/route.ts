import Stripe from 'stripe';
import {NextResponse} from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
    const {amount, currency, customer} = await req.json();
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customer.id,
        description: "Order from PaymentIntents API",
        receipt_email: 't.susaki.eng@gmail.com'
    });

    return NextResponse.json(paymentIntent);
}
