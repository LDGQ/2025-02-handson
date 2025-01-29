import React from "react";
import { useAuth } from '@/app/context/AuthContext';

const Login: React.FC = () => {
    const { login, logout, customer } = useAuth();

    return (<>{
        customer ? (
          <li><a onClick={logout} className="hover:underline">ログアウト</a></li>
        ) :
        (
          <li><a onClick={login} className="hover:underline">ログイン</a></li>
        )
    }</>);
}

export default Login;
