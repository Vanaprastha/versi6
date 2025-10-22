export async function GET(request: Request): Promise<Response> {
  try {
    // Ambil origin dari request (mis. https://versi6.vercel.app)
    const url = new URL(request.url);
    const base = `${url.protocol}//${url.host}`;

    // Panggil endpoint SDG 1 dan SDG 2 secara paralel
    const [res1, res2] = await Promise.all([
      fetch(`${base}/api/sdg-success-1`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-2`, { cache: "no-store" }),
    ]);

    // Parse hasil JSON
    const sdg1 = await res1.json();
    const sdg2 = await res2.json();

    // Gabungkan hasil ke dalam satu array
    const result = [sdg1, sdg2];

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    console.error("Aggregator error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

