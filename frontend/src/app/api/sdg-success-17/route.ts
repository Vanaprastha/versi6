import { computeSdgSuccessPercentage } from "../_utils/success";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  try {
    const table = "sdgs_17";
    const successPercentage = await computeSdgSuccessPercentage(table);
    return new Response(JSON.stringify({
      goalNo: 17,
      successPercentage
    }), { status: 200 });
  } catch (err:any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
