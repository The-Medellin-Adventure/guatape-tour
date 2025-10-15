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

  // Controles del video lateral
  const btnPlay = document.getElementById("btn-play-vr");
  const btnPause = document.getElementById("btn-pause-vr");
  const btnCerrar = document.getElementById("btn-cerrar-vr");
  const videoCard = document.getElementById("video-card");

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
  let currentGallery = [];
  let currentGalleryIndex = 0;
  let playbackEnabled = false; // marca si enablePlaybackOnce ya corrió

  // Habilitar reproducción al primer clic (para evitar bloqueo del navegador)
  function enablePlaybackOnce() {
    // Mute lateral por defecto (para que no compita con el audio principal)
    try {
      [videoMain, videoLateral, videoLateralVR].forEach((v) => {
        v.muted = (v === videoMain) ? false : true; // solo main con audio por defecto
        v.load && v.load();
        v.play && v.play().catch(() => {});
      });
    } catch (e) {
      console.warn("Error en enablePlaybackOnce:", e);
    }
    playbackEnabled = true;
    window.removeEventListener("click", enablePlaybackOnce);
    console.log(▶️ Reproducción habilitada manualmente.");
  }
  window.addEventListener("click", enablePlaybackOnce);

  // Fundido suave
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

  // Limpia y detiene todos los videos (usado al cambiar escena)
  function stopAllVideos() {
    [videoMain, videoLateral, videoLateralVR].forEach((v) => {
      try {
        v.pause();
        v.currentTime = 0;
        // Remover src para liberar buffer si existe
        if (v.getAttribute && v.getAttribute("src")) {
          v.removeAttribute("src");
        } else if (v.src) {
          v.src = "";
        }
        v.load && v.load();
      } catch (e) {
        console.warn("Error al detener video:", e);
      }
    });
  }

  // Cargar escena
  function loadScene(index) {
    const data = tourData.escenas[index];
    if (!data) return;

    // limpiar videos anteriores (asegura que no quede audio)
    stopAllVideos();

    currentSceneIndex = index;

    fadeOut(() => {
      // Asignar nuevas fuentes (use .src direct para elementos <video> en assets)
      try {
        videoMain.setAttribute("src", data.archivo);
        videoLateral.setAttribute("src", data.lateralVideo);
        videoLateralVR.setAttribute("src", data.lateralVideo);
      } catch (e) {
        // fallback directo
        videoMain.src = data.archivo;
        videoLateral.src = data.lateralVideo;
        videoLateralVR.src = data.lateralVideo;
      }

      // Asegurar que el videosphere apunte al videoMain asset
      sphere.setAttribute("src", "#video-main");

      // Crear hotspots
      createHotspots(data.hotspots);

      // Si ya se habilitó reproducción por interacción, intentar play del main
      const tryPlayMain = () => {
        try {
          videoMain.muted = false; // main con audio
          videoMain.load && videoMain.load();
          videoMain.play && videoMain.play().catch((e) => {
            // puede fallar en algunos navegadores si no hay interacción
            console.warn("No se pudo reproducir automáticamente videoMain:", e);
          });
        } catch (e) {
          console.warn("Error al intentar play main:", e);
        }
      };

      // reproducir cuando el metadata esté cargado (evita problemas con archivos grandes)
      videoMain.addEventListener("loadeddata", tryPlayMain, { once: true });

      fadeIn();
      console.log("Escena cargada:", data.titulo);

      // Al finalizar video principal → pasar a siguiente escena
      videoMain.onended = () => {
        if (currentSceneIndex < tourData.escenas.length - 1) {
          loadScene(currentSceneIndex + 1);
        } else {
          console.log("Última escena finalizada.");
        }
      };

      // Detener videos laterales al finalizar (además siempre están muteados por defecto)
      videoLateral.onended = () => videoLateral.pause();
      videoLateralVR.onended = () => videoLateralVR.pause();
    });
  }

  // Crear hotspots
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

  // Panel informativo
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

  // Galería
  function showGallery(hs) {
    currentGallery = hs.imagenes || [];
    currentGalleryIndex = 0;
    if (currentGallery.length > 0) {
      galleryImage.setAttribute("src", currentGallery[0]);
      galleryCaption.setAttribute("value", hs.caption || hs.titulo || "Galería");
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

  // Menú de escenas
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
        stopAllVideos();
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

  // Botones de control del video lateral VR (funcionan y quedan dentro de la tarjeta)
  btnPlay.addEventListener("click", () => {
    // Reproducir el video lateral (muteado por defecto para no competir con audio main)
    try {
      videoLateralVR.muted = true; // mantén true si no quieres audio lateral
      videoLateralVR.play().catch((e) => console.warn("No se pudo reproducir lateral:", e));
      console.log("Video lateral reproducido (VR).");
    } catch (e) {
      console.warn("Error play lateral:", e);
    }
  });

  btnPause.addEventListener("click", () => {
    try {
      videoLateralVR.pause();
      console.log("Video lateral pausado (VR).");
    } catch (e) {
      console.warn("Error pause lateral:", e);
    }
  });

  // Cerrar tarjeta de video lateral: pausa y resetea el video lateral
  btnCerrar.addEventListener("click", () => {
    try {
      videoLateralVR.pause();
      videoLateralVR.currentTime = 0;
      // ocultar tarjeta
      videoCard.setAttribute("visible", "false");
      console.log("Tarjeta de video lateral cerrada.");
    } catch (e) {
      console.warn("Error cerrar tarjeta lateral:", e);
    }
  });

  // Iniciar tour
  createSceneMenu();
  loadScene(0);

  console.log("Tour 360° iniciado y actualizado.");

  // Activar láser al entrar VR (rápido y fiable)
  sceneEl.addEventListener("enter-vr", () => {
    // Aseguramos visible=true y re-configuramos raycaster (pequeño delay para que controllers estén listos)
    const lasers = document.querySelectorAll("[laser-controls]");
    lasers.forEach((l) => l.setAttribute("visible", false)); // reset
    setTimeout(() => {
      lasers.forEach((l) => {
        l.setAttribute("visible", true);
        l.setAttribute("raycaster", "objects: .clickable; lineColor: #ffd34d");
      });
      console.log("Láseres activados al entrar VR.");
    }, 300);
  });

  // También activamos láseres si ya estamos en VR al cargar (caso raro)
  if (sceneEl.is("vr-mode")) {
    const lasers = document.querySelectorAll("[laser-controls]");
    lasers.forEach((l) => {
      l.setAttribute("visible", true);
      l.setAttribute("raycaster", "objects: .clickable; lineColor: #ffd34d");
    });
  }
};
