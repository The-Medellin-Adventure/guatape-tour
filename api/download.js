import B2 from "backblaze-b2";

/**
 * Proxy entre Vercel y Backblaze que evita errores CORS
 * y permite reproducir videos directamente en el navegador.
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

    // 🔐 Autoriza cuenta
    await b2.authorize();

    // 🔹 Construye URL directa en el endpoint nativo B2
    const baseUrl = b2.downloadUrl; // ejemplo: https://f005.backblazeb2.com
    const url = `${baseUrl}/file/guatape-travel/${encodeURIComponent(file)}`;

    // 🔹 Descarga el archivo desde Backblaze
    const fetchRes = await fetch(url, {
      headers: { Authorization: b2.authorizationToken },
    });

    if (!fetchRes.ok) {
      console.error("❌ Backblaze response:", fetchRes.status, fetchRes.statusText);
      return res
        .status(fetchRes.status)
        .json({ error: `Backblaze responded ${fetchRes.status}` });
    }

    // 🔹 Copia encabezados útiles
    res.setHeader(
      "Content-Type",
      fetchRes.headers.get("content-type") || "video/mp4"
    );
    res.setHeader("Cache-Control", "public, max-age=3600");

    // 🔹 Reenvía el stream directamente
    const reader = fetchRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();

    console.log("✅ Archivo enviado:", file);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}

  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
