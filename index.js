import tourData from "./data.js";

window.onload = () => {
  console.log("🌎 Tour 360 Inmersivo iniciado...");

  const sceneEl = document.querySelector("a-scene");
  const sphere = document.getElementById("sphere");

  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralNormal = document.getElementById("video-lateral-normal");

  const hotspotContainerVR = document.getElementById("hotspot-container");
  const infoPanelVR = document.getElementById("info-panel-vr");
  const infoTitleVR = document.getElementById("info-title-vr");
  const infoDescVR = document.getElementById("info-desc-vr");
  const immersiveGallery = document.getElementById("immersive-gallery");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");

  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  let currentSceneIndex = 0;
  let menuVisible = false;

  /* ▶️ Reproducir videos al primer clic */
  const startPlayback = () => {
    videoMain?.play().catch(() => {});
    videoLateral?.play().catch(() => {});
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("click", startPlayback);

  /* 🎥 Cargar escena */
  function loadScene(index) {
    const sceneData = tourData.escenas[index];
    if (!sceneData) return;
    currentSceneIndex = index;

    videoMain.src = sceneData.archivo;
    videoLateral.src = sceneData.lateralVideo;
    videoLateralNormal.src = sceneData.lateralVideo;

    videoMain.load();
    videoLateral.load();
    videoLateralNormal.load();
    sphere.setAttribute("src", "#video-main");

    createHotspots(sceneData);
    console.log("🎬 Escena cargada:", sceneData.titulo);
  }

  /* 📍 Crear hotspots */
  function createHotspots(escena) {
    hotspotContainerVR.innerHTML = "";
    if (!escena.hotspots) return;

    escena.hotspots.forEach((hs) => {
      const el = document.createElement("a-plane");
      el.setAttribute("width", "0.45");
      el.setAttribute("height", "0.45");
      el.setAttribute("material", "src: #info-img; transparent: true; opacity: 0.95");
      el.setAttribute("class", "clickable");
      el.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
      el.setAttribute("look-at", "[camera]");
      el.setAttribute(
        "animation__pulse",
        "property: scale; dir: alternate; dur: 1200; loop: true; to: 1.2 1.2 1.2"
      );

      const text = document.createElement("a-text");
      text.setAttribute("value", hs.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#fff");
      text.setAttribute("position", "0 -0.35 0.01");
      text.setAttribute("width", "1.2");
      el.appendChild(text);

      el.addEventListener("click", () => {
        if (hs.tipo === "info") {
          infoTitleVR.setAttribute("value", hs.titulo);
          infoDescVR.setAttribute("value", hs.descripcion);
          const offsetX = hs.x >= 0 ? hs.x - 0.9 : hs.x + 0.9;
          infoPanelVR.setAttribute("position", `${offsetX} ${hs.y} ${hs.z}`);
          infoPanelVR.setAttribute("visible", "true");
        } else if (hs.tipo === "camera") {
          immersiveGallery.setAttribute("visible", "true");
          galleryImage.setAttribute("src", hs.imagenes[0]);
          galleryCaption.setAttribute("value", hs.caption);
        }
      });

      hotspotContainerVR.appendChild(el);
    });
  }

  /* 🧭 Crear menú profesional */
  function createSceneMenuButtons() {
    sceneMenu.innerHTML = "";

    tourData.escenas.forEach((esc, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.7");
      btn.setAttribute("height", "0.35");
      btn.setAttribute("color", "#ffffff");
      btn.setAttribute("opacity", "0.9");
      btn.setAttribute("position", `0 ${-0.45 * i} 0`);
      btn.setAttribute("class", "clickable");
      btn.setAttribute("look-at", "[camera]");
      btn.setAttribute("shadow", "receive: true");
      btn.setAttribute(
        "animation__hover",
        "property: color; to: #ffd34d; startEvents: mouseenter; dur: 200"
      );
      btn.setAttribute(
        "animation__unhover",
        "property: color; to: #ffffff; startEvents: mouseleave; dur: 200"
      );

      const text = document.createElement("a-text");
      text.setAttribute("value", esc.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#073047");
      text.setAttribute("width", "1.5");
      text.setAttribute("position", "0 0 0.01");
      btn.appendChild(text);

      btn.addEventListener("click", () => {
        loadScene(i);
        toggleMenu(false);
      });

      sceneMenu.appendChild(btn);
    });
  }

  /* ✨ Animar apertura / cierre */
  function toggleMenu(forceState) {
    menuVisible = typeof forceState === "boolean" ? forceState : !menuVisible;
    if (menuVisible) {
      sceneMenu.setAttribute("visible", true);
      sceneMenu.setAttribute(
        "animation__fadein",
        "property: components.material.material.opacity; from: 0; to: 1; dur: 400; easing: easeOutQuad"
      );
      Array.from(sceneMenu.children).forEach((btn, i) => {
        btn.setAttribute("scale", "0.5 0.5 0.5");
        setTimeout(() => {
          btn.setAttribute(
            "animation__in",
            "property: scale; to: 1 1 1; dur: 250; easing: easeOutQuad"
          );
        }, i * 120);
      });
    } else {
      sceneMenu.setAttribute(
        "animation__fadeout",
        "property: components.material.material.opacity; from: 1; to: 0; dur: 300; easing: easeInQuad"
      );
      setTimeout(() => sceneMenu.setAttribute("visible", false), 300);
    }
  }

  /* 👆 Clic en el icono */
  menuIcon.addEventListener("click", () => toggleMenu());

  /* 🕶️ Mostrar automáticamente en VR */
  sceneEl.addEventListener("enter-vr", () => {
    setTimeout(() => toggleMenu(true), 1000);
  });

  /* 🚀 Cargar */
  createSceneMenuButtons();
  loadScene(0);
  console.log("✅ Tour 360 listo con menú profesional");
};
