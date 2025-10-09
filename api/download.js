import B2 from "backblaze-b2";

export default async function handler(req, res) {
  try {
    const { file } = req.query;
    if (!file) return res.status(400).json({ error: "Missing file name" });

    const b2 = new B2({
      applicationKeyId: process.env.B2_KEY_ID,
      applicationKey: process.env.B2_APP_KEY,
    });

    await b2.authorize();

    // obtener enlace directo (sin token)
    const bucketName = process.env.B2_BUCKET_NAME;
    const baseUrl = "https://f005.backblazeb2.com";
    const fileUrl = `${baseUrl}/file/${bucketName}/${encodeURIComponent(file)}`;

    // comprobar si el archivo existe
    const headResp = await fetch(fileUrl, { method: "HEAD" });
    if (!headResp.ok) throw new Error(`File not found: ${fileUrl}`);

    res.status(200).json({ downloadUrl: fileUrl });
  } catch (err) {
    console.error("❌ Error en /api/download:", err.message);
    res.status(500).json({ error: err.message });
  }
}
