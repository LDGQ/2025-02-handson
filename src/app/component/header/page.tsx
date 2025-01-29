'use client';
import React from "react";
import Login from "@/app/component/login/page";
import Link from "next/link";

const Header: React.FC = () => {
    return <header className="bg-gray-800 text-white p-4">
    <h1 className="text-xl font-bold">2025-02-handson</h1>
    <nav>
      <ul className="flex space-x-4">
        <li><Link href="/" className="hover:underline">ホーム</Link></li>
        <li><Link href="/histories" className="hover:underline">履歴</Link></li>
        <Login />
      </ul>
    </nav>
  </header>;
}

export default Header;
