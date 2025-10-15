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
  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");
  const exitVrBtn = document.getElementById("exit-vr-btn");
  const videoCard = document.getElementById("video-card");

  // Botones del video lateral
  const btnPlay = document.getElementById("btn-play-vr");
  const btnPause = document.getElementById("btn-pause-vr");
  const btnCerrar = document.getElementById("btn-cerrar-vr");
  const reopenIcon = document.getElementById("video-reopen-icon"); // 🔹 nuevo icono para reabrir

  // Overlay de fundido
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
  let playbackEnabled = false;

  // --- Inicializar reproducción manual (con sonido) ---
  function enablePlaybackOnce() {
    if (playbackEnabled) return;
    [videoMain, videoLateral].forEach((v) => {
      v.muted = false;
      v.volume = 1.0;
      v.play().catch(() => {});
    });
    playbackEnabled = true;
    window.removeEventListener("click", enablePlaybackOnce);
    console.log("🔊 Reproducción habilitada con audio.");
  }
  window.addEventListener("click", enablePlaybackOnce);

  // --- Fundido suave ---
  const fadeIn = (cb) => {
    fadeOverlay.setAttribute("animation", "property: material.opacity; from:1; to:0; dur:600");
    setTimeout(() => cb && cb(), 600);
  };
  const fadeOut = (cb) => {
    fadeOverlay.setAttribute("animation", "property: material.opacity; from:0; to:1; dur:600");
    setTimeout(() => cb && cb(), 600);
  };

  // --- Detener todos los videos ---
  function stopAllVideos() {
    [videoMain, videoLateral].forEach((v) => {
      try {
        v.pause();
        v.currentTime = 0;
      } catch (e) {}
    });
  }

  // --- Cargar escena ---
  function loadScene(index) {
    const data = tourData.escenas[index];
    if (!data) return;

    currentSceneIndex = index;
    fadeOut(() => {
      stopAllVideos();

      // Asignar videos
      videoMain.src = data.archivo;
      videoLateral.src = data.lateralVideo;
      videoLateralVR.setAttribute("src", "#video-lateral");

      videoMain.load();
      videoLateral.load();

      // Reproducir solo el principal con audio
      videoMain.muted = false;
      videoMain.volume = 1.0;
      videoLateral.muted = true;

      videoMain.play().catch(() => {});
      videoLateral.pause();

      sphere.setAttribute("src", "#video-main");
      createHotspots(data.hotspots);
      fadeIn();

      console.log("🎬 Escena cargada:", data.titulo);

      // Auto-avance
      videoMain.onended = () => {
        if (currentSceneIndex < tourData.escenas.length - 1) loadScene(currentSceneIndex + 1);
      };
    });
  }

  // --- Hotspots ---
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
        `property: opacity; from: 0; to: 1; dur: 800; delay: ${120 * i}`
      );
      const label = document.createElement("a-text");
      label.setAttribute("value", hs.titulo);
      label.setAttribute("align", "center");
      label.setAttribute("color", "#fff");
      label.setAttribute("position", "0 -0.35 0.01");
      label.setAttribute("width", "1.2");
      icon.appendChild(label);

      if (hs.tipo === "info") {
        icon.addEventListener("click", () => showInfoPanel(hs));
      }

      hotspotContainer.appendChild(icon);
    });
  }

  function showInfoPanel(hs) {
    infoTitleVR.setAttribute("value", hs.titulo);
    infoDescVR.setAttribute("value", hs.descripcion);
    infoPanelVR.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
    infoPanelVR.setAttribute("visible", true);
  }
  infoCloseVR.addEventListener("click", () => infoPanelVR.setAttribute("visible", false));

  // --- Menú de escenas ---
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
      btn.setAttribute("position", `0 ${-0.4 * (i + 1)} 0.01`);
      btn.classList.add("clickable");

      const txt = document.createElement("a-text");
      txt.setAttribute("value", esc.titulo);
      txt.setAttribute("align", "center");
      txt.setAttribute("color", "#073047");
      txt.setAttribute("width", "1.3");
      txt.setAttribute("position", "0 0 0.02");
      btn.appendChild(txt);

      btn.addEventListener("click", () => {
        loadScene(i);
        toggleMenu(false);
      });

      sceneMenu.appendChild(btn);
    });
  }

  function toggleMenu(force) {
    menuVisible = typeof force === "boolean" ? force : !menuVisible;
    sceneMenu.setAttribute("visible", menuVisible);
  }
  menuIcon.addEventListener("click", () => toggleMenu());
  exitVrBtn.addEventListener("click", () => sceneEl.exitVR && sceneEl.exitVR());

  // --- Controles del video lateral (con audio y reabrir) ---
  btnPlay.addEventListener("click", () => {
    videoLateral.muted = false;
    videoLateral.volume = 1.0;
    videoLateral.play().catch(() => {});
    console.log("▶️ Play lateral con audio");
  });

  btnPause.addEventListener("click", () => {
    videoLateral.pause();
    console.log("⏸️ Pause lateral");
  });

  btnCerrar.addEventListener("click", () => {
    videoLateral.pause();
    videoLateral.currentTime = 0;
    videoLateral.muted = true;
    videoCard.setAttribute("visible", false);
    if (reopenIcon) reopenIcon.setAttribute("visible", true);
    console.log("❌ Cerrar lateral (muteado)");
  });

  // --- Reabrir video lateral ---
  if (reopenIcon) {
    reopenIcon.addEventListener("click", () => {
      videoCard.setAttribute("visible", true);
      reopenIcon.setAttribute("visible", false);
      videoLateral.currentTime = 0;
      videoLateral.muted = false;
      videoLateral.volume = 1.0;
      videoLateral.play().catch(() => {});
      console.log("🎬 Video lateral reabierto con audio");
    });
  }

  // --- Cursor y láser ---
  sceneEl.addEventListener("enter-vr", () => {
    setTimeout(() => {
      const lasers = document.querySelectorAll("[laser-controls]");
      lasers.forEach((l) => {
        l.setAttribute("visible", true);
        l.setAttribute("raycaster", "objects: .clickable; lineColor: #ffd34d");
      });
      console.log("🔆 Láser activado correctamente.");
    }, 800);
  });

  // --- Iniciar ---
  createSceneMenu();
  loadScene(0);
  console.log("🌎 Tour VR iniciado.");
};
