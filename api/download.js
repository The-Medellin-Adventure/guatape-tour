import B2 from "backblaze-b2";

/**
 * Descarga un archivo de Backblaze y lo reenvía al navegador
 * sin problemas de CORS ni dependencias de stream.
 */
export default async function handler(req, res) {
  try {
    const { file } = req.query;
    if (!file) {
      return res.status(400).json({ error: "Missing file name" });
    }

    const b2 = new B2({
      applicationKeyId: process.env.B2_KEY_ID,
      applicationKey: process.env.B2_APP_KEY,
    });

    await b2.authorize();

    const baseUrl = b2.downloadUrl;
    const url = `${baseUrl}/file/guatape-travel/${encodeURIComponent(file)}`;

    const response = await fetch(url, {
      headers: { Authorization: b2.authorizationToken },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backblaze error:", response.status, text);
      return res
        .status(response.status)
        .json({ error: `Backblaze ${response.status}`, message: text });
    }

    const arrayBuffer = await response.arrayBuffer();

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "video/mp4"
    );
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(Buffer.from(arrayBuffer));

    console.log("✅ Archivo enviado correctamente:", file);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
