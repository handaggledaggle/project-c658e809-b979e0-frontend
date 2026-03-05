export const runtime = "nodejs";

function escapeCsv(v: string) {
  const needs = /[\n\r\",]/.test(v);
  const s = v.replaceAll('"', '""');
  return needs ? `"${s}"` : s;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "artwork";
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "ALL";

  // MVP: 실제로는 검색 조건으로 DB 조회 결과를 CSV로 직렬화.
  const rows = [
    ["type", "query", "status", "exported_at"],
    [type, q, status, new Date().toISOString()],
  ];

  const csv = rows.map((r) => r.map((c) => escapeCsv(String(c))).join(",")).join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=admin_export_${type}.csv`,
      "Cache-Control": "no-store",
    },
  });
}
