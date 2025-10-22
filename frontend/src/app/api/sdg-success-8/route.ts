import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
);

interface SDGData {
  nama_desa: string;
  [key: string]: any;
}

// 🔢 Skor numerik positif
function numericScore(value: number, max: number): number {
  if (typeof value !== "number" || isNaN(value)) return 0;
  return Math.min(1, value / max) * 100;
}

// 🔤 Skor kategori
function categoryScore(key: string, value: any): number {
  if (value === null || value === undefined) return 0;
  const v = String(value).toLowerCase().trim();

  switch (key) {
    case "r403a": // Sumber penghasilan utama warga
      if (v.includes("industri") || v.includes("jasa") || v.includes("perdagangan"))
        return 100;
      if (v.includes("pertanian")) return 70;
      return 50;

    case "r1207a": // Fasilitas kredit usaha rakyat
      return v.includes("ada") ? 100 : 0;

    default:
      return 0;
  }
}

// 🔍 Hitung keberhasilan SDG 8
async function calculateSdg8Success(data: SDGData[]): Promise<number> {
  if (!data || data.length === 0) return 0;

  const total: number[] = [];

  for (const row of data) {
    const scores: number[] = [];

    // Numerik
    scores.push(numericScore(row["r1403a"], 5)); // BUMDes
    scores.push(numericScore(row["r1201a8"], 10)); // Industri mikro makanan
    scores.push(numericScore(row["r510b5k4"], 3)); // Waduk untuk pariwisata

    // Kategori
    scores.push(categoryScore("r403a", row["r403a"])); // Sumber penghasilan
    scores.push(categoryScore("r1207a", row["r1207a"])); // Fasilitas KUR

    // Rata-rata per desa
    const valid = scores.filter((s) => !isNaN(s));
    if (valid.length > 0) {
      const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
      total.push(avg);
    }
  }

  // Rata-rata keseluruhan
  const overall =
    total.length > 0 ? total.reduce((a, b) => a + b, 0) / total.length : 0;

  return parseFloat(overall.toFixed(2));
}

// 🧩 Endpoint utama
export async function GET(): Promise<Response> {
  try {
    const { data: rows, error } = await supabase.from("sdgs_8").select("*");
    if (error) throw new Error(error.message);

    let successPercentage = 0;
    if (rows && rows.length > 0) {
      successPercentage = await calculateSdg8Success(rows);
    }

    return new Response(
      JSON.stringify({ goalNo: 8, successPercentage }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in sdg-success-8:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

