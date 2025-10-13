import tourData from "./data.js";

window.onload = () => {
  console.log("🌎 Documento completamente cargado");

  // ELEMENTOS principales
  const sceneEl = document.querySelector("a-scene");
  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralNormal = document.getElementById("video-lateral-normal");

  const hotspotContainerVR = document.getElementById("hotspot-container");
  const infoPanelVR = document.getElementById("info-panel-vr");
  const infoTitleVR = document.getElementById("info-title-vr");
  const infoDescVR = document.getElementById("info-desc-vr");
  const infoClose = document.getElementById("info-close");

  const immersiveGallery = document.getElementById("immersive-gallery");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryPrev = document.getElementById("gallery-prev");
  const galleryNext = document.getElementById("gallery-next");
  const galleryClose = document.getElementById("gallery-close");

  const btnPlay = document.getElementById("btn-play");
  const btnPause = document.getElementById("btn-pause");
  const btnCloseVideo = document.getElementById("btn-close-video");

  const camaraIconVR = document.getElementById("camara-icon-vr");

  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  const exitVrBtn = document.getElementById("exit-vr-btn");

  // estado
  let currentSceneIndex = 0;
  let galleryList = [];
  let currentGalleryIndex = 0;
  let lastOpenedHotspotId = null;

  // start playback on first click (autoplay policies)
  const startPlayback = () => {
    if (videoMain) videoMain.play().catch(() => {});
    if (videoLateral) { videoLateral.muted = false; videoLateral.play().catch(()=>{}); }
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("click", startPlayback);

  // ---------- Funciones para hotspots, escenas y UI ----------

  function createHotspotsForScene(escena) {
    hotspotContainerVR.innerHTML = "";
    if (!escena || !escena.hotspots) return;

    escena.hotspots.forEach((hs) => {
      const el = document.createElement("a-plane");
      el.setAttribute("width", "0.45");
      el.setAttribute("height", "0.45");
      el.setAttribute("material", "src: #info-img; transparent: true; opacity: 0.95");
      el.setAttribute("class", "clickable");
      el.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
      el.setAttribute("look-at", "[camera]");
      el.setAttribute("animation__pulse", "property: scale; dir: alternate; dur: 1200; loop: true; to: 1.3 1.3 1.3");

      const label = document.createElement("a-text");
      label.setAttribute("value", hs.titulo);
      label.setAttribute("align", "center");
      label.setAttribute("color", "#fff");
      label.setAttribute("position", "0 -0.35 0.01");
      label.setAttribute("width", "1");
      el.appendChild(label);

      // comportamiento por tipo
      if (hs.tipo === "camera") {
        el.addEventListener("click", () => {
          // toggle: si es el mismo y ya abierto -> cerrar
          if (lastOpenedHotspotId === hs.id && immersiveGallery.getAttribute("visible") === "true") {
            immersiveGallery.setAttribute("visible", "false");
            lastOpenedHotspotId = null;
            return;
          }
          // abrir carrusel inmersivo
          galleryList = (hs.imagenes && hs.imagenes.length) ? hs.imagenes.slice() : [];
          if (!galleryList.length) return;
          currentGalleryIndex = 0;
          galleryImage.setAttribute("src", galleryList[currentGalleryIndex]);
          galleryCaption.setAttribute("value", hs.caption || "");
          immersiveGallery.setAttribute("visible", "true");
          lastOpenedHotspotId = hs.id;
        });
      } else {
        // tipo info
        el.addEventListener("click", () => {
          const visible = infoPanelVR.getAttribute("visible") === "true";
          const currentTitle = infoTitleVR.getAttribute("value");
          if (visible && currentTitle === hs.titulo) {
            infoPanelVR.setAttribute("visible", "false");
            lastOpenedHotspotId = null;
          } else {
            infoTitleVR.setAttribute("value", hs.titulo);
            infoDescVR.setAttribute("value", hs.descripcion);
            infoPanelVR.setAttribute("visible", "true");
            lastOpenedHotspotId = hs.id;
          }
        });
      }

      hotspotContainerVR.appendChild(el);
    });
  }

  function loadScene(index) {
    const sceneData = tourData.escenas[index];
    if (!sceneData) return;
    currentSceneIndex = index;

    // actualizar videos
    if (videoMain) videoMain.src = sceneData.archivo;
    if (videoLateral) videoLateral.src = sceneData.lateralVideo;
    if (videoLateralNormal) videoLateralNormal.src = sceneData.lateralVideo;

    // crear hotspots
    createHotspotsForScene(sceneData);

    // cerrar UIs abiertas
    immersiveGallery.setAttribute("visible", "false");
    infoPanelVR.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  }

  // ---------- Inicial: crear menu de escenas y cargar primera escena ----------
  function createSceneMenuButtons() {
    sceneMenu.innerHTML = "";
    tourData.escenas.forEach((escena, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.6");
      btn.setAttribute("height", "0.32");
      btn.setAttribute("color", "#ffcc00");
      btn.setAttribute("position", `0 ${-0.38 * i} 0.01`);
      btn.setAttribute("class", "clickable");
      btn.setAttribute("look-at", "[camera]");
      btn.setAttribute("scale", "1 0 1"); // start closed

      const text = document.createElement("a-text");
      text.setAttribute("value", escena.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#000");
      text.setAttribute("width", "1.5");
      btn.appendChild(text);

      btn.addEventListener("click", () => {
        loadScene(i);
        // cerrar menu con animación
        Array.from(sceneMenu.children).forEach((c, idx) => {
          setTimeout(() => c.setAttribute("scale", "1 0 1"), idx * 40);
        });
        setTimeout(() => sceneMenu.setAttribute("visible", "false"), 200 + tourData.escenas.length * 40);
      });

      sceneMenu.appendChild(btn);
    });
  }

  // crear y togglear menuIcon
  createSceneMenuButtons();
  menuIcon.addEventListener("click", () => {
    const visible = sceneMenu.getAttribute("visible") === "true";
    if (!visible) {
      sceneMenu.setAttribute("visible", "true");
      Array.from(sceneMenu.children).forEach((btn, i) => {
        setTimeout(() => btn.setAttribute("scale", "1 1 1"), i * 80);
      });
    } else {
      Array.from(sceneMenu.children).forEach((btn, i) => {
        setTimeout(() => btn.setAttribute("scale", "1 0 1"), i * 50);
      });
      setTimeout(() => sceneMenu.setAttribute("visible", "false"), sceneMenu.children.length * 50 + 80);
    }
  });

  // ---------- Gallery handlers (immersive) ----------
  galleryPrev.addEventListener("click", () => {
    if (!galleryList.length) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryList.length) % galleryList.length;
    galleryImage.setAttribute("src", galleryList[currentGalleryIndex]);
  });
  galleryNext.addEventListener("click", () => {
    if (!galleryList.length) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryList.length;
    galleryImage.setAttribute("src", galleryList[currentGalleryIndex]);
  });
  galleryClose.addEventListener("click", () => {
    immersiveGallery.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  });

  // cerrar info panel con su icono
  infoClose.addEventListener("click", () => {
    infoPanelVR.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  });

  // ---------- Video lateral controls ----------
  if (btnPlay) btnPlay.addEventListener("click", () => { if (videoLateral) videoLateral.play(); });
  if (btnPause) btnPause.addEventListener("click", () => { if (videoLateral) videoLateral.pause(); });
  if (btnCloseVideo) btnCloseVideo.addEventListener("click", () => {
    if (videoLateral) { videoLateral.pause(); videoLateral.currentTime = 0; }
  });

  // ---------- Camara icon DOM toggle (también funciona desde el DOM si quieres) ----------
  if (camaraIconVR) {
    camaraIconVR.addEventListener("click", () => {
      // toggling immersive gallery when clicking camera icon with no specific hotspot:
      if (immersiveGallery.getAttribute("visible") === "true") {
        immersiveGallery.setAttribute("visible", "false");
        lastOpenedHotspotId = null;
        return;
      }
      // try to open first camera hotspot images for current scene
      const escena = tourData.escenas[currentSceneIndex];
      const cam = escena.hotspots && escena.hotspots.find(h => h.tipo === "camera");
      if (!cam || !cam.imagenes || !cam.imagenes.length) return;
      galleryList = cam.imagenes.slice();
      currentGalleryIndex = 0;
      galleryImage.setAttribute("src", galleryList[0]);
      galleryCaption.setAttribute("value", cam.caption || "");
      immersiveGallery.setAttribute("visible", "true");
      lastOpenedHotspotId = cam.id;
    });
  }

  // ---------- Exit VR button (in-scene) ----------
  if (exitVrBtn) {
    exitVrBtn.addEventListener("click", () => {
      try {
        if (sceneEl && sceneEl.exitVR) sceneEl.exitVR();
      } catch (e) {
        console.warn("Error exitVR:", e);
      }
    });
  }

  // ---------- Inicial load ----------
  loadScene(0);

  // ---------- Captura error A-Frame (no bloquear) ----------
  window.addEventListener("error", (e) => {
    if (e.filename && e.filename.includes("vr-mode-ui.js")) {
      console.warn("Ignorado error A-Frame:", e.message);
      e.preventDefault();
    }
  });

  console.log("✅ Tour VR inicializado (botón VR nativo restaurado).");
};
