export async function GET(): Promise<Response> {
  // TODO: Tambahkan logika perhitungan keberhasilan SDG ini
  // Gunakan Supabase query sesuai tabel sdgs_13
  return new Response(
    JSON.stringify({ goalNo: 13, successPercentage: 0 }),
    { status: 200 }
  );
}
