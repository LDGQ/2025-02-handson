'use client';

import React, {Dispatch, SetStateAction, useState} from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/app/context/CartContext';
import {usePopupContext} from "@/app/context/PopupContext";
import { useAuth } from '@/app/context/AuthContext';

const Payment: React.FC = () => {
    // Step7
    // const {resetCart} = useCart();
    const {setClientSecret} = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { openPopup } = usePopupContext();

    const handlePayment = () => {
        if (!stripe || !elements) {
            setMessage('Stripe has not loaded.');
            return;
        }
        setIsProcessing(true);

        stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        })
        .then(({ paymentIntent, error }) => {
            if (error) {
                setMessage(error.message || 'Payment failed.');
            } else if (paymentIntent) {
                setMessage('Payment succeeded!');
                // Step7
                setClientSecret();
                // resetCart();
                openPopup('購入が完了しました！');
            }
        })
        .catch(err => {
            setMessage('An unexpected error occurred.');
        })
        .finally(() => {
            setIsProcessing(false);
        });
    };


    return (
        <div className="flex flex-col items-center">
            <button
                // Step7
                onClick={setClientSecret}
                // onClick={resetCart}
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