import React from "react";
import { useAuth } from '@/app/context/AuthContext';

const Login: React.FC = () => {
    const { login, logout, customer } = useAuth();

    return (<>{
        customer ? (
          <a onClick={logout} className="hover:underline">ログアウト</a>
        ) :
        (
          <a onClick={login} className="hover:underline">ログイン</a>
        )
    }</>);
}

export default Login;
