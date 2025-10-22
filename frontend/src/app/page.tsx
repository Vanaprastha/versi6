"use client";

import Link from "next/link";
import SDGCard from "@/components/SDGCard";
import { useState, useEffect } from "react";

interface SdgSuccessData {
  goalNo: number;
  successPercentage: number;
}

const sdgTitles: { [key: number]: string } = {
  1: "Tanpa Kemiskinan",
  2: "Tanpa Kelaparan",
  3: "Kehidupan Sehat & Sejahtera",
  4: "Pendidikan Berkualitas",
  5: "Kesetaraan Gender",
  6: "Air Bersih & Sanitasi Layak",
  7: "Energi Bersih & Terjangkau",
  8: "Pekerjaan Layak & Pertumbuhan Ekonomi",
  9: "Industri, Inovasi & Infrastruktur",
  10: "Berkurangnya Kesenjangan",
  11: "Kota & Pemukiman Berkelanjutan",
  12: "Konsumsi & Produksi Bertanggung Jawab",
  13: "Aksi Terhadap Perubahan Iklim",
  14: "Ekosistem Lautan",
  15: "Ekosistem Daratan",
  16: "Institusi yang Kuat & Damai",
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

  // ⏳ Tampilan loading elegan
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-950 via-sky-900 to-sky-800">
        <p className="text-3xl font-bold text-white animate-pulse tracking-wide">
          Loading SDGs...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-400 font-semibold text-lg">
          Error loading SDGs: {error}
        </p>
      </div>
    );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <header className="glass-2 p-4 rounded-2xl sticky top-0 z-10 shadow-lg backdrop-blur-md">
        <h1 className="text-2xl font-bold drop-shadow-md text-white">
          Ringkasan Tujuan Pembangunan Berkelanjutan (SDGs)
        </h1>
        <p className="text-sm text-neutral-200/80 mt-1">
          Pilih salah satu tujuan untuk melihat perkembangan dan indikatornya.
        </p>
      </header>

      {/* Grid SDG Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-2 sm:px-4">
        {sdgData.map((d) => (
          <Link
            key={d.goalNo}
            href={{ pathname: `/sdg/sdg_${d.goalNo}` }}
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <SDGCard
              goalNo={d.goalNo}
              title={sdgTitles[d.goalNo] || `SDG ${d.goalNo}`}
              successPercentage={d.successPercentage}
            />
          </Link>
        ))}
      </section>
    </div>
  );
}

