export async function GET(): Promise<Response> {
  // TODO: Tambahkan logika perhitungan keberhasilan SDG ini
  // Gunakan Supabase query sesuai tabel sdgs_4
  return new Response(
    JSON.stringify({ goalNo: 4, successPercentage: 0 }),
    { status: 200 }
  );
}
