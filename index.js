import tourData from "./data.js";

/*
  index.js - lógica principal
  - carga escenas (videos 360)
  - crea hotspots (info / camera)
  - maneja gallery inmersiva (A-Frame) y overlay DOM (no-VR)
  - menú flotante de escenas dentro de la escena (A-Frame)
  - activa lasers automáticamente al enter-vr
  - enlaza controles DOM <-> VR entities
*/

window.onload = () => {
  console.log("🔵 App inicializada");

  // ELEMENTOS DOM / A-FRAME
  const sceneEl = document.querySelector("a-scene");
  const sphere = document.getElementById("sphere");

  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralNormal = document.getElementById("video-lateral-normal");

  const hotspotContainerVR = document.getElementById("hotspot-container");
  const infoPanelVR = document.getElementById("info-panel-vr");
  const infoTitleVR = document.getElementById("info-title-vr");
  const infoDescVR = document.getElementById("info-desc-vr");
  const infoCloseVR = document.getElementById("info-close-vr");

  const immersiveGallery = document.getElementById("immersive-gallery");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryPrev = document.getElementById("gallery-prev");
  const galleryNext = document.getElementById("gallery-next");
  const galleryCloseVR = document.getElementById("gallery-close-vr");

  const btnPlayDOM = document.getElementById("btn-play");
  const btnPauseDOM = document.getElementById("btn-pause");
  const btnCloseDOM = document.getElementById("btn-cerrar");

  const btnPlayVR = document.getElementById("btn-play-vr");
  const btnPauseVR = document.getElementById("btn-pause-vr");
  const btnCloseVideoVR = document.getElementById("btn-close-video-vr");

  const camaraIconVR = document.getElementById("camara-icon-vr");
  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  const exitVrBtn = document.getElementById("exit-vr-btn");

  // DOM overlay gallery
  const galleryOverlay = document.getElementById("gallery-overlay");
  const galleryImageDOM = document.getElementById("gallery-image");
  const prevGallery = document.getElementById("prev-gallery");
  const nextGallery = document.getElementById("next-gallery");
  const closeGallery = document.getElementById("close-gallery");

  // Estado
  let currentSceneIndex = 0;
  let galleryList = [];
  let currentGalleryIndex = 0;
  let lastOpenedHotspotId = null;

  // ------------------------------------------------------------
  // START PLAYBACK (autoplay policies) - reproducir tras primer click
  const startPlayback = () => {
    if (videoMain) videoMain.play().catch(()=>{});
    if (videoLateral) { videoLateral.muted = false; videoLateral.play().catch(()=>{}); }
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("click", startPlayback);

  // ------------------------------------------------------------
  // Utilidades
  function setVideoSourcesForScene(sceneData) {
    if (!sceneData) return;
    if (videoMain) videoMain.src = sceneData.archivo;
    if (videoLateral) videoLateral.src = sceneData.lateralVideo;
    if (videoLateralNormal) videoLateralNormal.src = sceneData.lateralVideo;
    // actualizar a-videosphere src (usando id del elemento video)
    if (sphere && videoMain) {
      // aseguramos que a-videosphere apunte a #video-main
      sphere.setAttribute("src", "#video-main");
    }
  }

  // crea hotspots en la escena (info / camera)
  function createHotspotsForScene(escena) {
    hotspotContainerVR.innerHTML = "";
    if (!escena || !escena.hotspots) return;

    escena.hotspots.forEach(hs => {
      const el = document.createElement("a-plane");
      el.setAttribute("width", "0.45");
      el.setAttribute("height", "0.45");
      el.setAttribute("material", "src: #info-img; transparent: true; opacity: 0.95");
      el.setAttribute("class", "clickable hotspot");
      el.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
      el.setAttribute("look-at", "[camera]");
      el.setAttribute("animation__pulse", "property: scale; dir: alternate; dur: 1200; loop: true; to: 1.3 1.3 1.3");

      const text = document.createElement("a-text");
      text.setAttribute("value", hs.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#fff");
      text.setAttribute("position", "0 -0.35 0.01");
      text.setAttribute("width", "1");
      el.appendChild(text);

      // comportamiento
      if (hs.tipo === "camera") {
        el.addEventListener("click", () => {
          // toggle: si mismo hotspot y abierto -> cerrar
          if (lastOpenedHotspotId === hs.id && immersiveGallery.getAttribute("visible") === "true") {
            immersiveGallery.setAttribute("visible", "false");
            lastOpenedHotspotId = null;
            return;
          }
          // abrir galería inmersiva con imágenes
          galleryList = hs.imagenes ? hs.imagenes.slice() : [];
          if (!galleryList.length) return;
          currentGalleryIndex = 0;
          // Actualizar a-entity gallery-image a la URL actual
          galleryImage.setAttribute("src", galleryList[currentGalleryIndex]);
          galleryCaption.setAttribute("value", hs.caption || hs.titulo || "");
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
            // position the panel next to hotspot
            infoTitleVR.setAttribute("value", hs.titulo);
            infoDescVR.setAttribute("value", hs.descripcion);
            // move info panel near hs (offset on X depending on hs.x sign)
            const offsetX = hs.x >= 0 ? hs.x - 0.9 : hs.x + 0.9;
            const panelPos = `${offsetX} ${hs.y} ${hs.z}`;
            infoPanelVR.setAttribute("position", panelPos);
            infoPanelVR.setAttribute("visible", "true");
            lastOpenedHotspotId = hs.id;
          }
        });
      }

      hotspotContainerVR.appendChild(el);
    });
  }

  // ------------------------------------------------------------
  // Load a scene by index
  function loadScene(index) {
    const sceneData = tourData.escenas[index];
    if (!sceneData) return;
    currentSceneIndex = index;
    setVideoSourcesForScene(sceneData);
    createHotspotsForScene(sceneData);
    // cerrar UIs abiertas
    immersiveGallery.setAttribute("visible", "false");
    infoPanelVR.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  }

  // ------------------------------------------------------------
  // Crear menú de escenas dentro de la escena (A-Frame)
  function createSceneMenuButtons() {
    sceneMenu.innerHTML = "";
    tourData.escenas.forEach((esc, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.6");
      btn.setAttribute("height", "0.32");
      btn.setAttribute("color", "#ffcc00");
      btn.setAttribute("position", `0 ${-0.38 * i} 0.01`);
      btn.setAttribute("class", "clickable");
      btn.setAttribute("look-at", "[camera]");
      btn.setAttribute("scale", "1 0 1");

      const text = document.createElement("a-text");
      text.setAttribute("value", esc.titulo);
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

  // Toggle menu icon behaviour
  createSceneMenuButtons();
  menuIcon.addEventListener("click", () => {
    const visible = sceneMenu.getAttribute("visible") === "true";
    if (!visible) {
      sceneMenu.setAttribute("visible", "true");
      Array.from(sceneMenu.children).forEach((btn, i) => {
        setTimeout(()=>btn.setAttribute("scale","1 1 1"), i * 80);
      });
    } else {
      Array.from(sceneMenu.children).forEach((btn, i) => {
        setTimeout(()=>btn.setAttribute("scale","1 0 1"), i * 50);
      });
      setTimeout(()=>sceneMenu.setAttribute("visible","false"), sceneMenu.children.length * 50 + 80);
    }
  });

  // ------------------------------------------------------------
  // Gallery (immersive) handlers
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
  galleryCloseVR.addEventListener("click", () => {
    immersiveGallery.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  });

  // DOM overlay gallery (non-VR) handlers
  let domGalleryList = ["images/imagen1.jpeg","images/imagen2.jpeg"];
  let domGalleryIndex = 0;
  function showDomGallery(i) {
    galleryImageDOM.src = domGalleryList[i];
  }
  if (prevGallery) prevGallery.addEventListener("click", () => { domGalleryIndex = (domGalleryIndex -1 + domGalleryList.length)%domGalleryList.length; showDomGallery(domGalleryIndex);});
  if (nextGallery) nextGallery.addEventListener("click", () => { domGalleryIndex = (domGalleryIndex +1)%domGalleryList.length; showDomGallery(domGalleryIndex);});
  if (closeGallery) closeGallery.addEventListener("click", () => { galleryOverlay.classList.remove("visible"); setTimeout(()=>galleryOverlay.classList.add("hidden"),250); });

  // open DOM gallery from camara icon (non-VR)
  if (camaraIconVR) camaraIconVR.addEventListener("click", () => {
    // if in VR, handled by a-frame hotspots; here for non-VR open DOM overlay using first camera hotspot images
    if (sceneEl.is('vr-mode')) {
      // ignore - VR handled by immersive gallery
      return;
    }
    const escena = tourData.escenas[currentSceneIndex];
    const cam = escena.hotspots && escena.hotspots.find(h=>h.tipo==='camera');
    if (!cam || !cam.imagenes || !cam.imagenes.length) return;
    domGalleryList = cam.imagenes.slice();
    domGalleryIndex = 0;
    showDomGallery(domGalleryIndex);
    galleryOverlay.classList.remove("hidden");
    galleryOverlay.classList.add("visible");
  });

  // ------------------------------------------------------------
  // Info panel close (VR)
  infoCloseVR.addEventListener("click", () => {
    infoPanelVR.setAttribute("visible","false");
    lastOpenedHotspotId = null;
  });

  // ------------------------------------------------------------
  // Video lateral controls (DOM + VR binding)
  // DOM handlers
  if (btnPlayDOM) btnPlayDOM.addEventListener("click", () => { if (videoLateral) videoLateral.play().catch(()=>{}); });
  if (btnPauseDOM) btnPauseDOM.addEventListener("click", () => { if (videoLateral) videoLateral.pause(); });
  if (btnCloseDOM) btnCloseDOM.addEventListener("click", () => { if (videoLateral) { videoLateral.pause(); videoLateral.currentTime = 0; } });

  // VR entity handlers (mirror)
  if (btnPlayVR) btnPlayVR.addEventListener("click", () => { if (videoLateral) videoLateral.play().catch(()=>{}); });
  if (btnPauseVR) btnPauseVR.addEventListener("click", () => { if (videoLateral) videoLateral.pause(); });
  if (btnCloseVideoVR) btnCloseVideoVR.addEventListener("click", () => { if (videoLateral) { videoLateral.pause(); videoLateral.currentTime = 0; } });

  // ------------------------------------------------------------
  // Exit VR button
  if (exitVrBtn) exitVrBtn.addEventListener("click", () => { try { if (sceneEl && sceneEl.exitVR) sceneEl.exitVR(); } catch(e){ console.warn(e); } });

  // ------------------------------------------------------------
  // Activate lasers and cursor when entering VR (prevents having to suspend/resume)
  sceneEl.addEventListener("enter-vr", () => {
    const laserL = document.getElementById("laser-left");
    const laserR = document.getElementById("laser-right");
    const cursor = document.getElementById("cursor");
    if (laserL) { laserL.setAttribute("visible","true"); laserL.setAttribute("raycaster","objects: .clickable"); }
    if (laserR) { laserR.setAttribute("visible","true"); laserR.setAttribute("raycaster","objects: .clickable"); }
    if (cursor) { cursor.setAttribute("raycaster","objects: .clickable"); }
    // fire a custom event if some other logic wants it
    window.dispatchEvent(new Event("app-enter-vr"));
    console.log("► enter-vr: lasers y cursor activados");
  });

  sceneEl.addEventListener("exit-vr", () => {
    const laserL = document.getElementById("laser-left");
    const laserR = document.getElementById("laser-right");
    if (laserL) laserL.setAttribute("visible","false");
    if (laserR) laserR.setAttribute("visible","false");
    console.log("► exit-vr: lasers ocultos");
  });

  // ------------------------------------------------------------
  // Inicializar: cargar primera escena (index 0)
  loadScene(0);

  console.log("✅ Tour VR inicializado correctamente");
};
