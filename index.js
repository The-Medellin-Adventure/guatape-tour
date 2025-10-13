import tourData from "./data.js";

window.onload = () => {
  console.log("🌎 Documento completamente cargado");

  // ELEMENTOS PRINCIPALES
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

  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  const camaraIconDOM = document.getElementById("camara-icon");
  const galleryOverlayDOM = document.getElementById("gallery-overlay");
  const galleryImageDOM = document.getElementById("gallery-image-dom");
  const prevGalleryDOM = document.getElementById("prev-gallery");
  const nextGalleryDOM = document.getElementById("next-gallery");
  const closeGalleryDOM = document.getElementById("close-gallery");

  // estado
  let currentSceneIndex = 0;
  let currentGalleryIndex = 0;
  let galleryList = []; // lista de URLs para la galería inmersiva
  let lastOpenedHotspotId = null;

  // start playback on first user interaction (browser autoplay policies)
  const startPlayback = () => {
    videoMain.play().catch(() => {});
    videoLateral.muted = false;
    videoLateral.play().catch(() => {});
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("click", startPlayback);

  // FUNCIONES UTILITARIAS
  const setVideoSources = (escena) => {
    videoMain.src = escena.archivo;
    videoLateral.src = escena.lateralVideo;
    if (videoLateralNormal) videoLateralNormal.src = escena.lateralVideo;
  };

  // crea hotspots para la escena (reutilizable)
  const createHotspotsForScene = (escena) => {
    hotspotContainerVR.innerHTML = ""; // limpia

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

      // comportamiento según tipo
      if (hs.tipo === "camera") {
        // store images array in dataset for later
        el.dataset.tipo = "camera";
        el.dataset.imagenes = JSON.stringify(hs.imagenes || []);
        el.dataset.caption = hs.caption || hs.titulo;

        el.addEventListener("click", (evt) => {
          // toggle: si mismo hotspot y ya abierto => cerrar
          if (lastOpenedHotspotId === hs.id && immersiveGallery.getAttribute("visible") === "true") {
            immersiveGallery.setAttribute("visible", "false");
            lastOpenedHotspotId = null;
            return;
          }

          // abrir galería inmersiva con las imágenes del hotspot
          galleryList = hs.imagenes ? hs.imagenes.slice() : [];
          if (galleryList.length === 0) return;
          currentGalleryIndex = 0;
          galleryImage.setAttribute("src", galleryList[currentGalleryIndex]);
          galleryCaption.setAttribute("value", hs.caption || "");
          immersiveGallery.setAttribute("visible", "true");
          lastOpenedHotspotId = hs.id;
        });
      } else { // info
        el.dataset.tipo = "info";
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
  };

  // carga una escena por índice
  const loadScene = (index) => {
    if (!tourData.escenas[index]) return;
    currentSceneIndex = index;
    const escena = tourData.escenas[index];
    setVideoSources(escena);
    createHotspotsForScene(escena);
    // cerrar UI inmersivo o info al cambiar escena
    immersiveGallery.setAttribute("visible", "false");
    infoPanelVR.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  };

  // inicializar primera escena
  loadScene(0);

  // ---------- EVENTOS GALERÍA INMERSIVA ----------
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

  // cerrar info panel (botón dentro)
  infoClose.addEventListener("click", () => {
    infoPanelVR.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  });

  // ---------- BOTONES VIDEO LATERAL ----------
  if (btnPlay) btnPlay.addEventListener("click", () => videoLateral.play());
  if (btnPause) btnPause.addEventListener("click", () => videoLateral.pause());
  if (btnCloseVideo) btnCloseVideo.addEventListener("click", () => {
    videoLateral.pause();
    videoLateral.currentTime = 0;
  });

  // ---------- MENU FLOTANTE (panel emergente) ----------
  // creamos botones de escena dentro de sceneMenu con scale Y=0 inicialmente
  const createSceneMenuButtons = () => {
    sceneMenu.innerHTML = "";
    tourData.escenas.forEach((escena, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.6");
      btn.setAttribute("height", "0.32");
      btn.setAttribute("color", "#ffcc00");
      btn.setAttribute("position", `0 ${-0.38 * i} 0.01`);
      btn.setAttribute("class", "clickable");
      btn.setAttribute("look-at", "[camera]");
      btn.setAttribute("scale", "1 0 1"); // cerrado

      const text = document.createElement("a-text");
      text.setAttribute("value", escena.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#000");
      text.setAttribute("width", "1.5");
      btn.appendChild(text);

      btn.addEventListener("click", () => {
        loadScene(i);
        // cerrar menu inmediatamente
        sceneMenu.children.forEach((c, idx) => c.setAttribute("scale", "1 0 1"));
        setTimeout(() => sceneMenu.setAttribute("visible", "false"), 200 + tourData.escenas.length * 40);
      });

      sceneMenu.appendChild(btn);
    });
  };
  createSceneMenuButtons();

  // toggle con animación por escala Y
  menuIcon.addEventListener("click", () => {
    const visible = sceneMenu.getAttribute("visible") === "true";
    if (!visible) {
      sceneMenu.setAttribute("visible", "true");
      Array.from(sceneMenu.children).forEach((btn, i) => {
        setTimeout(() => btn.setAttribute("scale", "1 1 1"), i * 80);
      });
    } else {
      Array.from(sceneMenu.children).forEach((btn, i) => {
        setTimeout(() => btn.setAttribute("scale", "1 0 1"), i * 40);
      });
      setTimeout(() => sceneMenu.setAttribute("visible", "false"), sceneMenu.children.length * 40 + 100);
    }
  });

  // ---------- DOM gallery (non-VR) ----------
  // para usuarios en navegador no-VR: abrir overlay desde el icono DOM (si existe)
  if (camaraIconDOM) {
    camaraIconDOM.addEventListener("click", () => {
      // abrir overlay DOM con imágenes de la escena actual (si hay alguna camera hotspot)
      const escena = tourData.escenas[currentSceneIndex];
      const camHs = escena.hotspots.find(h => h.tipo === "camera");
      if (!camHs || !camHs.imagenes || !camHs.imagenes.length) return;
      galleryOverlayDOM.classList.add("visible");
      galleryOverlayDOM.classList.remove("hidden");
      galleryImageDOM.src = camHs.imagenes[0];
    });
  }
  if (prevGalleryDOM) prevGalleryDOM.addEventListener("click", () => {
    // navegación DOM simple (solo muestra sample previous/next)
    // for demo keep simple
  });
  if (nextGalleryDOM) nextGalleryDOM.addEventListener("click", () => { /* implement as needed */ });
  if (closeGalleryDOM) closeGalleryDOM.addEventListener("click", () => {
    galleryOverlayDOM.classList.remove("visible");
    setTimeout(() => galleryOverlayDOM.classList.add("hidden"), 250);
  });

  // ---------- exit VR ----------
  const exitVRBtn = document.getElementById("exit-vr-btn");
  if (exitVRBtn) {
    try {
      exitVRBtn.addEventListener("click", () => {
        const sceneEl = document.querySelector("a-scene");
        if (sceneEl) sceneEl.exitVR();
      });
    } catch (e) {
      console.warn("⚠️ Error controlado de A-Frame:", e.message);
    }
  }

  // captura errores a-frame sin romper la app
  window.addEventListener("error", (e) => {
    if (e.filename && e.filename.includes("vr-mode-ui.js")) {
      console.warn("⚠️ Ignorado error interno de A-Frame:", e.message);
      e.preventDefault();
    }
  });

  console.log("✅ Tour VR completamente inicializado");
};
