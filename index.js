import tourData from "./data.js";

const escena = tourData.escenas[0];

// Video principal 360° y lateral
const videoMain = document.getElementById("video-main");
const videoLateral = document.getElementById("video-lateral");
videoMain.src = escena.archivo;
videoLateral.src = escena.lateralVideo;

// Hotspot list debajo del video lateral
const hotspotList = document.getElementById("hotspot-list");
const infoPanel = document.getElementById("info-panel");
const hotspotTitle = document.getElementById("hotspot-title");
const hotspotDescription = document.getElementById("hotspot-description");
const closeInfo = document.getElementById("close-info");

// Crear hotspots: icono + título con animación fade-in
escena.hotspots.forEach((hs, index) => {
  const item = document.createElement("div");
  item.classList.add("hotspot-item");

  const icon = document.createElement("img");
  icon.src = "img/info.png";

  const title = document.createElement("span");
  title.textContent = hs.titulo;

  item.appendChild(icon);
  item.appendChild(title);

  // Animación de aparición escalonada
  setTimeout(() => item.classList.add("show"), index * 300);

  // Mostrar info al clic
  item.addEventListener("click", () => {
    hotspotTitle.textContent = hs.titulo;
    hotspotDescription.textContent = hs.descripcion;
    infoPanel.classList.add("show");
    infoPanel.classList.remove("hidden");
  });

  hotspotList.appendChild(item);
});

// Cerrar info panel
closeInfo.addEventListener("click", () => {
  infoPanel.classList.remove("show");
  setTimeout(() => infoPanel.classList.add("hidden"), 300);
});

// Galería cámara
const camaraIcon = document.getElementById("camara-icon");
const galleryOverlay = document.getElementById("gallery-overlay");
const galleryImage = document.getElementById("gallery-image");
const prevGallery = document.getElementById("prev-gallery");
const nextGallery = document.getElementById("next-gallery");
const closeGallery = document.getElementById("close-gallery");

const galleryImages = ["images/imagen1.jpeg", "images/imagen2.jpeg"];
let currentGalleryIndex = 0;

function showGallery(index) {
  galleryImage.style.transform = "scale(0.9)";
  setTimeout(() => {
    galleryImage.src = galleryImages[index];
    galleryImage.style.transform = "scale(1)";
  }, 150);
}

camaraIcon.addEventListener("click", () => {
  currentGalleryIndex = 0;
  showGallery(currentGalleryIndex);
  galleryOverlay.classList.add("visible");
  galleryOverlay.classList.remove("hidden");
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
  galleryOverlay.classList.remove("visible");
  setTimeout(() => galleryOverlay.classList.add("hidden"), 300);
});
