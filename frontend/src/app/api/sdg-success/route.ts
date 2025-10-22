export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const base = `${url.protocol}//${url.host}`;

    const [res1, res2, res3, res4, res5, res6, res7] = await Promise.all([
      fetch(`${base}/api/sdg-success-1`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-2`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-3`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-4`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-5`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-6`, { cache: "no-store" }),
      fetch(`${base}/api/sdg-success-7`, { cache: "no-store" }),
    ]);

    const sdg1 = await res1.json();
    const sdg2 = await res2.json();
    const sdg3 = await res3.json();
    const sdg4 = await res4.json();
    const sdg5 = await res5.json();
    const sdg6 = await res6.json();
    const sdg7 = await res7.json();

    const result = [sdg1, sdg2, sdg3, sdg4, sdg5, sdg6, sdg7];

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err: any) {
    console.error("Aggregator error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

