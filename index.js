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

  let currentSceneIndex = 0;
  let menuVisible = false;
  let currentGallery = [];
  let currentGalleryIndex = 0;

  // 🔹 Habilitar reproducción tras primer clic (compatibilidad móvil)
  function enablePlaybackOnce() {
    videoMain.play().catch(() => {});
    videoLateral.play().catch(() => {});
    videoLateralVR.play().catch(() => {});
    window.removeEventListener("click", enablePlaybackOnce);
  }
  window.addEventListener("click", enablePlaybackOnce);

  // 🔹 Cargar escena
  function loadScene(index) {
    const data = tourData.escenas[index];
    if (!data) return;

    // 🛑 Detener completamente videos anteriores
    [videoMain, videoLateral, videoLateralVR].forEach((v) => {
      try {
        v.pause();
        v.currentTime = 0;
        v.removeAttribute("src");
        v.load();
      } catch (e) {
        console.warn("⚠️ Error al limpiar video anterior:", e);
      }
    });

    currentSceneIndex = index;

    // 🔹 Asignar nuevas fuentes
    videoMain.setAttribute("src", data.archivo);
    videoLateral.setAttribute("src", data.lateralVideo);
    videoLateralVR.setAttribute("src", data.lateralVideo);
    sphere.setAttribute("src", "#video-main");

    createHotspots(data.hotspots);
    console.log("🎬 Escena cargada:", data.titulo);
  }

  // 🔹 Crear hotspots (fijos, sin movimiento)
  function createHotspots(hotspots) {
    hotspotContainer.innerHTML = "";

    hotspots.forEach((hs, i) => {
      const icon = document.createElement("a-image");
      icon.setAttribute(
        "src",
        hs.tipo === "info" ? "#info-img" : "#camara-img"
      );
      icon.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
      icon.setAttribute("width", "0.45");
      icon.setAttribute("height", "0.45");
      icon.classList.add("clickable");
      icon.setAttribute("look-at", "[camera]");
      icon.setAttribute(
        "animation__fadein",
        `property: opacity; from: 0; to: 1; dur: 800; delay: ${150 * i}`
      );

      // título debajo
      const label = document.createElement("a-text");
      label.setAttribute("value", hs.titulo);
      label.setAttribute("align", "center");
      label.setAttribute("color", "#fff");
      label.setAttribute("position", "0 -0.45 0.01");
      label.setAttribute("width", "1.2");
      icon.appendChild(label);

      // clic
      icon.addEventListener("click", () => {
        if (hs.tipo === "info") {
          showInfoPanel(hs);
        } else if (hs.tipo === "camera") {
          showGallery(hs);
        }
      });

      hotspotContainer.appendChild(icon);
    });
  }

  // 🔹 Mostrar panel informativo
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

  // 🔹 Mostrar galería
  function showGallery(hs) {
    currentGallery = hs.imagenes || [];
    currentGalleryIndex = 0;
    if (currentGallery.length > 0) {
      galleryImage.setAttribute("src", currentGallery[0]);
      galleryCaption.setAttribute(
        "value",
        hs.caption || hs.titulo || "Galería"
      );
      immersiveGallery.setAttribute("visible", "true");
    }
  }

  galleryPrev.addEventListener("click", () => {
    if (!currentGallery.length) return;
    currentGalleryIndex =
      (currentGalleryIndex - 1 + currentGallery.length) %
      currentGallery.length;
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

  // 🔹 Crear menú de escenas (azul profesional)
  function createSceneMenu() {
    sceneMenu.innerHTML = "";

    const bg = document.createElement("a-plane");
    bg.setAttribute("color", "#073047");
    bg.setAttribute("width", "1.8");
    bg.setAttribute(
      "height",
      `${tourData.escenas.length * 0.45 + 0.5}`
    );
    bg.setAttribute("position", "0 0 0");
    bg.setAttribute("opacity", "0.95");
    sceneMenu.appendChild(bg);

    const header = document.createElement("a-text");
    header.setAttribute("value", "🌎 Escenas disponibles");
    header.setAttribute("align", "center");
    header.setAttribute("color", "#ffd34d");
    header.setAttribute("position", "0 0.5 0.01");
    header.setAttribute("width", "1.8");
    sceneMenu.appendChild(header);

    tourData.escenas.forEach((esc, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.6");
      btn.setAttribute("height", "0.35");
      btn.setAttribute(
        "color",
        i === currentSceneIndex ? "#ffd34d" : "#ffffff"
      );
      btn.setAttribute("opacity", "0.95");
      btn.setAttribute("position", `0 ${-0.45 * (i + 1)} 0.01`);
      btn.classList.add("clickable");

      const txt = document.createElement("a-text");
      txt.setAttribute("value", esc.titulo);
      txt.setAttribute("align", "center");
      txt.setAttribute("color", "#073047");
      txt.setAttribute("width", "1.5");
      txt.setAttribute("position", "0 0 0.02");
      btn.appendChild(txt);

      btn.addEventListener("mouseenter", () =>
        btn.setAttribute("color", "#ffd34d")
      );
      btn.addEventListener("mouseleave", () =>
        btn.setAttribute(
          "color",
          i === currentSceneIndex ? "#ffd34d" : "#ffffff"
        )
      );
      btn.addEventListener("click", () => {
        // 🛑 Pausar videos actuales antes de cambiar
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

  // 🔹 Animación suave de apertura/cierre del menú
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

  // 🔹 Clic en icono menú
  menuIcon.addEventListener("click", () => toggleMenu());

  // 🔹 Botón salir VR
  exitVrBtn.addEventListener("click", () => {
    if (sceneEl && sceneEl.exitVR) sceneEl.exitVR();
  });

  // 🔹 Iniciar tour
  createSceneMenu();
  loadScene(0);

  console.log("✅ Tour 360° listo con videos controlados y hotspots fijos.");
};
