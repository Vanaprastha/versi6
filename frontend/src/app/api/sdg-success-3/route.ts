export async function GET(): Promise<Response> {
  // TODO: Tambahkan logika perhitungan keberhasilan SDG ini
  // Gunakan Supabase query sesuai tabel sdgs_3
  return new Response(
    JSON.stringify({ goalNo: 3, successPercentage: 0 }),
    { status: 200 }
  );
}
