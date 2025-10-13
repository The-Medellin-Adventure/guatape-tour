import tourData from "./data.js";

window.onload = () => {
  console.log("🌎 Tour VR cargado");

  // ---------- ELEMENTOS ----------
  const sceneEl = document.querySelector("a-scene");
  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralNormal = document.getElementById("video-lateral-normal");

  const hotspotContainerVR = document.getElementById("hotspot-container");
  const infoPanelVR = document.getElementById("info-panel-vr");
  const infoTitleVR = document.getElementById("info-title-vr");
  const infoDescVR = document.getElementById("info-desc-vr");
  const closeInfoBtn = document.getElementById("close-info-btn");

  const immersiveGallery = document.getElementById("gallery-overlay");
  const galleryWrapper = document.getElementById("gallery-wrapper");
  const closeGalleryBtn = document.getElementById("close-gallery");

  const btnPlay = document.getElementById("btn-play");
  const btnPause = document.getElementById("btn-pause");
  const btnCerrar = document.getElementById("btn-cerrar");

  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  const exitVrBtn = document.getElementById("exit-vr-btn");

  const camaraIconVR = document.getElementById("camara-icon");

  // ---------- ESTADO ----------
  let currentSceneIndex = 0;
  let lastOpenedHotspotId = null;
  let galleryList = [];
  let currentGalleryIndex = 0;

  // ---------- INICIO REPRODUCCIÓN VIDEO ----------
  const startPlayback = () => {
    if (videoMain) videoMain.play().catch(() => {});
    if (videoLateral) videoLateral.play().catch(() => {});
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("click", startPlayback);

  // ---------- FUNCIONES HOTSPOTS ----------
  function createHotspotsForScene(escena) {
    hotspotContainerVR.innerHTML = "";

    if (!escena || !escena.hotspots) return;

    escena.hotspots.forEach(hs => {
      const el = document.createElement("a-plane");
      el.setAttribute("width", "0.45");
      el.setAttribute("height", "0.45");
      el.setAttribute("material", hs.tipo === "camera" ? "src: #camara-icon" : "src: #info-img; transparent:true; opacity:0.95");
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

      if (hs.tipo === "camera") {
        el.addEventListener("click", () => {
          if (lastOpenedHotspotId === hs.id && immersiveGallery.classList.contains("visible")) {
            immersiveGallery.classList.remove("visible");
            lastOpenedHotspotId = null;
            return;
          }
          galleryList = hs.imagenes.slice();
          currentGalleryIndex = 0;
          galleryWrapper.innerHTML = "";
          galleryList.forEach((img, i) => {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            slide.innerHTML = `<img src="${img}" /><p>${hs.caption || ""}</p>`;
            galleryWrapper.appendChild(slide);
          });
          immersiveGallery.classList.add("visible");
          lastOpenedHotspotId = hs.id;

          new Swiper(".swiper", {
            loop: true,
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            pagination: { el: ".swiper-pagination", clickable: true },
          });
        });
      } else {
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

  // ---------- FUNCIONES ESCENAS ----------
  function loadScene(index) {
    const sceneData = tourData.escenas[index];
    if (!sceneData) return;

    currentSceneIndex = index;

    videoMain.src = sceneData.archivo;
    videoLateral.src = sceneData.lateralVideo;
    videoLateralNormal.src = sceneData.lateralVideo;

    createHotspotsForScene(sceneData);

    // Cerrar UIs abiertas
    immersiveGallery.classList.remove("visible");
    infoPanelVR.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  }

  // ---------- MENÚ ESCENAS ----------
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
      btn.setAttribute("scale", "1 0 1");

      const text = document.createElement("a-text");
      text.setAttribute("value", escena.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#000");
      text.setAttribute("width", "1.5");
      btn.appendChild(text);

      btn.addEventListener("click", () => {
        loadScene(i);
        Array.from(sceneMenu.children).forEach((c, idx) => {
          setTimeout(() => c.setAttribute("scale", "1 0 1"), idx * 40);
        });
        setTimeout(() => sceneMenu.setAttribute("visible", "false"), 200 + tourData.escenas.length * 40);
      });

      sceneMenu.appendChild(btn);
    });
  }
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

  // ---------- CIERRE DE INFO Y GALLERY ----------
  closeInfoBtn.addEventListener("click", () => {
    infoPanelVR.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
  });

  closeGalleryBtn.addEventListener("click", () => {
    immersiveGallery.classList.remove("visible");
    lastOpenedHotspotId = null;
  });

  // ---------- CONTROLES VIDEO LATERAL ----------
  btnPlay.addEventListener("click", () => { if (videoLateral) videoLateral.play(); });
  btnPause.addEventListener("click", () => { if (videoLateral) videoLateral.pause(); });
  btnCerrar.addEventListener("click", () => { if (videoLateral) { videoLateral.pause(); videoLateral.currentTime=0; } });

  // ---------- BOTÓN SALIR VR ----------
  if (exitVrBtn) exitVrBtn.addEventListener("click", () => {
    try { if (sceneEl && sceneEl.exitVR) sceneEl.exitVR(); } catch(e){ console.warn("No VR session") }
  });

  // ---------- CURSOR LÁSER VR ----------
  const cursorEl = document.createElement("a-entity");
  cursorEl.setAttribute("laser-controls", "hand: right");
  cursorEl.setAttribute("raycaster", "objects: .clickable");
  cursorEl.setAttribute("line", "color: #fff");
  sceneEl.appendChild(cursorEl);

  // ---------- TARJETA INICIAL PROYECTO ----------
  const proyectoEl = document.createElement("a-entity");
  proyectoEl.setAttribute("position", "0 1.5 -2");
  proyectoEl.setAttribute("look-at", "[camera]");
  const plane = document.createElement("a-plane");
  plane.setAttribute("width", "2.4");
  plane.setAttribute("height", "1.2");
  plane.setAttribute("color", "#111");
  plane.setAttribute("opacity", "0.85");

  const logo = document.createElement("a-image");
  logo.setAttribute("src", "#logo");
  logo.setAttribute("position", "-0.95 0.25 0.01");
  logo.setAttribute("width", "0.6");
  logo.setAttribute("height", "0.6");

  const textProj = document.createElement("a-text");
  textProj.setAttribute("value", "Proyecto desarrollado por The Medellin Adventure");
  textProj.setAttribute("align", "left");
  textProj.setAttribute("color", "#fff");
  textProj.setAttribute("width", "1.7");
  textProj.setAttribute("position", "-0.65 -0.15 0.01");

  plane.appendChild(logo);
  plane.appendChild(textProj);
  proyectoEl.appendChild(plane);
  sceneEl.appendChild(proyectoEl);

  // Ocultar automáticamente tras 5s
  setTimeout(() => {
    proyectoEl.setAttribute("visible", "false");
  }, 5000);

  // ---------- CARGAR PRIMERA ESCENA ----------
  loadScene(0);
};
