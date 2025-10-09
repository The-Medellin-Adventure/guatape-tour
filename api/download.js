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

    // Generar enlace temporal válido para buckets privados
    const auth = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_ID,
      fileNamePrefix: file,
      validDurationInSeconds: 3600, // 1 hora
    });

    const token = auth.data.authorizationToken;
    const bucketName = process.env.B2_BUCKET_NAME;
    const baseUrl = "https://f005.backblazeb2.com";
    const url = `${baseUrl}/file/${bucketName}/${encodeURIComponent(file)}?Authorization=${token}`;

    res.status(200).json({ downloadUrl: url });
  } catch (err) {
    console.error("❌ Error en /api/download:", err.message);
    res.status(500).json({ error: err.message });
  }
}
