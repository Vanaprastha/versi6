export async function GET(request: Request): Promise<Response> {
  try {
    // Ambil origin (https://versi6.vercel.app) dari request
    const url = new URL(request.url);
    const base = `${url.protocol}//${url.host}`;

    // Panggil endpoint SDG 1 di server yang sama
    const res = await fetch(`${base}/api/sdg-success-1`, { cache: "no-store" });
    const sdg1 = await res.json();

    return new Response(JSON.stringify([sdg1]), { status: 200 });
  } catch (err: any) {
    console.error("Aggregator error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
