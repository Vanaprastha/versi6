"use client";

import Link from "next/link";
import SDGCard from "@/components/SDGCard";
import { useState, useEffect } from "react";

interface SdgSuccessData {
  goalNo: number;
  successPercentage: number;
}

// 🧭 Nama lengkap semua SDGs (1–17)
const sdgTitles: { [key: number]: string } = {
  1: "Tanpa Kemiskinan",
  2: "Tanpa Kelaparan",
  3: "Kehidupan Sehat dan Sejahtera",
  4: "Pendidikan Berkualitas",
  5: "Kesetaraan Gender",
  6: "Air Bersih dan Sanitasi Layak",
  7: "Energi Bersih dan Terjangkau",
  8: "Pekerjaan Layak dan Pertumbuhan Ekonomi",
  9: "Industri, Inovasi, dan Infrastruktur",
  10: "Berkurangnya Kesenjangan",
  11: "Kota dan Permukiman yang Berkelanjutan",
  12: "Konsumsi dan Produksi yang Bertanggung Jawab",
  13: "Penanganan Perubahan Iklim",
  14: "Ekosistem Lautan",
  15: "Ekosistem Daratan",
  16: "Perdamaian, Keadilan, dan Kelembagaan yang Tangguh",
  17: "Kemitraan untuk Mencapai Tujuan",
};

export default function Dashboard() {
  const [sdgData, setSdgData] = useState<SdgSuccessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSdgSuccess() {
      try {
        const response = await fetch("/api/sdg-success", { cache: "no-store" });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data: SdgSuccessData[] = await response.json();
        setSdgData(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSdgSuccess();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-3xl font-bold text-white animate-pulse">
          Loading SDGs...
        </p>
      </div>
    );

  if (error) return <p>Error loading SDGs: {error}</p>;

  return (
    <div className="space-y-6">
      <header className="glass-2 p-4 rounded-2xl sticky top-0 z-10">
        <h1 className="text-xl font-semibold drop-shadow-md">Ringkasan SDGs</h1>
        <p className="text-sm text-neutral-200/80">
          Pilih wilayah & indikator untuk melihat perkembangan.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sdgData.map((d) => (
          <Link key={d.goalNo} href={{ pathname: `/sdg/sdg_${d.goalNo}` }}>
            <SDGCard
              goalNo={d.goalNo}
              // tampilkan nama SDG, kalau belum terdaftar tampilkan placeholder
              title={sdgTitles[d.goalNo] || `SDG ${d.goalNo}`}
              successPercentage={d.successPercentage}
            />
          </Link>
        ))}
      </section>
    </div>
  );
}

