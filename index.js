import tourData from "./data.js";

const escena = tourData.escenas[0];
const video360 = document.getElementById("video360");
const lateralVideo = document.getElementById("lateral-video");
const hotspotContainer = document.getElementById("hotspot-container");
const infoTitulo = document.getElementById("info-titulo");
const infoDescripcion = document.getElementById("info-descripcion");
const hotspotTitle = document.getElementById("hotspot-title");
const hotspotDesc = document.getElementById("hotspot-desc");
const camaraBtn = document.getElementById("camara-btn");
const galleryModal = document.getElementById("gallery-modal");
const closeGallery = document.getElementById("close-gallery");
const exitVR = document.getElementById("exit-vr");
const scene = document.getElementById("scene");

// === Inicialización ===
video360.src = escena.archivo;
lateralVideo.src = escena.lateralVideo;
document.getElementById("scene-title").textContent = escena.titulo;

// === Autoplay ===
window.addEventListener("load", () => {
  video360.play().catch(() => console.warn("Autoplay bloqueado."));
});

// === Hotspots ===
escena.hotspots.forEach((hs) => {
  const hotspot = document.createElement("a-image");
  hotspot.setAttribute("src", "#icon-info");
  hotspot.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
  hotspot.setAttribute("width", "0.4");
  hotspot.setAttribute("height", "0.4");
  hotspot.setAttribute("look-at", "[camera]");
  hotspot.setAttribute("class", "clickable");

  hotspot.addEventListener("click", () => {
    hotspotTitle.textContent = hs.titulo;
    hotspotDesc.textContent = hs.descripcion;
    infoTitulo.textContent = hs.titulo;
    infoDescripcion.textContent = hs.descripcion;
  });

  hotspotContainer.appendChild(hotspot);
});

// === Botón cámara (abre galería flotante) ===
camaraBtn.addEventListener("click", () => {
  galleryModal.classList.remove("hidden");
});

closeGallery.addEventListener("click", () => {
  galleryModal.classList.add("hidden");
});

// === Salir de VR ===
exitVR.addEventListener("click", () => {
  scene.exitVR();
});
