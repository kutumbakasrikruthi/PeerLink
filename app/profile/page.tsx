"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileFormPage() {
  const router = useRouter();
  const user = auth.currentUser;

  const [fullName, setFullName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: fullName,
        email: user.email,
        photoURL: user.photoURL,
        bio,
        branch,
        year,
        interests,
        skills,
        createdAt: new Date(),
      });

      toast.success("Profile saved!");
      router.push("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f1f3f4] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl border border-[#e0e0e0] w-full max-w-md p-8 space-y-6"
      >
        <h1 className="text-2xl font-semibold text-[#202124]">Create Your Profile</h1>

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Short Bio</label>
          <textarea
            placeholder="A short bio about you..."
            className="input-field resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Branch</label>
          <input
            type="text"
            placeholder="e.g., CSE"
            className="input-field"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Year</label>
          <input
            type="text"
            placeholder="e.g., 2nd"
            className="input-field"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Interests</label>
          <input
            type="text"
            placeholder="e.g., AI, Design, Web Dev"
            className="input-field"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-700">Skills</label>
          <input
            type="text"
            placeholder="e.g., Python, React, Figma"
            className="input-field"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-[#1a73e8] text-white font-medium hover:bg-[#1967d2] transition"
        >
          Save Profile
        </button>
      </form>

      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #dadce0;
          border-radius: 0.5rem;
          background-color: #fff;
          color: #202124;
          font-size: 0.95rem;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
        }

        .input-field:focus {
          border-color: #1a73e8;
          box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
        }

        ::placeholder {
          color: #80868b;
        }
      `}</style>
    </main>
  );
}
