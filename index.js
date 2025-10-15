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

  let isVRMode = false;
  sceneEl.addEventListener("enter-vr", () => (isVRMode = true));
  sceneEl.addEventListener("exit-vr", () => (isVRMode = false));

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

  function enablePlaybackOnce() {
    if (playbackEnabled) return;
    [videoMain, videoLateral].forEach((v) => {
      v.muted = false;
      v.volume = 1.0;
      v.play().catch(() => {});
    });
    playbackEnabled = true;
    window.removeEventListener("click", enablePlaybackOnce);
  }
  window.addEventListener("click", enablePlaybackOnce);

  const fadeIn = (cb) => {
    fadeOverlay.setAttribute("animation", "property: material.opacity; from:1; to:0; dur:600");
    setTimeout(() => cb && cb(), 600);
  };
  const fadeOut = (cb) => {
    fadeOverlay.setAttribute("animation", "property: material.opacity; from:0; to:1; dur:600");
    setTimeout(() => cb && cb(), 600);
  };

  function stopAllVideos() {
    [videoMain, videoLateral].forEach((v) => {
      try {
        v.pause();
        v.currentTime = 0;
      } catch (e) {}
    });
  }

  // --- Crear hotspots ---
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
      icon.setAttribute("animation__fadein", `property: opacity; from: 0; to: 1; dur: 800; delay: ${120 * i}`);

      const label = document.createElement("a-text");
      label.setAttribute("value", hs.titulo);
      label.setAttribute("align", "center");
      label.setAttribute("color", "#fff");
      label.setAttribute("position", "0 -0.35 0.01");
      label.setAttribute("width", "1.2");
      icon.appendChild(label);

      if (hs.tipo === "info") icon.addEventListener("click", () => showInfoPanel(hs));
      if (hs.tipo === "camera") icon.addEventListener("click", () => showGalleryVR(hs));

      hotspotContainer.appendChild(icon);
    });
  }

  // --- Panel info debajo del icono ---
  function showInfoPanel(hs) {
    infoTitleVR.setAttribute("value", hs.titulo);
    infoDescVR.setAttribute("value", hs.descripcion);
    infoPanelVR.setAttribute("position", `${hs.x} ${hs.y - 0.6} ${hs.z}`);
    infoPanelVR.setAttribute("visible", true);
  }
  infoCloseVR.addEventListener("click", () => infoPanelVR.setAttribute("visible", false));

  // --- Carrusel VR ---
  function showGalleryVR(hs) {
    // Panel principal al lado derecho del icono
    const gallery = document.createElement("a-plane");
    gallery.setAttribute("width", "2.8");
    gallery.setAttribute("height", "1.6");
    gallery.setAttribute("position", `${hs.x + 1.8} ${hs.y} ${hs.z}`);
    gallery.setAttribute("material", "color: #000; opacity: 0.92; transparent: true; shader: flat;");
    gallery.setAttribute("class", "clickable");
    gallery.setAttribute("radius", "0.2");
    hotspotContainer.appendChild(gallery);

    let index = 0;
    const imgEl = document.createElement("a-image");
    imgEl.setAttribute("src", hs.imagenes[index]);
    imgEl.setAttribute("width", "2.5");
    imgEl.setAttribute("height", "1.3");
    imgEl.setAttribute("position", "0 0 0.01");
    imgEl.setAttribute("shader", "flat");
    gallery.appendChild(imgEl);

    // Botones navegación
    const prevBtn = document.createElement("a-plane");
    prevBtn.setAttribute("width", "0.25");
    prevBtn.setAttribute("height", "0.25");
    prevBtn.setAttribute("color", "#ffd34d");
    prevBtn.setAttribute("position", "-1.25 0 0.02");
    prevBtn.setAttribute("opacity", "0.9");
    prevBtn.classList.add("clickable");
    gallery.appendChild(prevBtn);

    const nextBtn = document.createElement("a-plane");
    nextBtn.setAttribute("width", "0.25");
    nextBtn.setAttribute("height", "0.25");
    nextBtn.setAttribute("color", "#ffd34d");
    nextBtn.setAttribute("position", "1.25 0 0.02");
    nextBtn.setAttribute("opacity", "0.9");
    nextBtn.classList.add("clickable");
    gallery.appendChild(nextBtn);

    // Botón de cierre
    const closeBtn = document.createElement("a-image");
    closeBtn.setAttribute("src", "#close-img");
    closeBtn.setAttribute("width", "0.22");
    closeBtn.setAttribute("height", "0.22");
    closeBtn.setAttribute("position", "0 0.75 0.03");
    closeBtn.classList.add("clickable");
    gallery.appendChild(closeBtn);

    // Eventos
    prevBtn.addEventListener("click", () => {
      index = (index - 1 + hs.imagenes.length) % hs.imagenes.length;
      imgEl.setAttribute("src", hs.imagenes[index]);
    });
    nextBtn.addEventListener("click", () => {
      index = (index + 1) % hs.imagenes.length;
      imgEl.setAttribute("src", hs.imagenes[index]);
    });
    closeBtn.addEventListener("click", () => hotspotContainer.removeChild(gallery));
  }

  // --- Cargar escena ---
  function loadScene(index) {
    if (!isVRMode && index > 0) return;

    const data = tourData.escenas[index];
    if (!data) return;

    currentSceneIndex = index;
    fadeOut(() => {
      stopAllVideos();
      videoMain.src = data.archivo;
      videoLateral.src = data.lateralVideo;
      videoLateralVR.setAttribute("src", "#video-lateral");
      videoMain.load();
      videoLateral.load();
      videoMain.muted = false;
      videoMain.volume = 1.0;
      videoLateral.muted = true;
      videoMain.play().catch(() => {});
      sphere.setAttribute("src", "#video-main");
      createHotspots(data.hotspots);
      fadeIn();

      videoMain.onended = () => {
        if (currentSceneIndex < tourData.escenas.length - 1) loadScene(currentSceneIndex + 1);
      };
    });
  }

  // --- Menú escenas ---
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
    header.setAttribute("value", "GUATAPE Travel");
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

  // --- Botón VR flotante ---
  function addNativeVRButton() {
    const btn = document.createElement("button");
    btn.innerText = "Entrar a VR";
    btn.style.position = "fixed";
    btn.style.right = "20px";
    btn.style.top = "50%";
    btn.style.transform = "translateY(-50%)";
    btn.style.padding = "14px 24px";
    btn.style.zIndex = "1000";
    btn.style.fontSize = "18px";
    btn.style.background = "#ffd34d";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    btn.onclick = () => sceneEl.enterVR && sceneEl.enterVR();
    document.body.appendChild(btn);
  }

  // --- Iniciar ---
  createSceneMenu();
  loadScene(0);
  addNativeVRButton();
  console.log("✅ Tour VR Guatapé Travel cargado correctamente");
};
