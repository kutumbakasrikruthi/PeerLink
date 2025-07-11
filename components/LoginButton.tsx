"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);

      // Optional: Show success toast
      toast.success("Welcome back!");

      router.push("/home");
    } catch (error) {
      toast.error("Login failed.");
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-[#4285F4] hover:bg-[#357ae8] text-white px-5 py-2 rounded-lg font-medium transition"
    >
      Login with Google
    </button>
  );
}
