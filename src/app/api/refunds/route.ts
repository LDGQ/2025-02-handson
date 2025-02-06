import Stripe from 'stripe';
import {NextResponse} from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
    const {chargeId} = await req.json();

    const charge = await stripe.charges.retrieve(chargeId);

    const refunds = await stripe.refunds.create({
        charge: chargeId,
        amount: charge.amount * 0.8, // 80% 返金
        reason: 'requested_by_customer'
    });

    return NextResponse.json(refunds);
}
