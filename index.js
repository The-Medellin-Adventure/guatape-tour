import tourData from "./data.js";

const escena = tourData.escenas[0];

// Video principal y lateral
document.getElementById("video-main").src = escena.archivo;
document.getElementById("video-lateral").src = escena.lateralVideo;
document.getElementById("video-lateral-normal").src = escena.lateralVideo;

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

// Crear hotspots para pantalla normal y VR
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

  // VR hotspot
  const hsVR = document.createElement("a-image");
  hsVR.setAttribute("src","#info-img");
  hsVR.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
  hsVR.setAttribute("width","0.3");
  hsVR.setAttribute("height","0.3");
  hsVR.setAttribute("look-at","[camera]");
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
// ...igual que antes con #camara-icon y #gallery-overlay...

// Salir VR
const exitVRBtn = document.getElementById("exit-vr-btn");
exitVRBtn.addEventListener("click", ()=>{
  const sceneEl = document.querySelector("a-scene");
  sceneEl.exitVR();
});
