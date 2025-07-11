"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleAsk = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Server error");

      setMessages((prev) => [...prev, { role: "ai", text: data.result || "⚠️ No response from Gemini." }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "ai", text: "❌ Error: " + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f7]">
      {/* Header */}
      <header className="p-4 text-center text-2xl font-semibold bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] bg-clip-text text-transparent">
        Gemini Assistant
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl p-4 rounded-xl ${
              msg.role === "user"
                ? "ml-auto bg-[#e8f0fe] text-[#1a73e8]"
                : "mr-auto bg-[#f1f3f4] text-[#3c4043]"
            } shadow`}
          >
            <ReactMarkdown>
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      {/* Prompt input */}
      <footer className="border-t p-4 bg-white">
        <div className="flex items-center max-w-2xl mx-auto gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={1}
            className="flex-1 p-3 rounded-full border text-gray-900 border-gray-300 bg-gray-100 focus:outline-none resize-none"
            placeholder="Ask something..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-[#1a73e8] text-white px-5 py-2 rounded-full hover:bg-[#1967d2] disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </footer>
    </div>
  );
}
