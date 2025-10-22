export async function GET(): Promise<Response> {
  // TODO: Tambahkan logika perhitungan keberhasilan SDG ini
  // Gunakan Supabase query sesuai tabel sdgs_2
  return new Response(
    JSON.stringify({ goalNo: 2, successPercentage: 0 }),
    { status: 200 }
  );
}
