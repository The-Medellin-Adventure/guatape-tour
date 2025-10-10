import B2 from "backblaze-b2";

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

    // 1️⃣ Autorizar cuenta
    await b2.authorize();

    // 2️⃣ Obtener la URL base de descarga
    const downloadUrl = `${b2.downloadUrl}/file/guatape-travel/${file}`;

    console.log("✅ URL directa:", downloadUrl);

    // 3️⃣ Devolver URL firmada temporal (sin token, Master Key lo permite)
    return res.status(200).json({ downloadUrl });
  } catch (err) {
    console.error("❌ Error en descarga Backblaze:", err);
    res.status(500).json({ error: err.message });
  }
}
