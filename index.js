import tourData from "./data.js";

// === Elementos del DOM ===
const escena = tourData.escenas[0];
const video360 = document.getElementById("video360");
const lateralVideo = document.getElementById("lateral-video");
const hotspotContainer = document.getElementById("hotspot-container");
const infoTitulo = document.getElementById("info-titulo");
const infoDescripcion = document.getElementById("info-descripcion");
const camaraBtn = document.getElementById("camara-btn");
const galleryModal = document.getElementById("gallery-modal");
const closeGallery = document.getElementById("close-gallery") || document.getElementById("close-gallery");
const galleryImage = document.getElementById("gallery-image");
const prevGallery = document.getElementById("prev-gallery");
const nextGallery = document.getElementById("next-gallery");

// === Inicialización ===
video360.src = escena.archivo;
document.getElementById("scene-title")?.textContent = escena.titulo;

// === Hotspots ===
escena.hotspots.forEach(hs => {
  const hotspot = document.createElement("div");
  hotspot.className = "hotspot";
  hotspot.textContent = "ℹ️";
  hotspot.style.position = "absolute";
  hotspot.style.left = `${hs.x}%`;
  hotspot.style.top = `${hs.y}%`;
  hotspot.style.cursor = "pointer";
  hotspot.style.fontSize = "24px";

  hotspot.addEventListener("click", () => {
    infoTitulo.textContent = hs.titulo;
    infoDescripcion.textContent = hs.descripcion;
  });

  hotspotContainer.appendChild(hotspot);
});

// === Galería de cámara ===
const galleryImages = [
  "images/imagen1.jpg",
  "images/imagen2.jpg"
];
let currentGalleryIndex = 0;

camaraBtn.addEventListener("click", () => {
  currentGalleryIndex = 0;
  galleryImage.src = galleryImages[currentGalleryIndex];
  galleryModal.classList.remove("hidden");
});

prevGallery.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  galleryImage.src = galleryImages[currentGalleryIndex];
});

nextGallery.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  galleryImage.src = galleryImages[currentGalleryIndex];
});

closeGallery.addEventListener("click", () => {
  galleryModal.classList.add("hidden");
});
