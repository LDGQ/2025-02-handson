'use client';

import React, {Dispatch, SetStateAction, useState} from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentProps {
    customerId: string;
    setClientSecret: Dispatch<SetStateAction<string>>;
    products: Record<string, any>;
}

const Payment: React.FC<PaymentProps> = ({ customerId, setClientSecret, products }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handlePayment = async () => {
        if (!stripe || !elements) {
            setMessage('Stripe has not loaded.');
            return;
        }

        setIsProcessing(true);

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message || 'Payment failed.');
        } else if (paymentIntent) {
            setMessage('Payment succeeded!');

            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId, products}),
            });
            // componentを閉じる
            setClientSecret('');

            const pdfUrl = await response.json();
            // email がない場合は、請求書を発行できないので、そのまま終了をする
            if(pdfUrl === '') {
                return;
            }
            // PDFダウンロード処理
            const link = document.createElement('a');
            link.href = pdfUrl; // PDFのURLを指定
            link.download = pdfUrl.split('/').pop() || 'invoce.pdf'; // ファイル名を指定
            link.target = '_blank'; // 新しいタブを開くオプション
            link.rel = 'noopener noreferrer'; // セキュリティ向上
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={() => {
                    setClientSecret('');
                }}
                className="hover:bg-gray-100 px-4 py-2 mb-4"
            >
                戻る
            </button>
            
            <PaymentElement />
            <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`mt-4 px-6 py-2 rounded ${
                    isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
            >
                {isProcessing ? '処理中...' : '支払う'}
            </button>
            {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
    );
};

export default Payment;