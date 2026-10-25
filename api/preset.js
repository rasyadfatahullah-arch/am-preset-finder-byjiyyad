// Proxy opsional untuk Vercel / Netlify-style serverless.
// Dipakai otomatis oleh index.html kalau browser memblokir API langsung (CORS).
const TARGET = "https://api.zyvor.my.id/api/am/presetv2";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const r = await fetch(TARGET, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await r.text();
    res.status(r.status);
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (e) {
    return res.status(502).json({ error: "Upstream error", detail: String(e) });
  }
}
