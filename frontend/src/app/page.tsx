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
};

export default function Dashboard() {
  const [sdgData, setSdgData] = useState<SdgSuccessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSdgSuccess() {
      try {
        const response = await fetch("/api/sdg-success");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
        <p className="text-3xl font-bold text-white animate-pulse">Loading SDGs...</p>
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
              title={sdgTitles[d.goalNo]}
              successPercentage={d.successPercentage}
            />
          </Link>
        ))}
      </section>
    </div>
  );
}
