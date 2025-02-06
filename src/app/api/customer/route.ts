import Stripe from 'stripe';
import {NextResponse} from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
    const {name, userId} = await req.json();
    const customer = await stripe.customers.create({
        name: name,
        metadata: { userId }
    });

    return NextResponse.json(customer);
}

export async function GET(req: Request) {
    const userId = req.headers.get('userId') || '';
    if(userId === '') {
        NextResponse.json(undefined);
    }
    const response = (await stripe.customers.search({
        query: `metadata[\'userId\']:\'${userId}\'`,
    }));

    const customer = response?.data ? response.data[0] : {};
    return NextResponse.json({customer});
}
