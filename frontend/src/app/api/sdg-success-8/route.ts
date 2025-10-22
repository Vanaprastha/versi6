import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
);

function numericScore(value: number, max: number): number {
  if (typeof value !== "number" || isNaN(value)) return 0;
  return Math.min(1, value / max) * 100;
}

function categoryScore(key: string, value: any): number {
  if (value === null || value === undefined) return 0;
  const v = String(value).toLowerCase().trim();

  switch (key) {
    case "r403a": // sumber penghasilan
      if (v.includes("industri") || v.includes("jasa") || v.includes("perdagangan")) return 100;
      if (v.includes("pertanian")) return 85; // lebih tinggi karena dominan sektor pertanian
      return 50;

    case "r1207a": // fasilitas KUR
      return v.includes("ada") ? 100 : 0;

    default:
      return 0;
  }
}

async function calculateSdg8Success(data: any[]): Promise<number> {
  const total: number[] = [];
  for (const row of data) {
    const scores: number[] = [];

    scores.push(numericScore(row["r1403a"], 2)); // BUMDes ideal 2
    scores.push(numericScore(row["r1201a8"], 5)); // industri mikro ideal 5
    scores.push(numericScore(row["r510b5k4"], 1)); // waduk wisata ideal 1
    scores.push(categoryScore("r403a", row["r403a"])); // penghasilan
    scores.push(categoryScore("r1207a", row["r1207a"])); // KUR

    const valid = scores.filter((s) => !isNaN(s));
    if (valid.length > 0) total.push(valid.reduce((a, b) => a + b, 0) / valid.length);
  }

  const overall =
    total.length > 0 ? total.reduce((a, b) => a + b, 0) / total.length : 0;

  return parseFloat(overall.toFixed(2));
}

export async function GET(): Promise<Response> {
  try {
    const { data: rows, error } = await supabase.from("sdgs_8").select("*");
    if (error) throw new Error(error.message);

    const successPercentage = rows?.length ? await calculateSdg8Success(rows) : 0;

    return new Response(
      JSON.stringify({ goalNo: 8, successPercentage }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in sdg-success-8:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

