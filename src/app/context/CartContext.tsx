"use client";
import React, {createContext, ReactNode, useContext, useState} from 'react';
import { Cart } from '@/app/interface/cart';

// Context の型定義
interface CartContextType {
  cart: Cart,
  setCart: any;
}

const CartContext = createContext<CartContextType>({
  cart: new Cart(),
  setCart: () => {}
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: {children: ReactNode}) => {
  const [cart, setCart] = useState(new Cart()); // 選択した商品
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
