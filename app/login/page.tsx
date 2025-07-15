"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged,getAdditionalUserInfo } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
const user = result.user;
const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

      if (isNewUser) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
        toast.success("Signed up successfully!");
        router.push("/profile");
      } else {
        toast.success("Welcome back!");
        router.push("/home");
      }

    } catch (error) {
      toast.error("Sign in failed.");
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/home");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <main className="h-screen flex items-center justify-center bg-[#f1f3f4]">
      <div className="bg-white p-10 rounded-2xl shadow-md border border-[#e0e0e0] flex flex-col items-center space-y-6 max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-[#202124]">Login to PeerLink</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-[#1a73e8] text-white font-medium py-2 rounded-md hover:bg-[#1669c1] transition"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
