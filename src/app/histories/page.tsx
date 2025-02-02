'use client';

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useAuth} from "@/app/context/AuthContext";
import {Product} from "@/app/interface/product";
import Loading from '@/app/component/loading/page';

interface HistoriesProps {
    customerId: string;
    product: Product | null;
    setClientSecret: Dispatch<SetStateAction<string>>;
}

const Histories: React.FC<HistoriesProps> = () => {
    const { customer } = useAuth();
    const [loading, setLoading] = useState<boolean | null>(null);
    const [products, setProducts] = useState<Product[]>([]);    // 商品一覧
    const [charges, setCharges] = useState([]);

    useEffect(() => {
        const fetchHistories = async () => {
            if(customer === null) return;
            const response = await fetch(`/api/histories?customerId=${customer.id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            const result = await response.json();
            console.log({result: result.charges.data});
            setCharges(result.charges.data);
            setLoading(false);
        };
        fetchHistories().then();
    }, [customer]);

    // 商品一覧を取得
    useEffect(() => {
        try {
            fetch('/api/product-list', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            }).then(async(response) => {
                const result = await response.json();
                setProducts(result);
            })
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 返金処理
    const refundsByChargeId = async (chargeId: string) => {
        if(customer === null) return;
        if (confirm('返金処理を行います。80%のみ返金されますが、大丈夫ですか？')) {
            try {
                setLoading(true);
                // 返金処理を実行
                await fetch('/api/refunds', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({chargeId: chargeId}),
                });

                // 商品情報を再取得
                const response = await fetch(`/api/histories?customerId=${customer.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const result = await response.json();
                console.log({result: result.charges.data});
                setCharges(result.charges.data);
            } catch (error) {
                console.error('エラーが発生しました:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    const fetchProducts = (id: string) => {
        if(products.length === 0) return;
        return products.find((product) => product.id === id);
    }


    // ローディング画面
    if (loading) {
        return <Loading />;
    }

    if(customer === null) {
        return <div>ログインしてください</div>
    }

    return (
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
            <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">合計金額</th>
                <th className="border border-gray-300 px-4 py-2">状態</th>
                <th className="border border-gray-300 px-4 py-2">返金</th>
                <th className="border border-gray-300 px-4 py-2">詳細</th>
            </tr>
            </thead>
            <tbody>
            {charges.map((charge: any) => (
                <tr key={charge.id} className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">{charge.amount} {charge.currency === 'jpy' ? '円' : 'USD'}</td>
                    <td className="border border-gray-300 px-4 py-2">{charge.status == 'succeeded' ? "成功" : charge.status}</td>
                    <td className="border border-none px-4 py-2">
                        <div className='flex justify-between items-center'>
                            <p>{charge.amount_refunded == 0 ? 'なし' : 'あり'}</p>
                            <p>
                                {charge.amount_refunded != 0 ?
                                    <>({charge.amount_refunded}{charge.currency === 'jpy' ? '円' : 'USD'})</> :
                                    <>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => {
                                                refundsByChargeId(charge.id).then();
                                            }}>返金
                                        </button>
                                    </>
                                }</p>
                        </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                        {Object.keys(charge.metadata).map((key) => {
                            const product = fetchProducts(key);
                            const value = JSON.parse(charge.metadata[key]);
                            return (
                                <p key={`${charge.id}-${key}`}>
                                    {product?.name} {value.price} {charge.currency === 'jpy' ? '円' : 'USD'} x {value.count} 品
                                </p>
                            );
                        })}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Histories;
