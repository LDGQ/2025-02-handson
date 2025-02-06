"use client";
import React, {createContext, useContext, useEffect, useState} from 'react';
import {liff} from "@line/liff";
import {Customer} from "@/app/interface/customer";

// Context の型定義
interface AuthContextType {
    login: () => void
    logout: () => void
    customer: Customer | null
    profile: any | null
    clientSecret: string
    setClientSecret: any
}

const AuthContext = createContext<AuthContextType>({
    login: () => {},
    logout: () => {},
    customer: null,
    profile: null,
    clientSecret: '',
    setClientSecret: () => {},

});


export const useAuth = () => useContext(AuthContext);

const createCustomer = async (name: string, userId: string) => {
  try {
      const response = await fetch('/api/customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, userId }),
      });
      return await response.json();
  } catch (error) {
      console.error('Error creating customer:', error);
  }
}

const fetchCustomer = async (userId: string) => {
  try {
      const response = await fetch(`/api/customer`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'userId': userId },
      });
      const result = await response.json();

      return result.customer
  } catch (error) {
      console.error('Error fetching customer:', error);
  }
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializedLiff, setInitializedLiff] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState('');   // 支払い情報
  useEffect(() => {
      if(!process.env.NEXT_PUBLIC_LIFF_ID) return;
      liff
        .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
        .then(() => {
            setInitializedLiff(liff);
        })
        .catch((err) => {
            console.error({ err })
        })
  }, []);

  useEffect(() => {
    // LINE ログインがされている場合は、プロフィールを取得する
    if(!initializedLiff) return;
    if(!initializedLiff.isLoggedIn()) return;
    initializedLiff.getProfile().then(async (profile: any) => {
      const result = await fetchCustomer(profile.userId);
      console.log({profile})
      setProfile(profile);
      if (!result) {
        const newCustomer = await createCustomer(profile.displayName, profile.userId);
        setCustomer(newCustomer)
      } else {
        setCustomer(result)
      }
    })
  }, [initializedLiff])

  const login = () => {
    if(process.env.NEXT_PUBLIC_LIFF_ID) {
      // LIFF の設定がされている場合は、ログイン処理を行う
      // redirect されるので、liff.login だけで return する
      liff.login();
      return
    }
    // LINE ログインがされていない場合は、テスト用の userId を使ってログインする
    const userId = 'testUserId';
    fetchCustomer(userId).then((result) =>{
      const customer = result;
      if (!customer) {
          createCustomer(`displayName-${crypto.randomUUID()}`, userId).then((newCustomer) => {
              setCustomer(newCustomer)
          })
      } else {
          console.log({customer})
          setCustomer(customer)
      }
    })
  }

  const logout = () => {
    setCustomer(null);
    if(process.env.NEXT_PUBLIC_LIFF_ID) {
      // LIFF の設定がされている場合は、ログアウト処理を行う
      liff.logout();
    }
  };

  return (
    <AuthContext.Provider value={{ customer, login, logout, profile, clientSecret, setClientSecret }}>
      {children}
    </AuthContext.Provider>
  );
};
