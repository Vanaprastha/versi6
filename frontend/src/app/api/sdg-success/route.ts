export async function GET(request: Request): Promise<Response> {
  try {
    // Ambil origin (contoh: https://versi6.vercel.app)
    const url = new URL(request.url);
    const base = `${url.protocol}//${url.host}`;

    // 🔗 Panggil endpoint SDG 1, SDG 2, dan SDG 3 secara paralel
    const [res1, res2, res3] = await Promise.all([
      fetch(`${base}/api/sdg-success-1`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-2`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-3`, { cache: "no-store" }),
    ]);

    // 🧩 Parse hasil JSON dari masing-masing SDG
    const sdg1 = await res1.json();
    const sdg2 = await res2.json();
    const sdg3 = await res3.json();

    // 📦 Gabungkan semua hasil ke dalam satu array
    const result = [sdg1, sdg2, sdg3];

    // 🔁 Kembalikan response JSON
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    console.error("Aggregator error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

