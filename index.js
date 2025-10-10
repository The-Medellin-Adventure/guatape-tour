import tourData from "./data.js";

const escena = tourData.escenas[0];
const video360 = document.getElementById("video360");
const lateralVideo = document.getElementById("lateral-video");
const sidebarTitle = document.getElementById("sidebar-title");
const hotspotContainer = document.getElementById("hotspot-container");
const scene = document.getElementById("scene");

// === Configuración inicial ===
video360.src = escena.archivo;
lateralVideo.src = escena.lateralVideo;
sidebarTitle.textContent = escena.titulo;

// === Reproducción automática segura ===
async function playVideo() {
  try {
    await video360.play();
    console.log("🎥 Video 360° reproduciéndose correctamente");
  } catch (err) {
    console.warn("⚠️ Autoplay bloqueado:", err);
  }
}
window.addEventListener("load", playVideo);
document.body.addEventListener("click", playVideo);
document.getElementById("enter-vr").addEventListener("click", playVideo);

// === Crear hotspots dinámicamente ===
escena.hotspots.forEach((hs) => {
  const icon = hs.tipo === "camara" ? "#icon-camara" : "#icon-info";

  const hotspot = document.createElement("a-image");
  hotspot.setAttribute("src", icon);
  hotspot.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
  hotspot.setAttribute("width", "0.4");
  hotspot.setAttribute("height", "0.4");
  hotspot.setAttribute("look-at", "[camera]");
  hotspot.setAttribute("class", "clickable");

  // Panel con fondo y texto
  const panel = document.createElement("a-plane");
  panel.setAttribute("position", `${hs.x} ${hs.y + 0.6} ${hs.z}`);
  panel.setAttribute("width", "2");
  panel.setAttribute("height", "0.8");
  panel.setAttribute("material", "color: #000; opacity: 0.6;");
  panel.setAttribute("visible", "false");
  panel.setAttribute("look-at", "[camera]");

  const texto = document.createElement("a-text");
  texto.setAttribute("value", `${hs.titulo}\n${hs.descripcion}`);
  texto.setAttribute("align", "center");
  texto.setAttribute("color", "#fff");
  texto.setAttribute("width", "1.8");
  texto.setAttribute("wrap-count", "40");
  texto.setAttribute("position", "0 0 0.01");

  panel.appendChild(texto);

  hotspot.addEventListener("click", () => {
    const visible = panel.getAttribute("visible");
    panel.setAttribute("visible", !visible);
  });

  hotspotContainer.appendChild(hotspot);
  hotspotContainer.appendChild(panel);
});

