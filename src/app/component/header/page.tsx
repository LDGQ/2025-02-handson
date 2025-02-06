'use client';
import React from "react";
import Login from "@/app/component/login/page";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const Header: React.FC = () => {
    const { profile } = useAuth();

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">My App Header</h1>
            <nav className="flex items-center space-x-4">
                <ul className="flex space-x-4">
                    <li><Link href="/" className="hover:underline">ホーム</Link></li>
                    {/* Step2 */}
                    <li><Link href="/histories" className="hover:underline">履歴</Link></li>
                </ul>
                {
                    profile && (
                        <div className="flex items-center space-x-2">
                            {/* Step5 */}
                            {/* <img src={profile.pictureUrl} alt="User Icon" className="w-8 h-8 rounded-full" /> */}
                            <span className="font-medium">{profile.displayName}</span>
                        </div>
                    )
                }
                <Login />
            </nav>
        </header>
    );
}

export default Header;
