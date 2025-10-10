import tourData from "./data.js";

// === Elementos del DOM ===
const escena = tourData.escenas[0];
const video360 = document.getElementById("video360");
const lateralVideo = document.getElementById("lateralVideo");
const infoTitulo = document.getElementById("info-titulo");
const infoDescripcion = document.getElementById("info-descripcion");

const infoIcons = document.querySelectorAll(".info-icon");
const camaraIcon = document.getElementById("camara-icon");

const galleryOverlay = document.getElementById("gallery-overlay");
const galleryImage = document.getElementById("gallery-image");
const prevGallery = document.getElementById("prev-gallery");
const nextGallery = document.getElementById("next-gallery");
const closeGallery = document.getElementById("close-gallery");

// === Inicialización ===
video360.src = escena.archivo;
lateralVideo.src = escena.lateralVideo;

// === Info Icons ===
infoIcons.forEach((icon, index) => {
  const hs = escena.hotspots[index];
  icon.addEventListener("click", () => {
    infoTitulo.textContent = hs.titulo;
    infoDescripcion.textContent = hs.descripcion;
  });
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

// Abrir overlay al hacer clic en icono de cámara
camaraIcon.addEventListener("click", () => {
  currentGalleryIndex = 0;
  showGallery(currentGalleryIndex);
  galleryOverlay.classList.add("visible");
  galleryOverlay.classList.remove("hidden");
});

// Navegación del carrusel
prevGallery.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  showGallery(currentGalleryIndex);
});
nextGallery.addEventListener("click", () => {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  showGallery(currentGalleryIndex);
});

// Cerrar overlay
closeGallery.addEventListener("click", () => {
  galleryOverlay.classList.remove("visible");
  setTimeout(() => galleryOverlay.classList.add("hidden"), 300);
});
