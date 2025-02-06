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

    const fetchCharge = (customerId: string) => {
        fetch(`/api/histories?customerId=${customerId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(async(response) => {
            const result = await response.json();
            setCharges(result.charges.data);
        })
        .catch(error => {
            console.error('Error fetching histories:', error);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    // 履歴一覧を取得
    useEffect(() => {
        if (customer === null) return;
        fetchCharge(customer.id);
    }, [customer])

    // 商品一覧を取得
    useEffect(() => {
        fetch('/api/product-list', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(async(response) => {
            const result = await response.json();
            setProducts(result);
        })
        .catch(error => {
            console.error('Error fetching product-list:', error);
        })
    }, []);

    const refundsByChargeId = (chargeId: string) => {
        if (!customer) return;
        if (!confirm('返金処理を行います。80%のみ返金されますが、大丈夫ですか？')) return;

        setLoading(true);
        fetch('/api/refunds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chargeId: chargeId }),
        })
        .then(() => {
            fetchCharge(customer.id);
        }).finally(() => {
            setLoading(false);
        });
    };

    // PDFダウンロード
    const downloadReceipt = (receiptUrl: string, receipt_number: string) => {
        setLoading(true);
        fetch('/api/download-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiptUrl: receiptUrl, receipt_number: receipt_number }),
        }).finally(() => {
            setLoading(false);
        });
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
        // <>
        // </>
        // Step2
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">合計金額</th>
                    <th className="border border-gray-300 px-4 py-2">状態</th>
                    <th className="border border-gray-300 px-4 py-2">詳細</th>
                    {/* Step3 */}
                    <th className="border border-gray-300 px-4 py-2">返金</th>
                    {/* Step4 */}
                    <th className="border border-gray-300 px-4 py-2">領収書</th>
                </tr>
            </thead>
            <tbody>
            {charges.map((charge: any) => (
                <tr key={charge.id} className="border-b border-gray-300">
                    <td className="border border-gray-300 px-4 py-2">{charge.amount} {charge.currency === 'jpy' ? '円' : 'USD'}</td>
                    <td className="border border-gray-300 px-4 py-2">{charge.status == 'succeeded' ? "成功" : charge.status}</td>
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
                    {/* Step3 */}
                    <td className="border px-4 py-2">
                        <div className='flex justify-between items-center'>
                            <p>{charge.amount_refunded == 0 ? 'なし' : 'あり'}</p>
                            <p>
                                {charge.amount_refunded != 0 ?
                                    <>({charge.amount_refunded}{charge.currency === 'jpy' ? '円' : 'USD'})</> :
                                    <>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => {
                                                refundsByChargeId(charge.id);
                                            }}>返金
                                        </button>
                                    </>
                                }</p>
                        </div>
                    </td>
                    {/* Step4 */}
                    <td className="px-4 py-2">
                        {charge.amount_refunded ?
                            <div>-</div>
                            : <div className="flex gap-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        downloadReceipt(charge.receipt_url, charge.receipt_number);
                                    }}>PDFダウンロード
                                </button>
                            </div>
                        }
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Histories;
