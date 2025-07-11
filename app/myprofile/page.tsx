"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="h-screen flex flex-col items-center justify-center bg-[#f1f3f4] text-[#5f6368]">
        <div className="text-lg mb-4">Loading profile</div>
        <div className="flex space-x-1">
          <span className="h-2 w-2 bg-[#5f6368] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 bg-[#5f6368] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 bg-[#5f6368] rounded-full animate-bounce" />
        </div>
      </main>
    );
  }

  if (!profile) return null;

  return (
    <main className="min-h-screen bg-[#f1f3f4] p-6 text-[#202124]">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-[#e0e0e0] relative">
        <button
          onClick={() => router.push("/myprofile/edit")}
          className="absolute top-4 right-4 text-sm font-medium bg-[#1a73e8] text-white px-4 py-1.5 rounded-full hover:bg-[#1669c1] transition"
        >
          Edit Profile
        </button>

        <h1 className="text-3xl font-semibold mb-6">My Profile</h1>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={profile.photoURL}
            alt={profile.name}
            className="w-24 h-24 rounded-full border border-gray-300 shadow-sm object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-[#1f1f1f]">{profile.name}</h2>
            <p className="text-[#5f6368] text-sm">{profile.email}</p>
          </div>
        </div>

        <div className="space-y-4 text-[#3c4043] text-[15px]">
          <p><span className="font-medium text-[#202124]">Bio:</span> {profile.bio || "—"}</p>
          <p><span className="font-medium text-[#202124]">Branch:</span> {profile.branch || "—"}</p>
          <p><span className="font-medium text-[#202124]">Year:</span> {profile.year || "—"}</p>
          <p><span className="font-medium text-[#202124]">Interests:</span> {profile.interests || "—"}</p>
          <p><span className="font-medium text-[#202124]">Skills:</span> {profile.skills || "—"}</p>
        </div>
      </div>
    </main>
  );
}
