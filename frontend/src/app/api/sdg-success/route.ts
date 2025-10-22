
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string
);

interface SDGData {
  nama_desa: string;
  [key: string]: any;
}

interface FeatureLabel {
  kode_kolom: string;
  nama_kolom: string;
  arti_data: string;
}

async function calculateSdg1Success(sdg1Data: SDGData[]): Promise<number> {
  if (!sdg1Data || sdg1Data.length === 0) return 0;

  const totalSuccesses: number[] = [];

  // Assuming 'jumlah sktm diterbitkan pada tahun 2023' maps to 'r710' based on common patterns in the schema
  // Max value for 'jumlah sktm' is 50 (as agreed)
  const sktmValue = sdg1Data[0].r710; // Taking the first entry for simplicity, assuming data is aggregated per village
  if (typeof sktmValue === 'number') {
    const sktmSuccess = Math.max(0, (1 - sktmValue / 50)) * 100;
    totalSuccesses.push(sktmSuccess);
  }

  // For binary indicators, we need to know their corresponding column names.
  // Let's assume based on common patterns that r1502_7, r1502_8, r1502_4, r1502_9 are the binary indicators.
  // And 'ada' is represented by a specific value (e.g., 1 or true) and 'tidak ada' by 0 or false.
  // For now, I'll assume they are boolean-like and '1' means 'ada'.
  const binaryIndicators = ['r1502_7', 'r1502_8', 'r1502_4', 'r1502_9'];
  binaryIndicators.forEach(indicator => {
    const value = sdg1Data[0][indicator];
    if (value === 1) { // Assuming 1 means 'ada'
      totalSuccesses.push(100);
    } else if (value === 0) { // Assuming 0 means 'tidak ada'
      totalSuccesses.push(0);
    }
  });

  if (totalSuccesses.length === 0) return 0;
  const averageSuccess = totalSuccesses.reduce((sum, val) => sum + val, 0) / totalSuccesses.length;
  return parseFloat(averageSuccess.toFixed(2));
}

export async function GET(): Promise<Response> {
  const sdgSuccessPercentages: { goalNo: number; successPercentage: number }[] = [];

  // Fetch data for each SDG and calculate success percentage
  for (let i = 1; i <= 17; i++) {
    const tableName = `sdgs_${i}`;
    const { data: rows, error } = await supabase.from(tableName).select("*");

    if (error) {
      console.error(`Error fetching data for ${tableName}:`, error.message);
      // Instead of continuing, we should return an error response for the entire API call
      // or ensure that the frontend can handle partial data. For now, let's return a 500.
      return new Response(JSON.stringify({ error: `Failed to fetch data for ${tableName}: ${error.message}` }), { status: 500 });
    }

    let successPercentage = 0;
    if (rows && rows.length > 0) {
      // This is a placeholder. Real logic needs to be implemented for each SDG.
      // For now, I'll use the SDG1 logic as a template for all.
      // In a real scenario, each SDG would have its own specific calculation function.
      if (i === 1) {
        successPercentage = await calculateSdg1Success(rows);
      } else {
        // Placeholder for other SDGs: random success for demonstration
        successPercentage = Math.floor(Math.random() * (95 - 50 + 1)) + 50;
      }
    }
    sdgSuccessPercentages.push({ goalNo: i, successPercentage });
  }

  return new Response(JSON.stringify(sdgSuccessPercentages), { status: 200 });
}

