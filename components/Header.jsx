// components/Header.js
import Link from "next/link";
import { Search, Bell, MessageSquare } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 shadow-md">
      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Welcome to FootLock</h1>
        <p className="text-gray-500">Hello Dinesh, Welcome back!</p>
      </div>

      {/* Middle Section */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Dashboard"
          className="w-72 rounded-full border border-gray-300 bg-gray-100 py-2 px-4 text-gray-700 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <Search className="absolute right-4 top-2 text-gray-400" />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <Link href="/messages">
        <MessageSquare className="text-gray-600 hover:text-gray-800 cursor-pointer" />
        </Link>
        <Link href="/notifications">
        <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" />
        </Link>
        <Link href="/profile">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white font-bold">
          FL
        </div>
        </Link>
      </div>
    </header>
  );
}
