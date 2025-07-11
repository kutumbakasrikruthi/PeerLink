"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        toast.error("Profile not found.");
        router.push("/profile");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !profile) return;

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        updatedAt: new Date(),
      });

      toast.success("Profile updated!");
      router.push("/myprofile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <main className="h-screen flex items-center justify-center bg-[#f1f3f4]">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-[#1a73e8] border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f1f3f4] p-6 flex justify-center items-center text-[#202124]">
      <form
        onSubmit={handleUpdate}
        className="bg-white w-full max-w-md rounded-2xl shadow-md border border-[#e0e0e0] p-8 space-y-5"
      >
        <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-[#202124]"
          placeholder="Full Name"
          required
        />

        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-[#202124]"
          placeholder="Bio"
        />

        <input
          type="text"
          value={profile.branch}
          onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-[#202124]"
          placeholder="Branch"
        />

        <input
          type="text"
          value={profile.year}
          onChange={(e) => setProfile({ ...profile, year: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-[#202124]"
          placeholder="Year"
        />

        <input
          type="text"
          value={profile.interests}
          onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-[#202124]"
          placeholder="Interests"
        />

        <input
          type="text"
          value={profile.skills}
          onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] text-[#202124]"
          placeholder="Skills"
        />

        <button
          type="submit"
          className="w-full bg-[#1a73e8] text-white py-2 rounded-md font-medium hover:bg-[#1669c1] transition"
        >
          Update Profile
        </button>
      </form>
    </main>
  );
}
