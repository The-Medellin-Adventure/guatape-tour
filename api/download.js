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

    // token temporal válido 1 mes (30 días)
    const { data } = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_ID,
      fileNamePrefix: file,
      validDurationInSeconds: 2592000,
    });

    const token = data.authorizationToken;
    const bucketName = process.env.B2_BUCKET_NAME;

    // 🔗 Endpoint correcto (tu región)
    const baseUrl = process.env.B2_BASE_URL; // ahora apunta a s3.us-east-005
    const downloadUrl = `${baseUrl}/file/${bucketName}/${encodeURIComponent(
      file
    )}?Authorization=${token}`;

    res.status(200).json({ downloadUrl });
  } catch (err) {
    console.error("❌ Error Backblaze:", err.message);
    res.status(500).json({ error: err.message });
  }
}
