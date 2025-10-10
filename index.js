import tourData from "./data.js";

const escena = tourData.escenas[0];

// Video principal 360° y lateral
const videoMain = document.getElementById("video-main");
const videoLateral = document.getElementById("video-lateral");

videoMain.src = escena.archivo;
videoLateral.src = escena.lateralVideo;

// Hotspot container
const hotspotContainer = document.getElementById("hotspot-container");

// Panel info
const infoPanel = document.getElementById("info-panel");
const hotspotTitle = document.getElementById("hotspot-title");
const hotspotDescription = document.getElementById("hotspot-description");
const closeInfo = document.getElementById("close-info");

// Icono de cámara y overlay
const camaraIcon = document.getElementById("camara-icon");
const galleryOverlay = document.getElementById("gallery-overlay");
const galleryImage = document.getElementById("gallery-image");
const prevGallery = document.getElementById("prev-gallery");
const nextGallery = document.getElementById("next-gallery");
const closeGallery = document.getElementById("close-gallery");

// Crear hotspots flotantes
escena.hotspots.forEach((hs,index)=>{
  const hotspot = document.createElement("div");
  hotspot.classList.add("hotspot");

  const icon = document.createElement("img");
  icon.src = "img/info.png";

  const label = document.createElement("span");
  label.textContent = hs.titulo;

  hotspot.appendChild(icon);
  hotspot.appendChild(label);

  // Posición inicial flotante
  hotspot.style.top = `${10 + index*70}px`;
  hotspot.style.left = `20px`;

  hotspot.addEventListener("click",()=>{
    hotspotTitle.textContent = hs.titulo;
    hotspotDescription.textContent = hs.descripcion;
    infoPanel.classList.remove("hidden");
  });

  hotspotContainer.appendChild(hotspot);
});

// Cerrar info
closeInfo.addEventListener("click",()=> infoPanel.classList.add("hidden"));

// Galería de cámara
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

prevGallery.addEventListener("click",()=>{
  currentGalleryIndex = (currentGalleryIndex-1+galleryImages.length)%galleryImages.length;
  showGallery(currentGalleryIndex);
});
nextGallery.addEventListener("click",()=>{
  currentGalleryIndex = (currentGalleryIndex+1)%galleryImages.length;
  showGallery(currentGalleryIndex);
});
closeGallery.addEventListener("click",()=>{
  galleryOverlay.classList.remove("visible");
  setTimeout(()=>galleryOverlay.classList.add("hidden"),300);
});
