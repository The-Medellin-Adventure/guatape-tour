import B2 from "backblaze-b2";

export default async function handler(req, res) {
  try {
    const { file } = req.query;
    if (!file) return res.status(400).json({ error: "Missing file name" });

    console.log("📦 Solicitando archivo:", file);

    const b2 = new B2({
      applicationKeyId: process.env.B2_KEY_ID,
      applicationKey: process.env.B2_APP_KEY,
    });

    await b2.authorize();
    console.log("🔐 Autorizado con Backblaze.");

    const auth = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_ID,
      fileNamePrefix: file,
      validDurationInSeconds: 2592000,
    });

    const token = auth.data.authorizationToken;
    const baseUrl = "https://guatape-travel.s3.us-east-005.backblazeb2.com";
    const url = `${baseUrl}/${encodeURIComponent(file)}?Authorization=${token}`;

    console.log("✅ URL generada:", url);
    return res.status(200).json({ downloadUrl: url });
  } catch (err) {
    console.error("❌ Error en descarga Backblaze:", err);
    res.status(500).json({ error: err.message });
  }
}
