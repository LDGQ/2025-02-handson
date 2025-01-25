"use client";

import React, {useEffect, useMemo, useState} from "react";
import {Product} from "@/app/interface/product";
import Payment from "@/app/component/payment/page";
import {Elements} from "@stripe/react-stripe-js";
import ProductList from "@/app/component/product_list/page";
import Loading from '@/app/component/loading/page';
import {loadStripe} from "@stripe/stripe-js";
import {useAuth} from "@/app/context/AuthContext";
import Popup from "@/app/component/context/Popup";
import {PopupProvider} from "@/app/context/PopupContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Home() {
    const { customer } = useAuth();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);    // 商品一覧
    const [clientSecret, setClientSecret] = useState('');   // 支払い情報

    useEffect(() => {
        // 商品一覧を取得
        fetch('/api/product-list', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(async (response) => {
            const result = await response.json();
            setProducts(result);
            setLoading(false);
        });
    }, []);

    const pageContent = useMemo(() => {
        // 支払い方法を定義
        const paymentOptions = {
            clientSecret,
        };

        // ローディング画面
        if (loading) return <Loading />;

        // 支払い画面
        if (clientSecret) {
            return (
                <Elements stripe={stripePromise} options={paymentOptions}>
                    <Payment customerId={customer!.id} setClientSecret={setClientSecret} />
                </Elements>
            );
        }

        // 商品一覧画面
        return <ProductList customer={customer!} products={products} setClientSecret={setClientSecret} />;
    }, [loading, clientSecret, customer, products]);

    return (
        <PopupProvider>
            <Popup />
            {pageContent}
        </PopupProvider>
    );
}
