// index.js — reemplaza todo con esto (minimal, robusto y práctico)

// Helper: pide la URL al endpoint y devuelve downloadUrl o lanza error con mensaje legible
async function getDownloadUrl(file) {
  const res = await fetch(`/api/download?file=${encodeURIComponent(file)}`);
  const text = await res.text();
  // intenta parsear JSON si es JSON; si no, usar texto como mensaje de error
  try {
    const j = JSON.parse(text);
    if (j.downloadUrl) return j.downloadUrl;
    throw new Error(j.error || JSON.stringify(j));
  } catch (err) {
    // si text era JSON inválido o texto de error, informarlo
    // si la respuesta era vacía o no tiene downloadUrl, lanzar con el body
    throw new Error(text || err.message || "Respuesta inesperada de la API");
  }
}

// Crear (o actualizar) un elemento <video id="assetId"> dentro de <a-assets>
function createOrUpdateVideoAsset(assetId, url, opts = {}) {
  const assets = document.querySelector("a-assets") || document.createElement("a-assets");
  if (!document.querySelector("a-assets")) document.querySelector("a-scene").appendChild(assets);

  let vid = document.getElementById(assetId);
  if (!vid) {
    vid = document.createElement("video");
    vid.id = assetId;
    // atributos importantes para reproducción en móviles/VR
    vid.setAttribute("playsinline", "");
    vid.setAttribute("webkit-playsinline", "");
    vid.setAttribute("crossorigin", "anonymous");
    vid.muted = !!opts.muted; // muted true ayuda al autoplay
    vid.loop = !!opts.loop;
    assets.appendChild(vid);
  }

  // Asignar src y forzar re-load
  if (vid.src !== url) {
    vid.src = url;
    vid.load();
  }
  return vid;
}

// Asegura que exista una cámara con cursor (para poder clicar hotspots)
function ensureCameraAndCursor() {
  const scene = document.querySelector("a-scene");
  if (!scene) return;

  // si ya hay cámara, agregar cursor dentro si no existe
  const existingCam = scene.querySelector("[camera]");
  if (existingCam) {
    if (!existingCam.querySelector("[cursor]")) {
      const cursor = document.createElement("a-entity");
      cursor.setAttribute("cursor", "rayOrigin: mouse");
      cursor.setAttribute("raycaster", "objects: .hotspot");
      existingCam.appendChild(cursor);
    }
    return;
  }

  // crear rig + cam + cursor
  const rig = document.createElement("a-entity");
  rig.setAttribute("id", "rig");
  const cam = document.createElement("a-entity");
  cam.setAttribute("camera", "");
  cam.setAttribute("position", "0 1.6 0");
  const cursor = document.createElement("a-entity");
  cursor.setAttribute("cursor", "rayOrigin: mouse");
  cursor.setAttribute("raycaster", "objects: .hotspot");
  cam.appendChild(cursor);
  rig.appendChild(cam);
  scene.appendChild(rig);
}

// Muestra la información en el panel HTML ya existente (#infoPanel)
function mostrarInfo(titulo, texto) {
  const panel = document.getElementById("infoPanel");
  if (!panel) return alert(`${titulo}\n\n${texto}`); // fallback simple
  document.getElementById("infoTitulo").textContent = titulo;
  document.getElementById("infoTexto").textContent = texto;
  panel.style.display = "block";
}

// Cerrar info
function cerrarInfo() {
  const panel = document.getElementById("infoPanel");
  if (panel) panel.style.display = "none";
}

// Mostrar la escena: carga assets, pone videosphere y hotspots
async function mostrarEscenaSimple(sceneObj) {
  try {
    // obtener URLs seguras desde la API
    const mainUrl = await getDownloadUrl(sceneObj.archivo);
    const lateralUrl = sceneObj.lateralVideo ? await getDownloadUrl(sceneObj.lateralVideo) : null;

    // crear/actualizar assets
    const mainAssetId = `video-asset-${sceneObj.id}`;
    const mainVid = createOrUpdateVideoAsset(mainAssetId, mainUrl, { muted: true, loop: true });

    // asignar a videosphere (usamos asset selector '#id')
    const sphere = document.querySelector("a-videosphere");
    if (!sphere) throw new Error("No se encontró <a-videosphere> en index.html");
    sphere.setAttribute("src", `#${mainAssetId}`);

    // intentar reproducir (si autoplay bloqueado, el usuario debe interactuar)
    try { await mainVid.play(); } catch (e) { console.log("Autoplay bloqueado para video360 — toca la pantalla para iniciar audio/reproducción."); }

    // lateral: hay un <video id="videoLateral"> en tu HTML
    const lateralEl = document.getElementById("videoLateral");
    if (lateralUrl && lateralEl) {
      lateralEl.src = lateralUrl;
      lateralEl.muted = true; // para permitir autoplay en algunos navegadores
      lateralEl.loop = true;
      lateralEl.load();
      try { await lateralEl.play(); } catch(e) { /* fallback: usuario inicia */ }
      document.getElementById("videoLateralContainer").style.display = "block";
    } else if (lateralEl) {
      document.getElementById("videoLateralContainer").style.display = "none";
    }

    // remover hotspots previos
    document.querySelectorAll(".hotspot").forEach(h => h.remove());

    // crear hotspots simples (esferas con clase .hotspot)
    if (sceneObj.hotspots && Array.isArray(sceneObj.hotspots)) {
      sceneObj.hotspots.forEach(hs => {
        const ent = document.createElement("a-entity");
        ent.classList.add("hotspot");
        ent.setAttribute("geometry", "primitive: sphere; radius: 0.06");
        ent.setAttribute("material", "shader: flat; color: #ffd166; emissive: #ffd166");
        ent.setAttribute("position", hs.posicion);
        // Hacemos que el click funcione con mouse y con controllers
        ent.addEventListener("click", () => mostrarInfo(hs.titulo, hs.texto));
        ent.addEventListener("mouseenter", () => { /* opcional: animación */ });
        document.querySelector("a-scene").appendChild(ent);
      });
    }

    console.log("✅ Escena cargada:", sceneObj.nombre);
  } catch (err) {
    console.error("❌ Error cargando escena:", err.message || err);
    // mostrar mensaje breve al usuario en consola y en pantalla (si quieres)
    alert("No se pudo cargar el video. Revisa la API /api/download o las variables en Vercel.");
  }
}

// Inicialización mínima al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  ensureCameraAndCursor();

  // validar estructura mínima
  if (!window.TOUR_DATA || !Array.isArray(window.TOUR_DATA.escenas) || window.TOUR_DATA.escenas.length === 0) {
    console.error("No hay escenas en data.js");
    return;
  }

  // cargar la primera escena
  const primera = window.TOUR_DATA.escenas[0];
  mostrarEscenaSimple(primera);
});
