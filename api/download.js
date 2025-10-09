// /api/download.js
import B2 from "backblaze-b2";

export default async function handler(req, res) {
  try {
    const file = req.query.file;
    if (!file) return res.status(400).send("Missing file query param");

    const b2 = new B2({
      applicationKeyId: process.env.B2_KEY_ID,
      applicationKey: process.env.B2_APP_KEY,
    });

    await b2.authorize();

    const auth = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_ID,
      fileNamePrefix: file,
      validDurationInSeconds: 3600, // 1 hora
    });

    const token = auth.data.authorizationToken;
    const bucket = process.env.B2_BUCKET_NAME;

    const downloadUrl = `https://f005.backblazeb2.com/file/${bucket}/${encodeURIComponent(file)}?Authorization=${token}`;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(302, { Location: downloadUrl });
    res.end();
  } catch (err) {
    console.error("Error in /api/download:", err);
    res.status(500).send("Error generating download URL");
  }
}