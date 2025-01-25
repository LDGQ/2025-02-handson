"use client";

import React, {useMemo, useState} from "react";
import Payment from "@/app/component/payment/page";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {useAuth} from "@/app/context/AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Home() {
    const { customer } = useAuth();
    const [clientSecret, setClientSecret] = useState('');   // 支払い情報

    /** 商品を作成 **/
    const products = [{
            name: 'test',
            currency: 'jpy',
            amount: 100
        }];

    // 商品購入
    const handlePurchase = () => {
        createPaymentIntent(products[0].amount, products[0].currency, {}).then();
    };

    // 支払い情報を作成
    const createPaymentIntent = async (amount: number, currency: string, metadata: object) => {
        try {
            const response = await fetch('/api/payment-intents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency, customer, metadata }),
            });
            const result = await response.json();
            setClientSecret(result.client_secret);
        } catch (error) {
            console.error('Error creating payment intent:', error);
        }
    };

    const pageContent = useMemo(() => {
        // 支払い方法を定義
        const paymentOptions = {
            clientSecret,
        };

        // 支払い画面
        if (clientSecret) {
            return (
                <Elements stripe={stripePromise} options={paymentOptions}>
                    <Payment customerId={customer!.id} setClientSecret={setClientSecret} products={products} />
                </Elements>
            );
        }

        return (
            <div className="flex flex-col items-center p-4 gap-2">
                <div className="px-4 py-2">
                    <button
                        onClick={() => handlePurchase()}
                        className="
                        bg-blue-500 text-white font-semibold px-6 py-2 rounded shadow
                        hover:bg-blue-600 focus:outline-none focus:ring-2
                        focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out
                        disabled:bg-gray-300 disabled:cursor-not-allowed
                    "
                    >
                        購入
                    </button>
                </div>
            </div>
        );

    }, [clientSecret, customer]);

    return (
        <div>
            {pageContent}
        </div>
    );
}
