import B2 from "backblaze-b2";

/**
 * Proxy seguro entre Vercel y Backblaze.
 * Descarga el archivo desde Backblaze y lo reenvía al navegador.
 */
export default async function handler(req, res) {
  try {
    const { file } = req.query;
    if (!file) return res.status(400).json({ error: "Missing file name" });

    const b2 = new B2({
      applicationKeyId: process.env.B2_KEY_ID,
      applicationKey: process.env.B2_APP_KEY,
    });

    await b2.authorize();

    // 🔹 obtiene información del archivo
    const response = await b2.getFileInfo({
      bucketId: process.env.B2_BUCKET_ID,
      fileName: file,
    });

    const baseUrl = b2.downloadUrl;
    const url = `${baseUrl}/file/guatape-travel/${encodeURIComponent(file)}`;

    // 🔹 descarga el archivo desde Backblaze
    const fetchRes = await fetch(url, {
      headers: { Authorization: b2.authorizationToken },
    });

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).json({
        error: `Backblaze responded ${fetchRes.status}`,
      });
    }

    // 🔹 reenvía el stream al navegador
    res.setHeader(
      "Content-Type",
      fetchRes.headers.get("content-type") || "video/mp4"
    );
    res.setHeader("Cache-Control", "public, max-age=3600");

    const reader = fetchRes.body.getReader();
    const encoder = new TextEncoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
