export async function GET(request: Request): Promise<Response> {
  try {
    // Ambil origin dari request (mis. https://versi6.vercel.app)
    const url = new URL(request.url);
    const base = `${url.protocol}//${url.host}`;

    // 🔗 Panggil semua endpoint SDG 1–6 secara paralel
    const [res1, res2, res3, res4, res5, res6] = await Promise.all([
      fetch(`${base}/api/sdg-success-1`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-2`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-3`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-4`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-5`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-6`, { cache: "no-store" }),
    ]);

    // 🧩 Parse hasil JSON dari masing-masing SDG
    const sdg1 = await res1.json();
    const sdg2 = await res2.json();
    const sdg3 = await res3.json();
    const sdg4 = await res4.json();
    const sdg5 = await res5.json();
    const sdg6 = await res6.json();

    // 📦 Gabungkan hasil ke dalam satu array
    const result = [sdg1, sdg2, sdg3, sdg4, sdg5, sdg6];

    // 🔁 Kembalikan response JSON
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    console.error("Aggregator error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

