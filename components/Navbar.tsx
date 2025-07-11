"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-[#f1f3f4] shadow-md border-b border-[#e0e0e0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/home">
          <span className="text-2xl font-semibold bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent hover:opacity-90 transition">
            PeerLink
          </span>
        </Link>

        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/home"
            className="text-[#202124] text-sm font-medium px-3 py-1.5 rounded-full hover:bg-[#e8f0fe] transition"
          >
            Home
          </Link>
          <Link
            href="/myprofile"
            className="text-[#202124] text-sm font-medium px-3 py-1.5 rounded-full hover:bg-[#e8f0fe] transition"
          >
            My Profile
          </Link>
          <Link
            href="/ai-assistant"
            className="text-[#202124] text-sm font-medium px-3 py-1.5 rounded-full hover:bg-[#e8f0fe] transition"
          >
            AI Assistant
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="bg-[#EA4335] hover:bg-[#d93025] text-white px-4 py-1.5 rounded-full text-sm font-medium transition"
            >
              Logout
            </button>
          )}

          <Link href="/requests">
            <button className="text-sm text-[#1a73e8] underline hover:text-[#1669c1] transition">
              View My Requests
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
