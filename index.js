import tourData from "./data.js";

// === Elementos del DOM ===
const escena = tourData.escenas[0];
const video360 = document.getElementById("video360");
const lateralVideo = document.getElementById("lateralVideo");
const hotspotContainer = document.getElementById("hotspot-container");
const infoTitulo = document.getElementById("info-titulo");
const infoDescripcion = document.getElementById("info-descripcion");
const lateralPanel = document.getElementById("lateral-panel");
const closePanel = document.getElementById("close-panel");

const camaraBtn = document.getElementById("camara-btn");
const galleryModal = document.getElementById("gallery-modal");
const galleryImage = document.getElementById("gallery-image");
const prevGallery = document.getElementById("prev-gallery");
const nextGallery = document.getElementById("next-gallery");
const closeGallery = document.getElementById("close-gallery");

// === Inicialización ===
video360.src = escena.archivo;
lateralVideo.src = escena.lateralVideo;

// === Hotspots ===
escena.hotspots.forEach(hs => {
  const hotspot = document.createElement("div");
  hotspot.className = "hotspot";
  hotspot.textContent = "ℹ️";
  
  // Ajuste de posición aproximada en porcentaje
  hotspot.style.left = `${50 + hs.x * 10}%`;
  hotspot.style.top = `${50 - hs.y * 10}%`;

  hotspot.addEventListener("click", () => {
    infoTitulo.textContent = hs.titulo;
    infoDescripcion.textContent = hs.descripcion;
    lateralPanel.classList.add("visible");
  });

  hotspotContainer.appendChild(hotspot);
});

// Cerrar panel lateral
closePanel.addEventListener("click", () => {
  lateralPanel.classList.remove("visible");
});

// === Galería de cámara ===
const galleryImages = [
  "images/imagen1.jpg",
  "images/imagen2.jpg"
];
let currentGalleryIndex = 0;

function showGallery(index) {
  galleryImage.style.transform = "scale(0.9)";
  setTimeout(() => {
    galleryImage.src = galleryImages[index];
    galleryImage.style.transform = "scale(1)";
  }, 150);
}

camaraBtn.addEventListener("click", () => {
  currentGalleryIndex = 0;
  showGallery(currentGalleryIndex);
  galleryModal.classList.add("visible");
  galleryModal.classList.remove("hidden");
});

prevGallery.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  showGallery(currentGalleryIndex);
});

nextGallery.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  showGallery(currentGalleryIndex);
});

closeGallery.addEventListener("click", () => {
  galleryModal.classList.remove("visible");
  setTimeout(() => galleryModal.classList.add("hidden"), 300);
});
