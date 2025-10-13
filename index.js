import tourData from "./data.js";

window.onload = () => {
  console.log("🌎 Documento completamente cargado");

  let currentSceneIndex = 0;
  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralNormal = document.getElementById("video-lateral-normal");
  const hotspotContainerVR = document.getElementById("hotspot-container");
  const infoPanelVR = document.getElementById("info-panel-vr");
  const infoTitleVR = document.getElementById("info-title-vr");
  const infoDescVR = document.getElementById("info-desc-vr");
  const camaraIcon = document.getElementById("camara-icon");
  const camaraIconVR = document.getElementById("camara-icon-vr");
  const galleryOverlay = document.getElementById("gallery-overlay");
  const galleryImage = document.getElementById("gallery-image");
  const prevGallery = document.getElementById("prev-gallery");
  const nextGallery = document.getElementById("next-gallery");
  const closeGallery = document.getElementById("close-gallery");

  const btnPlay = document.getElementById("btn-play");
  const btnPause = document.getElementById("btn-pause");
  const btnCerrar = document.getElementById("btn-cerrar");

  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  const exitVRBtn = document.getElementById("exit-vr-btn");

  const galleryImages = ["images/imagen1.jpeg", "images/imagen2.jpeg"];
  let currentGalleryIndex = 0;

  // ------------------- FUNCIONES -------------------
  const loadScene = (index) => {
    currentSceneIndex = index;
    const escena = tourData.escenas[index];

    // Videos
    videoMain.src = escena.archivo;
    videoLateral.src = escena.lateralVideo;
    videoLateralNormal.src = escena.lateralVideo;

    // Reproducir al interactuar
    const startPlayback = () => {
      videoMain.play().catch(() => {});
      videoLateral.muted = false;
      videoLateral.play().catch(() => {});
      window.removeEventListener("click", startPlayback);
    };
    window.addEventListener("click", startPlayback);

    // Limpiar hotspots VR anteriores
    hotspotContainerVR.innerHTML = "";

    // Crear hotspots VR
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

      // Toggle info VR
      hsVR.addEventListener("click", () => {
        const visible = infoPanelVR.getAttribute("visible");
        infoPanelVR.setAttribute("visible", visible === "true" ? "false" : "true");
        infoTitleVR.setAttribute("value", hs.titulo);
        infoDescVR.setAttribute("value", hs.descripcion);
      });

      hotspotContainerVR.appendChild(hsVR);
    });
  };

  // ------------------- GALERÍA -------------------
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

  // ------------------- BOTONES VIDEO LATERAL -------------------
  if (btnPlay)
    btnPlay.addEventListener("click", () => videoLateral.play());
  if (btnPause)
    btnPause.addEventListener("click", () => videoLateral.pause());
  if (btnCerrar)
    btnCerrar.addEventListener("click", () => {
      videoLateral.pause();
      videoLateral.currentTime = 0;
    });

  // ------------------- MENÚ ESCENAS FLOTANTE -------------------
  if (menuIcon) {
    menuIcon.addEventListener("click", () => {
      const visible = sceneMenu.getAttribute("visible");
      sceneMenu.setAttribute("visible", visible === "true" ? "false" : "true");
    });

    // Crear lista de escenas
    tourData.escenas.forEach((escena, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.2");
      btn.setAttribute("height", "0.3");
      btn.setAttribute("color", "#ffcc00");
      btn.setAttribute("position", `0 ${-0.35 * i} 0`);
      btn.setAttribute("class", "clickable");
      btn.setAttribute("look-at", "[camera]");

      const text = document.createElement("a-text");
      text.setAttribute("value", escena.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#000");
      text.setAttribute("width", "1.1");
      btn.appendChild(text);

      btn.addEventListener("click", () => {
        loadScene(i);
      });

      sceneMenu.appendChild(btn);
    });
  }

  // ------------------- SALIR VR -------------------
  if (exitVRBtn) {
    exitVRBtn.addEventListener("click", () => {
      const sceneEl = document.querySelector("a-scene");
      if (sceneEl) sceneEl.exitVR();
    });
  }

  // ------------------- CAPTURA DE ERRORES A-FRAME -------------------
  window.addEventListener("error", (e) => {
    if (e.filename && e.filename.includes("vr-mode-ui.js")) {
      console.warn("⚠️ Ignorado error interno de A-Frame:", e.message);
      e.preventDefault();
    }
  });

  // ------------------- CARGAR PRIMERA ESCENA -------------------
  loadScene(currentSceneIndex);
  console.log("✅ Tour VR completamente inicializado");
};
