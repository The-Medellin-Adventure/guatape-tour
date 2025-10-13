import tourData from "./data.js";

window.onload = () => {
  console.log("🌎 Documento completamente cargado");

  const escena = tourData.escenas[0];

  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralNormal = document.getElementById("video-lateral-normal");

  // Cargar videos directamente
  if (videoMain && videoLateral && videoLateralNormal) {
    videoMain.src = escena.archivo;
    videoLateral.src = escena.lateralVideo;
    videoLateralNormal.src = escena.lateralVideo;

    const startPlayback = () => {
      videoMain.play().catch(() => {});
      videoLateral.muted = false;
      videoLateral.play().catch(() => {});
      window.removeEventListener("click", startPlayback);
    };
    window.addEventListener("click", startPlayback);
  }

  // Crear hotspots VR
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

  // Galería
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

  // Botones Video Lateral
  const playBtnVR = document.getElementById("play-lateral-btn");
  const pauseBtnVR = document.getElementById("pause-lateral-btn");
  const closeBtnVR = document.getElementById("close-lateral-btn");

  if (playBtnVR) playBtnVR.addEventListener("click", () => videoLateral.play());
  if (pauseBtnVR) pauseBtnVR.addEventListener("click", () => videoLateral.pause());
  if (closeBtnVR) closeBtnVR.addEventListener("click", () => {
    videoLateral.pause();
    videoLateral.currentTime = 0;
  });

  const playBtn = document.getElementById("play-lateral");
  const pauseBtn = document.getElementById("pause-lateral");
  const closeBtn = document.getElementById("close-lateral");

  if (playBtn) playBtn.addEventListener("click", () => videoLateralNormal.play());
  if (pauseBtn) pauseBtn.addEventListener("click", () => videoLateralNormal.pause());
  if (closeBtn) closeBtn.addEventListener("click", () => {
    videoLateralNormal.pause();
    videoLateralNormal.currentTime = 0;
  });

  // Salir de VR
  const exitVRBtn = document.getElementById("exit-vr-btn");
  if (exitVRBtn) {
    try {
      exitVRBtn.addEventListener("click", () => {
        const sceneEl = document.querySelector("a-scene");
        if (sceneEl) sceneEl.exitVR();
      });
    } catch (e) {
      console.warn("⚠️ Error controlado de A-Frame (sin impacto):", e.message);
    }
  }

  // Capturar error interno de A-Frame
  window.addEventListener("error", (e) => {
    if (e.filename && e.filename.includes("vr-mode-ui.js")) {
      console.warn("⚠️ Ignorado error interno de A-Frame:", e.message);
      e.preventDefault();
    }
  });

  // MENÚ DE ESCENAS
  const sceneButtons = document.querySelectorAll(".scene-btn");
  const infoPanelVR2 = infoPanelVR;
  const hotspotContainerVR2 = hotspotContainerVR;

  sceneButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const sceneIndex = parseInt(btn.dataset.scene);
      const escena = tourData.escenas[sceneIndex];
      if (!escena) return;

      videoMain.src = escena.archivo;
      videoLateral.src = escena.lateralVideo;
      videoLateralNormal.src = escena.lateralVideo;

      videoMain.play().catch(() => {});
      videoLateral.play().catch(() => {});
      videoLateralNormal.play().catch(() => {});

      hotspotContainerVR2.innerHTML = "";
      escena.hotspots.forEach(hs => {
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
          infoPanelVR2.setAttribute("visible", "true");
          document.getElementById("info-title-vr").setAttribute("value", hs.titulo);
          document.getElementById("info-desc-vr").setAttribute("value", hs.descripcion);
        });
        hotspotContainerVR2.appendChild(hsVR);
      });
    });
  });

  console.log("✅ Tour VR completamente inicializado");
};
