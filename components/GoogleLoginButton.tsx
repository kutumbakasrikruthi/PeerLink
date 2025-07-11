"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User signed in:", user);

      // Show toast message
      toast.success("🎉 Successfully Logged In!");

      // Redirect to /home
      router.push("/home");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("❌ Login failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Sign in with Google
    </button>
  );
}
