"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getSession } from "next-auth/react";

interface SessionRequest {
  id: string;
  fromName: string;
  toName: string;
  fromEmail: string;
  toEmail: string;
  date: string;
  mode: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  meetLink?: string;
}

export default function RequestsPage() {
  const [sentRequests, setSentRequests] = useState<SessionRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const sentQuery = query(collection(db, "sessionRequests"), where("fromEmail", "==", user.email));
        const sentSnapshot = await getDocs(sentQuery);
        const sent = sentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SessionRequest));
        setSentRequests(sent);

        const receivedQuery = query(collection(db, "sessionRequests"), where("toEmail", "==", user.email));
        const receivedSnapshot = await getDocs(receivedQuery);
        const received = receivedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SessionRequest));
        setReceivedRequests(received);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAction = async (id: string, action: "accepted" | "rejected") => {
    try {
      await updateDoc(doc(db, "sessionRequests", id), { status: action });
      setReceivedRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: action } : r))
      );

      if (action === "accepted") {
        const session = await getSession();
        const request = receivedRequests.find((r) => r.id === id);
        if (!request || !session) return;

        const res = await fetch("/api/google/calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
            summary: `Session with ${request.fromName}`,
            description: request.message,
            start: new Date(request.date).toISOString(),
            end: new Date(new Date(request.date).getTime() + 30 * 60000).toISOString(),
          }),
        });

        const data = await res.json();
        const meetLink = data?.event?.hangoutLink;

        if (meetLink) {
          await updateDoc(doc(db, "sessionRequests", id), { meetLink });
          setReceivedRequests((prev) =>
            prev.map((r) => (r.id === id ? { ...r, meetLink } : r))
          );
        }
      }
    } catch (err) {
      console.error("Error handling session request:", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading session requests...</p>;

  return (
    <main className="min-h-screen bg-[#f1f3f4] p-6">
      <h1 className="text-3xl font-semibold text-[#202124] mb-6">Your Session Requests</h1>

      {/* Sent Requests */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#202124]">📤 Requests Sent</h2>
        {sentRequests.length === 0 ? (
          <p className="text-gray-600">You haven't sent any requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sentRequests.map((req) => (
              <RequestCard key={req.id} req={req} type="sent" />
            ))}
          </div>
        )}
      </section>

      {/* Received Requests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-[#202124]">📥 Requests Received</h2>
        {receivedRequests.length === 0 ? (
          <p className="text-gray-600">No requests received yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receivedRequests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                type="received"
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function RequestCard({
  req,
  type,
  onAction,
}: {
  req: SessionRequest;
  type: "sent" | "received";
  onAction?: (id: string, action: "accepted" | "rejected") => void;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#e0e0e0] shadow-sm">
      <p className="font-medium text-[#1f1f1f] mb-1">
        {type === "sent" ? `To: ${req.toName}` : `From: ${req.fromName}`}
      </p>
      <p className="text-gray-700 text-sm mb-1">
        Date: {new Date(req.date).toLocaleString()}
      </p>
      <p className="text-gray-700 text-sm mb-1">Mode: {req.mode}</p>
      <p className="text-gray-600 text-sm italic mb-1">"{req.message}"</p>
      <p className="text-xs text-blue-600 font-semibold mt-2">Status: {req.status}</p>

      {type === "received" && req.status === "pending" && onAction && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onAction(req.id, "accepted")}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
          >
            Accept
          </button>
          <button
            onClick={() => onAction(req.id, "rejected")}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
          >
            Reject
          </button>
        </div>
      )}

      {req.status === "accepted" && req.meetLink && (
        <a
          href={req.meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm underline mt-2 block"
        >
          Join Google Meet
        </a>
      )}
    </div>
  );
}
