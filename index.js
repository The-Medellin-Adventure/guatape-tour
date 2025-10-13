import tourData from "./data.js";

window.onload = () => {
  console.log("🌎 Documento completamente cargado");

  // ELEMENTOS DE VIDEO
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

  let currentSceneIndex = 0;

  // ------------------- FUNCIONES -------------------

  const startPlayback = () => {
    videoMain.play().catch(() => {});
    videoLateral.muted = false;
    videoLateral.play().catch(() => {});
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("click", startPlayback);

  const showGalleryImage = (index, galleryImages) => {
    galleryImage.src = galleryImages[index];
  };

  const createHotspots = (escena) => {
    hotspotContainerVR.innerHTML = "";

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

      // Toggle tarjeta info
      hsVR.addEventListener("click", () => {
        const visible = infoPanelVR.getAttribute("visible") === "true";
        const currentTitle = infoTitleVR.getAttribute("value");

        if (visible && currentTitle === hs.titulo) {
          infoPanelVR.setAttribute("visible", "false");
        } else {
          infoTitleVR.setAttribute("value", hs.titulo);
          infoDescVR.setAttribute("value", hs.descripcion);
          infoPanelVR.setAttribute("visible", "true");
        }
      });

      hotspotContainerVR.appendChild(hsVR);
    });
  };

  const loadScene = (index) => {
    currentSceneIndex = index;
    const selected = tourData.escenas[index];

    videoMain.src = selected.archivo;
    videoLateral.src = selected.lateralVideo;
    videoLateralNormal.src = selected.lateralVideo;

    createHotspots(selected);
  };

  // ------------------- INICIALIZACIÓN -------------------
  loadScene(currentSceneIndex);

  // ------------------- GALERÍA -------------------
  const galleryImages = ["images/imagen1.jpeg", "images/imagen2.jpeg"];
  let currentGalleryIndex = 0;

  const openGallery = () => {
    currentGalleryIndex = 0;
    showGalleryImage(currentGalleryIndex, galleryImages);
    galleryOverlay.classList.add("visible");
    galleryOverlay.classList.remove("hidden");
  };

  if (camaraIcon) camaraIcon.addEventListener("click", openGallery);
  if (camaraIconVR) camaraIconVR.addEventListener("click", openGallery);

  if (prevGallery)
    prevGallery.addEventListener("click", () => {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      showGalleryImage(currentGalleryIndex, galleryImages);
    });

  if (nextGallery)
    nextGallery.addEventListener("click", () => {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      showGalleryImage(currentGalleryIndex, galleryImages);
    });

  if (closeGallery)
    closeGallery.addEventListener("click", () => {
      galleryOverlay.classList.remove("visible");
      setTimeout(() => galleryOverlay.classList.add("hidden"), 300);
    });

  // ------------------- BOTONES VIDEO LATERAL -------------------
  if (btnPlay) btnPlay.addEventListener("click", () => videoLateral.play());
  if (btnPause) btnPause.addEventListener("click", () => videoLateral.pause());
  if (btnCerrar) btnCerrar.addEventListener("click", () => {
    videoLateral.pause();
    videoLateral.currentTime = 0;
  });

  // ------------------- MENÚ FLOTANTE ESCENAS -------------------
  if (menuIcon) {
    // Crear botones de escenas
    tourData.escenas.forEach((escena, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.2");
      btn.setAttribute("height", "0.3");
      btn.setAttribute("color", "#ffcc00");
      btn.setAttribute("position", `0 ${-0.35 * i} 0`);
      btn.setAttribute("class", "clickable");
      btn.setAttribute("look-at", "[camera]");
      btn.setAttribute("scale", "1 0 1"); // inicio cerrado

      const text = document.createElement("a-text");
      text.setAttribute("value", escena.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#000");
      text.setAttribute("width", "1.1");
      btn.appendChild(text);

      btn.addEventListener("click", () => loadScene(i));
      sceneMenu.appendChild(btn);
    });

    // Toggle menú
    menuIcon.addEventListener("click", () => {
      const visible = sceneMenu.getAttribute("visible") === "true";
      if (!visible) {
        sceneMenu.setAttribute("visible", "true");
        sceneMenu.children.forEach((btn, i) => {
          setTimeout(() => btn.setAttribute("scale", "1 1 1"), i * 100);
        });
      } else {
        sceneMenu.children.forEach((btn, i) => {
          setTimeout(() => btn.setAttribute("scale", "1 0 1"), i * 50);
        });
        setTimeout(() => sceneMenu.setAttribute("visible", "false"), sceneMenu.children.length * 50 + 50);
      }
    });
  }

  // ------------------- BOTÓN SALIR VR -------------------
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

  // Capturar error interno de A-Frame sin romper el tour
  window.addEventListener("error", (e) => {
    if (e.filename && e.filename.includes("vr-mode-ui.js")) {
      console.warn("⚠️ Ignorado error interno de A-Frame:", e.message);
      e.preventDefault();
    }
  });

  console.log("✅ Tour VR completamente inicializado");
};
