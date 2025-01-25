'use client';

import React, {Dispatch, SetStateAction} from "react";
import Image from "next/image";
import {Customer} from "@/app/interface/customer";
import {Product} from "@/app/interface/product";
import {Cart} from "@/app/interface/cart";
import { useCart } from "@/app/context/CartContext";

interface ProductListProps {
    customer: Customer;
    products: Product[];
    setClientSecret: Dispatch<SetStateAction<string>>;
}

const ProductList: React.FC<ProductListProps> = ({ customer, products, setClientSecret }) => {
    const {cart, setCart} = useCart();

    // 商品追加
    const handleCartAdd = (product: Product, count: number) => {
        const newCart = new Cart();
        Object.assign(newCart, cart); // 現在の状態をコピー
        newCart.add(product, count); // 商品を追加

        // 新しいインスタンスを状態として設定
        setCart(newCart);
    };


    // 商品購入
    const handlePurchase = () => {
        if (cart.totalAmount()) {
            createPaymentIntent(cart.totalAmount(), 'jpy').then();
        }
    };

    // 支払い情報を作成
    const createPaymentIntent = async (amount: number, currency: string) => {
        try {
            const response = await fetch('/api/payment-intents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency, customer }),
            });
            console.log(response);
            const result = await response.json();
            setClientSecret(result.client_secret);
        } catch (error) {
            console.error('Error creating payment intent:', error);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 gap-2">
            <table className="border border-gray-300">
                <thead>
                <tr className="bg-gray-100 font-bold">
                    <th className="px-4 py-2">商品名</th>
                    <th className="px-4 py-2">画像</th>
                    <th className="px-4 py-2">値段</th>
                    <th className="px-4 py-2">数量</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td className="px-4 py-2">{product.name}</td>
                        <td className="px-4 py-2">
                            {product.images.length > 0 && (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={64}
                                    height={64}
                                />
                            )}
                        </td>
                        <td className="px-4 py-2">
                            {product.prices[0].unit_amount.toLocaleString()}円
                        </td>
                        <td className="px-4 py-2">
                            <select
                                value={cart.getCount(product)}
                                onChange={(e) => handleCartAdd(product, Number(e.target.value))}
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                {/* リストを動的に生成 */}
                                {Array.from({length: 5}, (_, i) => i).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700 text-sm">商品の小計：</span>
                    <span className="text-gray-900 text-sm font-medium">{cart.totalAmount()}円</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700 text-sm">配送料・手数料：</span>
                    <span className="text-gray-900 text-sm font-medium">0円</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-gray-700 text-lg font-semibold">ご請求額：</span>
                    <span className="text-gray-900 text-lg font-bold">{cart.totalAmount()}円</span>
                </div>
            </div>

            <div className="px-4 py-2">
                <button
                    onClick={() => handlePurchase()}
                    disabled={customer == null || cart.totalAmount() == 0}
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
}

export default ProductList;