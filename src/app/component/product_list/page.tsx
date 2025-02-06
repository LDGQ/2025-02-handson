'use client';

import React, {Dispatch, SetStateAction} from "react";
import Image from "next/image";
import {Customer} from "@/app/interface/customer";
import {Product} from "@/app/interface/product";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

interface ProductListProps {
    customer: Customer;
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ customer, products }) => {
    const {cart, addCart, parchaseCart} = useCart();
    const { setClientSecret } = useAuth()
    const purchase = (product: Product) => {
        fetch('/api/payment-intents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: product.prices[0].unit_amount,
                currency: product.prices[0].currency,
                customer,
                metadata: { [product.id]: JSON.stringify({ price: product.prices[0].unit_amount, count: 1 }) },
            }),
        })
        .then(async (response) => {
            const result = await response.json();
            setClientSecret(result.client_secret);
        });
    };

    // 商品追加
    const handleCartAdd = (product: Product, count: number) => {
        addCart(product, count);
    };

    // 商品購入
    const handlePurchase = (product: Product) => {
        purchase(product);
    };
    // Step7
    // const handlePurchase = () => {
    //     parchaseCart(customer);
    // };

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
                            <button
                                onClick={() => handlePurchase(product)}
                                className="
                                    bg-blue-500 text-white font-semibold px-6 py-2 rounded shadow
                                    hover:bg-blue-600 focus:outline-none focus:ring-2
                                    focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out
                                "
                            >
                                購入
                            </button>
                        </td>
                        {/* Step7 */}
                        {/* <td className="px-4 py-2">
                            <select
                                value={cart.getCount(product)}
                                onChange={(e) => handleCartAdd(product, Number(e.target.value))}
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                {Array.from({length: 5}, (_, i) => i).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </td> */}
                    </tr>
                ))}
                </tbody>
            </table>
            {/* Step7 */}
            {/* <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
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
                    onClick={handlePurchase}
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
            </div> */}
        </div>
    );
}

export default ProductList;