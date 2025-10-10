import tourData from "./data.js";

// === Elementos del DOM ===
const escena = tourData.escenas[0];
const video360 = document.getElementById("video360");
const lateralVideo = document.getElementById("lateralVideo");

const hotspotContainer = document.getElementById("hotspot-container");
const infoPanel = document.getElementById("info-panel");
const hotspotTitulo = document.getElementById("hotspot-titulo");
const hotspotDesc = document.getElementById("hotspot-descripcion");
const closeInfo = document.getElementById("close-info");

const camaraIcon = document.getElementById("camara-icon");
const galleryOverlay = document.getElementById("gallery-overlay");
const galleryImage = document.getElementById("gallery-image");
const prevGallery = document.getElementById("prev-gallery");
const nextGallery = document.getElementById("next-gallery");
const closeGallery = document.getElementById("close-gallery");

// === Inicialización ===
video360.src = escena.archivo;
lateralVideo.src = escena.lateralVideo;

// === Hotspots 360° ===
escena.hotspots.forEach(hs => {
  const hotspot = document.createElement("a-entity");

  hotspot.setAttribute("geometry", { primitive: "plane", height: 0.5, width: 1 });
  hotspot.setAttribute("material", { color: "#ff9900", opacity: 0.8 });
  hotspot.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
  hotspot.setAttribute("look-at", "[camera]");
  hotspot.setAttribute("class", "clickable");

  // Texto del hotspot
  const text = document.createElement("a-text");
  text.setAttribute("value", hs.titulo);
  text.setAttribute("align", "center");
  text.setAttribute("color", "#fff");
  text.setAttribute("position", "0 0 0.01");
  hotspot.appendChild(text);

  hotspot.addEventListener("click", () => {
    hotspotTitulo.textContent = hs.titulo;
    hotspotDesc.textContent = hs.descripcion;
    infoPanel.classList.remove("hidden");
  });

  hotspotContainer.appendChild(hotspot);
});

// Cerrar tarjeta de información
closeInfo.addEventListener("click", () => {
  infoPanel.classList.add("hidden");
});

// === Galería de cámara ===
const galleryImages = ["images/imagen1.jpg","images/imagen2.jpg"];
let currentGalleryIndex = 0;

function showGallery(index){
  galleryImage.style.transform = "scale(0.9)";
  setTimeout(()=>{
    galleryImage.src = galleryImages[index];
    galleryImage.style.transform = "scale(1)";
  },150);
}

camaraIcon.addEventListener("click",()=>{
  currentGalleryIndex = 0;
  showGallery(currentGalleryIndex);
  galleryOverlay.classList.add("visible");
  galleryOverlay.classList.remove("hidden");
});

prevGallery.addEventListener("click", ()=>{
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  showGallery(currentGalleryIndex);
});

nextGallery.addEventListener("click", ()=>{
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  showGallery(currentGalleryIndex);
});

closeGallery.addEventListener("click", ()=>{
  galleryOverlay.classList.remove("visible");
  setTimeout(()=>galleryOverlay.classList.add("hidden"),300);
});
