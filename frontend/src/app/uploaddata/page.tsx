"use client";
import { useState } from "react";
import Papa from "papaparse";

export default function UploadDataPage() {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [sdg, setSdg] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [parsing, setParsing] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔐 Validasi sandi ke server sebelum buka form upload
  const tryOpen = async () => {
    setMessage(null);
    if (!password) return;
    try {
      const res = await fetch("/api/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuth(true);
      } else {
        const js = await res.json().catch(() => ({} as any));
        setIsAuth(false);
        setMessage(js?.error || "❌ Sandi salah. Tidak dapat membuka halaman upload.");
      }
    } catch (e: any) {
      setMessage(e?.message || "Terjadi kesalahan jaringan.");
    }
  };

  // 📄 Parsing CSV saat file diunggah
  const handleFile = (f: File) => {
    setParsing(true);
    setMessage(null);
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data = res.data as any[];
        const cols = (res.meta.fields || []) as string[];
        setRows(data);
        setColumns(cols);
        setParsing(false);
      },
      error: (err) => {
        setMessage(`Gagal parsing CSV: ${err.message}`);
        setParsing(false);
      },
    });
  };

  // 🚀 Kirim data ke Supabase
  const onSubmit = async () => {
    setMessage(null);
    if (!isAuth) {
      setMessage("Masukkan sandi dulu.");
      return;
    }
    if (!sdg || !file) {
      setMessage("Pilih SDGs dan file CSV terlebih dulu.");
      return;
    }
    try {
      setSending(true);
      const form = new FormData();
      form.append("password", password);
      form.append("sdg", String(sdg));
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const js = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        setMessage(js?.error || `Gagal upload (status ${res.status}).`);
      } else {
        setMessage(`✅ Sukses! ${js.inserted ?? 0} baris diunggah ke sdgs_${sdg}.`);
        setRows([]);
        setColumns([]);
        setFile(null);
      }
    } catch (e: any) {
      setMessage(e?.message || "Terjadi kesalahan jaringan.");
    } finally {
      setSending(false);
    }
  };

  // ============================================================
  // ✨ Tampilan halaman
  // ============================================================
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">📤 Upload Data SDGs (Overwrite)</h1>

      {/* ======================= STEP 1: SANDI ======================= */}
      {!isAuth && (
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="rounded-2xl border border-white/10 p-6 grid gap-4 w-full max-w-md text-center bg-white/5 backdrop-blur-sm shadow-lg">
            <div className="text-base font-medium opacity-90">
              Masukkan sandi untuk membuka halaman upload data.
            </div>

            <input
              type="password"
              className="border rounded-xl px-3 py-2 text-center bg-white/70 dark:bg-black/30 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Sandi (UPLOAD_PASSWORD)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={tryOpen}
              className="rounded-xl px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-50 mx-auto"
              disabled={!password}
            >
              Buka Halaman Upload
            </button>

            {message && (
              <div className="text-red-500 text-sm mt-2">{message}</div>
            )}
          </div>
        </div>
      )}

      {/* ======================= STEP 2–5: UPLOAD ======================= */}
      {isAuth && (
        <div className="space-y-4">
          {/* Select SDGs */}
          <div className="rounded-2xl border border-white/10 p-4 grid md:grid-cols-[220px_1fr] gap-4 items-center">
            <label className="text-sm font-medium">Pilih SDGs</label>
            <select
              className="border rounded-xl px-3 py-2 bg-white/70 dark:bg-black/30 text-black dark:text-white"
              value={sdg as any}
              onChange={(e) => setSdg(Number(e.target.value))}
            >
              <option value="">— pilih —</option>
              {Array.from({ length: 17 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{`SDG ${n}`}</option>
              ))}
            </select>
          </div>

          {/* Upload CSV */}
          <div className="rounded-2xl border border-white/10 p-4 grid gap-3">
            <label className="text-sm font-medium">Upload CSV</label>
            <input
              type="file"
              accept=".csv,text/csv"
              className="border rounded-xl px-3 py-2 bg-white/70 dark:bg-black/30 text-black dark:text-white"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  handleFile(f);
                }
              }}
            />
            {parsing && <div className="text-sm">Parsing CSV…</div>}
          </div>

          {/* Preview Data */}
          {columns.length > 0 && (
            <div className="rounded-2xl border border-white/10 p-4 overflow-auto">
              <div className="text-sm font-semibold mb-2">
                Preview Data ({rows.length} baris)
              </div>
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th
                        key={c}
                        className="text-left border-b px-2 py-1 whitespace-nowrap"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 50).map((r, idx) => (
                    <tr key={idx} className="border-b border-white/10">
                      {columns.map((c) => (
                        <td
                          key={c}
                          className="px-2 py-1 whitespace-nowrap"
                        >
                          {String(r[c] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 50 && (
                <div className="text-xs opacity-70 mt-2">
                  Menampilkan 50 baris pertama dari {rows.length}.
                </div>
              )}
            </div>
          )}

          {/* Tombol Kirim */}
          <div className="flex gap-3">
            <button
              onClick={onSubmit}
              disabled={!sdg || !file || sending}
              className="rounded-xl px-4 py-2 bg-green-600 text-white disabled:opacity-50"
            >
              {sending ? "Mengirim…" : "Kirim ke Supabase (Overwrite)"}
            </button>
            {message && <div className="text-sm self-center">{message}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

