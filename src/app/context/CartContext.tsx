"use client";
import React, {createContext, ReactNode, useContext, useState} from 'react';
import { Cart } from '@/app/interface/cart';
import { Customer } from '../interface/customer';

// Context の型定義
interface CartContextType {
  cart: Cart,
  setCart: any;
  addCart: any;
  resetCart: any;
  parchaseCart: any;
  clientSecret: string;
}

const CartContext = createContext<CartContextType>({
  cart: new Cart(),
  setCart: () => {},
  addCart: () => {},
  resetCart: () => {},
  parchaseCart: () => {},
  clientSecret: '',
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: {children: ReactNode}) => {
  const [cart, setCart] = useState(new Cart()); // 選択した商品
  const [clientSecret, setClientSecret] = useState('');   // 支払い情報

  const addCart = (product: any, count: number) => {
    const newCart = new Cart();
    Object.assign(newCart, cart); // 現在の状態をコピー
    newCart.add(product, count); // 商品を追加

    // 新しいインスタンスを状態として設定
    setCart(newCart);
  }

  const parchaseCart = (customer: Customer) => {
    if (cart.totalAmount() <= 0)return;
    const amount = cart.totalAmount();
    const currency = 'jpy';
    const metadata = cart.getMetadata();
    fetch('/api/payment-intents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, currency, customer, metadata }),
      }).then(async (response) => {
        const result = await response.json();
        setClientSecret(result.client_secret);
      })
  }

  const resetCart = () => {
    setCart(new Cart());
    setClientSecret('');
  }

  return (
    <CartContext.Provider value={{
      cart, setCart, addCart, resetCart, parchaseCart,
      clientSecret
    }}>
      {children}
    </CartContext.Provider>
  );
};
