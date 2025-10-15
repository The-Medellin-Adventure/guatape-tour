import tourData from "./data.js";

window.onload = () => {
  const sceneEl = document.getElementById("scene");
  const sphere = document.getElementById("sphere");
  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralVR = document.getElementById("video-lateral-vr");
  const hotspotContainer = document.getElementById("hotspot-container");
  const infoPanelVR = document.getElementById("info-panel-vr");
  const infoTitleVR = document.getElementById("info-title-vr");
  const infoDescVR = document.getElementById("info-desc-vr");
  const infoCloseVR = document.getElementById("info-close-vr");
  const immersiveGallery = document.getElementById("immersive-gallery");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryPrev = document.getElementById("gallery-prev");
  const galleryNext = document.getElementById("gallery-next");
  const galleryClose = document.getElementById("gallery-close");
  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");
  const exitVrBtn = document.getElementById("exit-vr-btn");
  const btnPlay = document.getElementById("btn-play-vr");
  const btnPause = document.getElementById("btn-pause-vr");

  // ðŸ”¹ Overlay de fundido
  const fadeOverlay = document.createElement("a-plane");
  fadeOverlay.setAttribute("id", "fade-overlay");
  fadeOverlay.setAttribute("color", "#000");
  fadeOverlay.setAttribute("width", "100");
  fadeOverlay.setAttribute("height", "100");
  fadeOverlay.setAttribute("position", "0 0 -1");
  fadeOverlay.setAttribute("material", "opacity: 0; transparent: true");
  fadeOverlay.setAttribute("visible", "true");
  sceneEl.appendChild(fadeOverlay);

  let currentSceneIndex = 0;
  let menuVisible = false;
  let currentGallery = [];
  let currentGalleryIndex = 0;

  // âœ… Habilitar reproducciÃ³n al primer clic (para evitar bloqueo del navegador)
  function enablePlaybackOnce() {
    [videoMain, videoLateral, videoLateralVR].forEach((v) => {
      try {
        v.muted = true;
        v.play().catch(() => {});
      } catch {}
    });
    console.log("â–¶ï¸ ReproducciÃ³n habilitada manualmente.");
    window.removeEventListener("click", enablePlaybackOnce);
  }
  window.addEventListener("click", enablePlaybackOnce);

  // ðŸ”¹ Fundido suave
  function fadeIn(callback) {
    fadeOverlay.setAttribute(
      "animation",
      "property: material.opacity; from: 1; to: 0; dur: 500; easing: easeOutQuad"
    );
    setTimeout(() => callback && callback(), 500);
  }

  function fadeOut(callback) {
    fadeOverlay.setAttribute(
      "animation",
      "property: material.opacity; from: 0; to: 1; dur: 500; easing: easeInQuad"
    );
    setTimeout(() => callback && callback(), 500);
  }

  // ðŸ”¹ Cargar escena
  function loadScene(index) {
    const data = tourData.escenas[index];
    if (!data) return;

    // ðŸ›‘ Detener videos anteriores
    [videoMain, videoLateral, videoLateralVR].forEach((v) => {
      try {
        v.pause();
        v.currentTime = 0;
        v.removeAttribute("src");
        v.load();
      } catch (e) {
        console.warn("âš ï¸ Error al limpiar video anterior:", e);
      }
    });

    currentSceneIndex = index;

    fadeOut(() => {
      // Asignar nuevas fuentes
      videoMain.setAttribute("src", data.archivo);
      videoLateral.setAttribute("src", data.lateralVideo);
      videoLateralVR.setAttribute("src", data.lateralVideo);
      sphere.setAttribute("src", "#video-main");

      createHotspots(data.hotspots);

      fadeIn();
      console.log("ðŸŽ¬ Escena cargada:", data.titulo);

      // âœ… Al finalizar video principal â†’ pasar a siguiente escena
      videoMain.onended = () => {
        if (currentSceneIndex < tourData.escenas.length - 1) {
          loadScene(currentSceneIndex + 1);
        } else {
          console.log("ðŸŽ¬ Ãšltima escena finalizada.");
        }
      };

      // âœ… Detener videos laterales al finalizar
      videoLateral.onended = () => videoLateral.pause();
      videoLateralVR.onended = () => videoLateralVR.pause();
    });
  }

  // ðŸ”¹ Crear hotspots
  function createHotspots(hotspots) {
    hotspotContainer.innerHTML = "";

    hotspots.forEach((hs, i) => {
      const icon = document.createElement("a-image");
      icon.setAttribute("src", hs.tipo === "info" ? "#info-img" : "#camara-img");
      icon.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
      icon.setAttribute("width", "0.28");
      icon.setAttribute("height", "0.28");
      icon.classList.add("clickable");
      icon.setAttribute("look-at", "[camera]");
      icon.setAttribute(
        "animation__fadein",
        `property: opacity; from: 0; to: 1; dur: 800; delay: ${150 * i}`
      );

      const label = document.createElement("a-text");
      label.setAttribute("value", hs.titulo);
      label.setAttribute("align", "center");
      label.setAttribute("color", "#fff");
      label.setAttribute("position", "0 -0.35 0.01");
      label.setAttribute("width", "1.2");
      icon.appendChild(label);

      icon.addEventListener("click", () => {
        if (hs.tipo === "info") showInfoPanel(hs);
        else if (hs.tipo === "camera") showGallery(hs);
      });

      hotspotContainer.appendChild(icon);
    });
  }

  // ðŸ”¹ Panel informativo
  function showInfoPanel(hs) {
    infoTitleVR.setAttribute("value", hs.titulo);
    infoDescVR.setAttribute("value", hs.descripcion);
    const offsetX = hs.x >= 0 ? hs.x - 0.9 : hs.x + 0.9;
    infoPanelVR.setAttribute("position", `${offsetX} ${hs.y} ${hs.z}`);
    infoPanelVR.setAttribute("visible", "true");
  }
  infoCloseVR.addEventListener("click", () =>
    infoPanelVR.setAttribute("visible", "false")
  );

  // ðŸ”¹ GalerÃ­a
  function showGallery(hs) {
    currentGallery = hs.imagenes || [];
    currentGalleryIndex = 0;
    if (currentGallery.length > 0) {
      galleryImage.setAttribute("src", currentGallery[0]);
      galleryCaption.setAttribute("value", hs.caption || hs.titulo || "GalerÃ­a");
      immersiveGallery.setAttribute("visible", "true");
    }
  }

  galleryPrev.addEventListener("click", () => {
    if (!currentGallery.length) return;
    currentGalleryIndex =
      (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
    galleryImage.setAttribute("src", currentGallery[currentGalleryIndex]);
  });

  galleryNext.addEventListener("click", () => {
    if (!currentGallery.length) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
    galleryImage.setAttribute("src", currentGallery[currentGalleryIndex]);
  });

  galleryClose.addEventListener("click", () =>
    immersiveGallery.setAttribute("visible", "false")
  );

  // ðŸ”¹ MenÃº de escenas
  function createSceneMenu() {
    sceneMenu.innerHTML = "";

    const bg = document.createElement("a-plane");
    bg.setAttribute("color", "#022633");
    bg.setAttribute("width", "1.6");
    bg.setAttribute("height", `${tourData.escenas.length * 0.45 + 0.5}`);
    bg.setAttribute("position", "0 0 0");
    bg.setAttribute("opacity", "1");
    sceneMenu.appendChild(bg);

    const header = document.createElement("a-text");
    header.setAttribute("value", "Escenas disponibles");
    header.setAttribute("align", "center");
    header.setAttribute("color", "#ffd34d");
    header.setAttribute("position", "0 0.5 0.01");
    header.setAttribute("width", "1.8");
    sceneMenu.appendChild(header);

    tourData.escenas.forEach((esc, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.4");
      btn.setAttribute("height", "0.3");
      btn.setAttribute("color", i === currentSceneIndex ? "#ffd34d" : "#ffffff");
      btn.setAttribute("opacity", "1");
      btn.setAttribute("position", `0 ${-0.4 * (i + 1)} 0.01`);
      btn.classList.add("clickable");

      const txt = document.createElement("a-text");
      txt.setAttribute("value", esc.titulo);
      txt.setAttribute("align", "center");
      txt.setAttribute("color", "#073047");
      txt.setAttribute("width", "1.3");
      txt.setAttribute("position", "0 0 0.02");
      btn.appendChild(txt);

      btn.addEventListener("mouseenter", () => btn.setAttribute("color", "#ffd34d"));
      btn.addEventListener("mouseleave", () =>
        btn.setAttribute("color", i === currentSceneIndex ? "#ffd34d" : "#ffffff")
      );
      btn.addEventListener("click", () => {
        [videoMain, videoLateral, videoLateralVR].forEach((v) => {
          try {
            v.pause();
            v.currentTime = 0;
          } catch {}
        });
        loadScene(i);
        toggleMenu(false);
      });

      sceneMenu.appendChild(btn);
    });
  }

  function toggleMenu(force) {
    menuVisible = typeof force === "boolean" ? force : !menuVisible;
    if (menuVisible) {
      sceneMenu.setAttribute("visible", "true");
      sceneMenu.setAttribute(
        "animation",
        "property: scale; to: 1 1 1; dur: 300; easing: easeOutQuad"
      );
      sceneMenu.setAttribute("scale", "0.1 0.1 0.1");
    } else {
      sceneMenu.setAttribute(
        "animation",
        "property: scale; to: 0.1 0.1 0.1; dur: 250; easing: easeInQuad"
      );
      setTimeout(() => sceneMenu.setAttribute("visible", "false"), 250);
    }
  }

  menuIcon.addEventListener("click", () => toggleMenu());
  exitVrBtn.addEventListener("click", () => {
    if (sceneEl && sceneEl.exitVR) sceneEl.exitVR();
  });

  // âœ… Botones de control del video lateral VR
  btnPlay.addEventListener("click", () => {
    videoLateralVR.play()
      .then(() => console.log("ðŸŽ¥ Video lateral reproducido"))
      .catch((e) => console.warn("No se pudo reproducir:", e));
  });

  btnPause.addEventListener("click", () => {
    videoLateralVR.pause();
    console.log("â¸ï¸ Video lateral pausado");
  });

  // ðŸ”¹ Iniciar tour
  createSceneMenu();
  loadScene(0);

  console.log("âœ… Tour 360Â° con video lateral y lÃ¡ser mejorado.");

  // âœ… Activar lÃ¡ser rÃ¡pido al entrar a VR (0.5 s)
  sceneEl.addEventListener("enter-vr", () => {
    const lasers = document.querySelectorAll("[laser-controls]");
    setTimeout(() => {
      lasers.forEach((l) => {
        l.setAttribute("visible", true);
        l.setAttribute("raycaster", "objects: .clickable; lineColor: #ffd34d");
      });
    }, 500);
  });
};