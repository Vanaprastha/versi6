"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; text: string };

export default function TanyaSDGsPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<Msg[]>([
    { role: "assistant", text: "💬 Halo! Saya **SDGsBot**. Tanyakan apa saja tentang data SDGs 1–17. 🚀" },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, loading]);

  async function send() {
    if (!q.trim()) return;
    setLogs((l) => [...l, { role: "user", text: q }]);
    setQ("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ q }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const text = data?.answer || data?.error || "Maaf, terjadi kesalahan.";
      setLogs((l) => [...l, { role: "assistant", text }]);
    } catch {
      setLogs((l) => [...l, { role: "assistant", text: "⚠️ Gagal menghubungi server." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-white">
      <h1 className="text-3xl font-bold text-center text-emerald-700">💬 TanyaSDGs</h1>

      <div className="glass-4 border rounded-2xl p-6 h-[70vh] overflow-y-auto space-y-4">
        <AnimatePresence>
          {logs.map((m, i) => (
            <motion.div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-5 py-3 rounded-2xl ${m.role === "user" ? "bg-blue-600 text-white" : "bg-green-100 text-green-900"}`}>
                <b>{m.role === "user" ? "Kamu" : "SDGsBot"}:</b>{" "}
                {/* @ts-expect-error react-markdown typing issue */}
                <ReactMarkdown>{m.text}</ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && <div className="italic animate-pulse text-emerald-300">SDGsBot sedang mengetik…</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tulis pertanyaanmu…" className="flex-1 border rounded-xl px-4 py-3 bg-white/20 text-white" />
        <button onClick={send} disabled={loading} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
          Kirim
        </button>
      </div>
    </div>
  );
}

