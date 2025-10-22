export async function GET(): Promise<Response> {
  // TODO: Tambahkan logika perhitungan keberhasilan SDG ini
  // Gunakan Supabase query sesuai tabel sdgs_14
  return new Response(
    JSON.stringify({ goalNo: 14, successPercentage: 0 }),
    { status: 200 }
  );
}
