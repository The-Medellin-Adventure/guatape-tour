import tourData from "./data.js";

window.onload = () => {
  console.log("🌎 Documento completamente cargado");

  const escena = tourData.escenas[0];

  // ==== VIDEOS ====
  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralNormal = document.getElementById("video-lateral-normal");

  if (!videoMain || !videoLateral || !videoLateralNormal) {
    console.error("❌ No se encontraron elementos de video.");
    return;
  }

  videoMain.src = escena.archivo;
  videoLateral.src = escena.lateralVideo;
  videoLateralNormal.src = escena.lateralVideo;

  setTimeout(() => {
    videoMain.play().catch(() => console.log("🎥 Interacción requerida para video principal"));
  }, 3000);

  setTimeout(() => {
    videoLateral.muted = false;
    videoLateral.play().catch(() => console.log("🎧 Interacción requerida para video lateral"));
  }, 5000);

  // ==== HOTSPOTS VR ====
  const hotspotContainerVR = document.getElementById("hotspot-container");
  const infoPanelVR = document.getElementById("info-panel-vr");
  const infoTitleVR = document.getElementById("info-title-vr");
  const infoDescVR = document.getElementById("info-desc-vr");

  if (hotspotContainerVR) {
    escena.hotspots.forEach((hs) => {
      const hsVR = document.createElement("a-plane");
      hsVR.setAttribute("width", "0.45");
      hsVR.setAttribute("height", "0.45");
      hsVR.setAttribute("material", "src: #info-img; transparent: true; opacity: 0.95");
      hsVR.setAttribute("class", "clickable");
      hsVR.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
      hsVR.setAttribute("look-at", "[camera]");
      hsVR.setAttribute(
        "animation__pulse",
        "property: scale; dir: alternate; dur: 1200; loop: true; to: 1.3 1.3 1.3"
      );

      const text = document.createElement("a-text");
      text.setAttribute("value", hs.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#fff");
      text.setAttribute("position", "0 -0.35 0.01");
      text.setAttribute("width", "1");
      hsVR.appendChild(text);

      hsVR.addEventListener("click", () => {
        infoTitleVR.setAttribute("value", hs.titulo);
        infoDescVR.setAttribute("value", hs.descripcion);
        infoPanelVR.setAttribute("visible", "true");
      });

      hotspotContainerVR.appendChild(hsVR);
    });
  }

  // ==== GALERÍA ====
  const camaraIcon = document.getElementById("camara-icon");
  const camaraIconVR = document.getElementById("camara-icon-vr");
  const galleryOverlay = document.getElementById("gallery-overlay");
  const galleryImage = document.getElementById("gallery-image");
  const prevGallery = document.getElementById("prev-gallery");
  const nextGallery = document.getElementById("next-gallery");
  const closeGallery = document.getElementById("close-gallery");

  const galleryImages = ["images/imagen1.jpeg", "images/imagen2.jpeg"];
  let currentGalleryIndex = 0;

  const showGallery = (index) => {
    galleryImage.src = galleryImages[index];
  };

  const openGallery = () => {
    currentGalleryIndex = 0;
    showGallery(currentGalleryIndex);
    galleryOverlay.classList.add("visible");
    galleryOverlay.classList.remove("hidden");
  };

  if (camaraIcon) camaraIcon.addEventListener("click", openGallery);
  if (camaraIconVR) camaraIconVR.addEventListener("click", openGallery);

  if (prevGallery)
    prevGallery.addEventListener("click", () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      showGallery(currentGalleryIndex);
    });

  if (nextGallery)
    nextGallery.addEventListener("click", () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      showGallery(currentGalleryIndex);
    });

  if (closeGallery)
    closeGallery.addEventListener("click", () => {
      galleryOverlay.classList.remove("visible");
      setTimeout(() => galleryOverlay.classList.add("hidden"), 300);
    });

  // ==== SALIR DE VR ====
  const exitVRBtn = document.getElementById("exit-vr-btn");
  if (exitVRBtn) {
    exitVRBtn.addEventListener("click", () => {
      const sceneEl = document.querySelector("a-scene");
      if (sceneEl) sceneEl.exitVR();
    });
  }

  console.log("✅ Todo cargado correctamente");
};
