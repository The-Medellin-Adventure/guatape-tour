import tourData from "./data.js";

const escena = tourData.escenas[0];

// Video principal y lateral
const videoMain = document.getElementById("video-main");
const videoLateral = document.getElementById("video-lateral");
document.getElementById("video-lateral-normal").src = escena.lateralVideo;
videoMain.src = escena.archivo;
videoLateral.src = escena.lateralVideo;

// Reproducir video principal al interactuar con la escena
function playVideos() {
  videoMain.play().catch(()=>console.log("Interacción requerida para video principal"));
}
document.querySelector("a-scene").addEventListener("click", playVideos);

// Reproducir video lateral VR al tocarlo
const videoLateralVR = document.getElementById("video-lateral-vr");
videoLateralVR.addEventListener("click", ()=> {
  videoLateral.play().catch(()=>console.log("Interacción requerida para video lateral VR"));
});

// Hotspots pantalla normal
const hotspotList = document.getElementById("hotspot-list");
const infoPanel = document.getElementById("info-panel");
const hotspotTitle = document.getElementById("hotspot-title");
const hotspotDescription = document.getElementById("hotspot-description");
const closeInfo = document.getElementById("close-info");

// Hotspots VR
const hotspotContainerVR = document.getElementById("hotspot-container");
const infoPanelVR = document.getElementById("info-panel-vr");
const infoTitleVR = document.getElementById("info-title-vr");
const infoDescVR = document.getElementById("info-desc-vr");

// Crear hotspots
escena.hotspots.forEach((hs, index) => {
  // Pantalla normal
  const item = document.createElement("div");
  item.classList.add("hotspot-item");
  const icon = document.createElement("img");
  icon.src = "img/info.png";
  const title = document.createElement("span");
  title.textContent = hs.titulo;
  item.appendChild(icon);
  item.appendChild(title);
  setTimeout(()=>item.classList.add("show"), index*300);
  item.addEventListener("click", ()=>{
    hotspotTitle.textContent = hs.titulo;
    hotspotDescription.textContent = hs.descripcion;
    infoPanel.classList.add("show");
    infoPanel.classList.remove("hidden");
  });
  hotspotList.appendChild(item);

  // VR hotspot animado con fondo gris semitransparente y no encima del video
  const hsVR = document.createElement("a-plane");
  hsVR.setAttribute("width","0.35");
  hsVR.setAttribute("height","0.35");
  hsVR.setAttribute("color","#555"); // fondo gris
  hsVR.setAttribute("opacity","0.8");
  hsVR.setAttribute("class","clickable");
  // Ajustar posición si el hotspot está en la zona del video lateral
  const adjustedY = (hs.y < 1.4) ? hs.y + 0.5 : hs.y; // desplazar hacia arriba si está bajo
  hsVR.setAttribute("position", `${hs.x} ${adjustedY} ${hs.z}`);
  hsVR.setAttribute("look-at","[camera]");
  hsVR.setAttribute("animation__pulse","property: scale; dir: alternate; dur: 1000; loop: true; to: 1.2 1.2 1.2");

  // Texto dentro del hotspot
  const text = document.createElement("a-text");
  text.setAttribute("value", hs.titulo);
  text.setAttribute("align","center");
  text.setAttribute("color","#fff");
  text.setAttribute("position","0 0 0.01");
  text.setAttribute("width","0.3");
  hsVR.appendChild(text);

  hsVR.addEventListener("click", ()=>{
    infoTitleVR.setAttribute("value", hs.titulo);
    infoDescVR.setAttribute("value", hs.descripcion);
    infoPanelVR.setAttribute("visible","true");
  });
  hotspotContainerVR.appendChild(hsVR);
});

// Cerrar info normal
closeInfo.addEventListener("click", ()=>{
  infoPanel.classList.remove("show");
  setTimeout(()=>infoPanel.classList.add("hidden"),300);
});

// Galería pantalla normal
const camaraIcon = document.getElementById("camara-icon");
const galleryOverlay = document.getElementById("gallery-overlay");
const galleryImage = document.getElementById("gallery-image");
const prevGallery = document.getElementById("prev-gallery");
const nextGallery = document.getElementById("next-gallery");
const closeGallery = document.getElementById("close-gallery");

const galleryImages = ["images/imagen1.jpeg","images/imagen2.jpeg"];
let currentGalleryIndex = 0;

function showGallery(index){
  galleryImage.style.transform = "scale(0.9)";
  setTimeout(()=>{
    galleryImage.src = galleryImages[index];
    galleryImage.style.transform = "scale(1)";
  },150);
}

camaraIcon.addEventListener("click", ()=>{
  currentGalleryIndex = 0;
  showGallery(currentGalleryIndex);
  galleryOverlay.classList.add("visible");
  galleryOverlay.classList.remove("hidden");
});

prevGallery.addEventListener("click", ()=>{
  currentGalleryIndex = (currentGalleryIndex-1+galleryImages.length)%galleryImages.length;
  showGallery(currentGalleryIndex);
});

nextGallery.addEventListener("click", ()=>{
  currentGalleryIndex = (currentGalleryIndex+1)%galleryImages.length;
  showGallery(currentGalleryIndex);
});

closeGallery.addEventListener("click", ()=>{
  galleryOverlay.classList.remove("visible");
  setTimeout(()=>galleryOverlay.classList.add("hidden"),300);
});

// Salir VR
const exitVRBtn = document.getElementById("exit-vr-btn");
exitVRBtn.addEventListener("click", ()=>{
  const sceneEl = document.querySelector("a-scene");
  sceneEl.exitVR();
});
