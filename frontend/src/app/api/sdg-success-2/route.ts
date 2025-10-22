import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
);

interface SDGData {
  nama_desa: string;
  [key: string]: any;
}

// Hitung skor numerik (semakin kecil makin baik)
function numericScore(value: number, max: number = 50): number {
  if (typeof value !== "number") return 0;
  return Math.max(0, (1 - value / max)) * 100;
}

// Hitung skor kategori berdasarkan arti kalimat
function categoryScore(key: string, value: string): number {
  if (!value) return 0;
  const v = value.toLowerCase().trim();

  switch (key) {
    case "r711jk2": // Kejadian kearawanan pangan
      if (v.includes("tidak ada")) return 100;
      if (v.includes("ada")) return 0;
      return 50;

    case "r515c": // Penggalakan pupuk organik
      if (v.includes("tidak ada")) return 0;
      if (v.includes("ada")) return 100;
      return 50;

    case "r403c2": // Akses jalan pertanian
      if (v.includes("sep sepanjang tahun")) return 100;
      if (v.includes("kecuali saat hujan")) return 80;
      return 50;

    default:
      return 0;
  }
}

async function calculateSdg2Success(data: SDGData[]): Promise<number> {
  if (!data || data.length === 0) return 0;

  const total: number[] = [];
  for (const row of data) {
    const scores: number[] = [];

    // 🔢 Numerik
    scores.push(numericScore(row["r709"])); // jumlah penderita gizi buruk
    scores.push(numericScore(row["r603"])); // luas lahan terdampak bencana

    // 🔤 Kategori
    scores.push(categoryScore("r711jk2", row["r711jk2"]));
    scores.push(categoryScore("r515c", row["r515c"]));
    scores.push(categoryScore("r403c2", row["r403c2"]));

    const validScores = scores.filter((s) => !isNaN(s));
    if (validScores.length > 0) {
      const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
      total.push(avg);
    }
  }

  const overall = total.reduce((a, b) => a + b, 0) / total.length;
  return parseFloat(overall.toFixed(2));
}

export async function GET(): Promise<Response> {
  try {
    const { data: rows, error } = await supabase.from("sdgs_2").select("*");
    if (error) throw new Error(error.message);

    let successPercentage = 0;
    if (rows && rows.length > 0) {
      successPercentage = await calculateSdg2Success(rows);
    }

    return new Response(
      JSON.stringify({ goalNo: 2, successPercentage }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

