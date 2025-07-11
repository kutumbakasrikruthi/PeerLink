// app/page.tsx
"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] px-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#202124] mb-4">
          Welcome to <span className="text-[#4285F4]">PeerLink</span>
        </h1>
        <p className="text-lg text-[#5f6368] mb-6">
          A peer learning platform powered by Google technologies — connect, collaborate, and grow.
        </p>

        <Link
          href="/login"
          className="inline-block px-6 py-3 text-white bg-[#4285F4] hover:bg-[#3367D6] rounded-lg font-medium shadow-md transition"
        >
          Get Started
        </Link>

        <div className="mt-6 flex justify-center space-x-4">
          <span className="w-3 h-3 rounded-full bg-[#EA4335]"></span>
          <span className="w-3 h-3 rounded-full bg-[#FBBC05]"></span>
          <span className="w-3 h-3 rounded-full bg-[#34A853]"></span>
        </div>
      </div>
    </main>
  );
}

