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
  const infoCloseVR = document.getElementById("info-close-vr");

  const immersiveGallery = document.getElementById("immersive-gallery");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryPrev = document.getElementById("gallery-prev");
  const galleryNext = document.getElementById("gallery-next");
  const galleryCloseVR = document.getElementById("gallery-close-vr");

  const btnPlayVR = document.getElementById("btn-play-vr");
  const btnPauseVR = document.getElementById("btn-pause-vr");
  const btnCloseVideoVR = document.getElementById("btn-close-video-vr");

  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  const exitVrBtn = document.getElementById("exit-vr-btn");

  let currentSceneIndex = 0;
  let galleryList = [];
  let currentGalleryIndex = 0;
  let lastOpenedHotspotId = null;

  // 🔹 Reproduce los videos al primer clic (necesario para navegadores)
  const startPlayback = () => {
    if (videoMain) videoMain.play().catch(() => {});
    if (videoLateral) videoLateral.play().catch(() => {});
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("click", startPlayback);

  // 🔹 Cargar videos por escena
  function setVideoSourcesForScene(sceneData) {
    if (!sceneData) return;
    if (videoMain) {
      videoMain.src = sceneData.archivo;
      videoMain.load();
    }
    if (videoLateral) {
      videoLateral.src = sceneData.lateralVideo;
      videoLateral.load();
    }
    if (videoLateralNormal) {
      videoLateralNormal.src = sceneData.lateralVideo;
      videoLateralNormal.load();
    }
    if (sphere && videoMain) sphere.setAttribute("src", "#video-main");
  }

  // 🔹 Crear hotspots para cada escena
  function createHotspotsForScene(escena) {
    hotspotContainerVR.innerHTML = "";
    if (!escena || !escena.hotspots) return;

    escena.hotspots.forEach((hs) => {
      const el = document.createElement("a-plane");
      el.setAttribute("width", "0.45");
      el.setAttribute("height", "0.45");
      el.setAttribute("material", "src: #info-img; transparent: true; opacity: 0.98");
      el.setAttribute("class", "clickable hotspot");
      el.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
      el.setAttribute("look-at", "[camera]");
      el.setAttribute(
        "animation__pulse",
        "property: scale; dir: alternate; dur: 1200; loop: true; to: 1.25 1.25 1.25"
      );

      const text = document.createElement("a-text");
      text.setAttribute("value", hs.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#fff");
      text.setAttribute("position", "0 -0.35 0.01");
      text.setAttribute("width", "1");
      el.appendChild(text);

      if (hs.tipo === "camera") {
        el.addEventListener("click", () => {
          if (lastOpenedHotspotId === hs.id && immersiveGallery.getAttribute("visible") === "true") {
            immersiveGallery.setAttribute("visible", "false");
            lastOpenedHotspotId = null;
            return;
          }
          galleryList = hs.imagenes ? hs.imagenes.slice() : [];
          if (!galleryList.length) return;
          currentGalleryIndex = 0;
          galleryImage.setAttribute("src", galleryList[currentGalleryIndex]);
          galleryCaption.setAttribute("value", hs.caption || hs.titulo || "");
          immersiveGallery.setAttribute("visible", "true");
          lastOpenedHotspotId = hs.id;
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

  // 🔹 Cargar escena
  function loadScene(index) {
    const sceneData = tourData.escenas[index];
    if (!sceneData) return;
    currentSceneIndex = index;
    setVideoSourcesForScene(sceneData);
    createHotspotsForScene(sceneData);
    immersiveGallery.setAttribute("visible", "false");
    infoPanelVR.setAttribute("visible", "false");
    lastOpenedHotspotId = null;
    console.log("🎬 Escena cargada:", sceneData.titulo);
  }

  // 🔹 Crear menú de escenas VR
  function createSceneMenuButtons() {
    sceneMenu.innerHTML = "";
    tourData.escenas.forEach((esc, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.6");
      btn.setAttribute("height", "0.32");
      btn.setAttribute("color", "#ffd34d");
      btn.setAttribute("position", `0 ${-0.38 * i} 0.01`);
      btn.setAttribute("class", "clickable");
      btn.setAttribute("look-at", "[camera]");
      btn.setAttribute("scale", "1 0 1");

      const text = document.createElement("a-text");
      text.setAttribute("value", esc.titulo);
      text.setAttribute("align", "center");
      text.setAttribute("color", "#073047");
      text.setAttribute("width", "1.5");
      btn.appendChild(text);

      btn.addEventListener("click", () => {
        loadScene(i);
        Array.from(sceneMenu.children).forEach((c, idx) => {
          setTimeout(() => c.setAttribute("scale", "1 0 1"), idx * 40);
        });
        setTimeout(() => sceneMenu.setAttribute("visible", "false"), 300);
      });

      sceneMenu.appendChild(btn);
    });
  }

  createSceneMenuButtons();

  // 🔹 Mostrar / ocultar menú al hacer clic en el icono
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

  // 🔹 Botones de control de video lateral
  if (btnPlayVR) btnPlayVR.addEventListener("click", () => videoLateral.play().catch(() => {}));
  if (btnPauseVR) btnPauseVR.addEventListener("click", () => videoLateral.pause());
  if (btnCloseVideoVR)
    btnCloseVideoVR.addEventListener("click", () => {
      videoLateral.pause();
      videoLateral.currentTime = 0;
    });

  // 🔹 Botón salir de VR
  if (exitVrBtn)
    exitVrBtn.addEventListener("click", () => {
      try {
        if (sceneEl && sceneEl.exitVR) sceneEl.exitVR();
      } catch (e) {
        console.warn(e);
      }
    });

  // 🔹 Eventos VR
  sceneEl.addEventListener("enter-vr", () => {
    const laserL = document.getElementById("laser-left");
    const laserR = document.getElementById("laser-right");
    const cursor = document.getElementById("cursor");
    if (laserL) laserL.setAttribute("visible", "true");
    if (laserR) laserR.setAttribute("visible", "true");
    if (cursor) cursor.setAttribute("raycaster", "objects: .clickable");

    console.log("🕶️ Entrando a VR... mostrando menú automáticamente");
    // 💡 Recomendación: abrir el menú automáticamente al entrar a VR
    setTimeout(() => {
      if (menuIcon) menuIcon.emit("click");
    }, 1000);
  });

  sceneEl.addEventListener("exit-vr", () => {
    const laserL = document.getElementById("laser-left");
    const laserR = document.getElementById("laser-right");
    if (laserL) laserL.setAttribute("visible", "false");
    if (laserR) laserR.setAttribute("visible", "false");
    console.log("👋 Saliste del modo VR");
  });

  // 🔹 Carga inicial
  loadScene(0);
  console.log("✅ Tour listo, primera escena cargada.");
};
