// /api/download.js
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

    // ⚙️ 1 mes = 30 días = 2,592,000 segundos
    const { data } = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_ID,
      fileNamePrefix: file,
      validDurationInSeconds: 2592000,
    });

    const authToken = data.authorizationToken;
    const bucketName = process.env.B2_BUCKET_NAME;
    const baseUrl =
      process.env.B2_BASE_URL || "https://s3.us-west-002.backblazeb2.com";

    const url = `${baseUrl}/file/${bucketName}/${encodeURIComponent(
      file
    )}?Authorization=${authToken}`;

    res.status(200).json({ downloadUrl: url });
  } catch (error) {
    console.error("❌ Error Backblaze:", error.message);
    res.status(500).json({ error: error.message });
  }
}
