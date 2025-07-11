"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import ConnectModal from "@/components/ConnectModal";
import Toast from "@/components/Toast";

export default function HomePage() {
  const [otherUsers, setOtherUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const handleConnectClick = (peer: any) => {
    setSelectedPeer(peer);
    setModalOpen(true);
  };

  const handleSessionSubmit = async (sessionData: any) => {
    if (!selectedPeer || !auth.currentUser) return;

    try {
      const response = await fetch("/api/sendSessionRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUid: auth.currentUser.uid,
          fromName: auth.currentUser.displayName || "Unknown",
          fromEmail: auth.currentUser.email || "",
          toUid: selectedPeer.uid,
          toName: selectedPeer.name || "Unknown",
          toEmail: selectedPeer.email,
          ...sessionData,
        }),
      });

      if (response.ok) {
        console.log("✅ Request sent");
        setModalOpen(false);
        setToastMessage("✅ Session request sent successfully!");
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to send request:", errorText);
        setToastMessage("❌ Failed to send session request.");
      }
    } catch (err) {
      console.error("❌ Error submitting request:", err);
      setToastMessage("❌ Something went wrong while sending the request.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snapshot = await getDocs(collection(db, "users"));
        const allUsers = snapshot.docs.map((doc) => doc.data());
        const filtered = allUsers.filter((u) => u.uid !== user.uid);
        setOtherUsers(filtered);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-600">Loading users...</p>;
  }

  return (
    <main className="min-h-screen bg-[#f1f3f4] p-6">
      <h1 className="text-3xl font-semibold bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent mb-8 text-center">
        Connect with Peers
      </h1>

      {otherUsers.length === 0 ? (
        <p className="text-gray-600 text-center">No other users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherUsers.map((peer) => (
            <div
              key={peer.uid}
              className="bg-[#fefefe] p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-[#e0e0e0]"
            >
              <h2 className="text-xl font-medium text-[#202124] mb-1">{peer.name}</h2>
              <p className="text-sm text-[#5f6368]">{peer.email}</p>
              <p className="text-sm text-[#5f6368] mt-1">Branch: {peer.branch}</p>
              <p className="text-sm text-[#5f6368]">Year: {peer.year}</p>

              <button
                onClick={() => handleConnectClick(peer)}
                className="mt-4 w-full bg-[#1a73e8] text-white py-2 rounded-full hover:bg-[#1967d2] transition font-medium"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      <ConnectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        peer={selectedPeer}
        onSubmit={handleSessionSubmit}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </main>
  );
}
