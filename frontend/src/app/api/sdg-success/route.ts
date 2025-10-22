export async function GET(): Promise<Response> {
  try {
    // Ambil hasil SDG 1 saja untuk sekarang
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/sdg-success-1`);
    const sdg1 = await res.json();
    return new Response(JSON.stringify([sdg1]), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
