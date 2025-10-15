import tourData from "./data.js";

window.onload = () => {
  const sceneEl = document.getElementById("scene");
  const sphere = document.getElementById("sphere");
  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralVR = document.getElementById("video-lateral-vr");
  const btnPlay = document.getElementById("btn-play-vr");
  const btnPause = document.getElementById("btn-pause-vr");
  const btnCerrar = document.getElementById("btn-cerrar-vr");

  // ✅ Habilitar reproducción al primer clic (evita bloqueo)
  window.addEventListener("click", () => {
    [videoMain, videoLateral, videoLateralVR].forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, { once: true });

  // 🔹 Transiciones suaves
  const fadeOverlay = document.createElement("a-plane");
  fadeOverlay.setAttribute("id", "fade-overlay");
  fadeOverlay.setAttribute("color", "#000");
  fadeOverlay.setAttribute("width", "100");
  fadeOverlay.setAttribute("height", "100");
  fadeOverlay.setAttribute("position", "0 0 -1");
  fadeOverlay.setAttribute("material", "opacity: 0; transparent: true");
  fadeOverlay.setAttribute("visible", "true");
  sceneEl.appendChild(fadeOverlay);

  function fadeIn(cb) {
    fadeOverlay.setAttribute("animation", "property: material.opacity; from: 1; to: 0; dur: 400;");
    setTimeout(() => cb && cb(), 400);
  }
  function fadeOut(cb) {
    fadeOverlay.setAttribute("animation", "property: material.opacity; from: 0; to: 1; dur: 400;");
    setTimeout(() => cb && cb(), 400);
  }

  let currentSceneIndex = 0;

  function loadScene(index) {
    const data = tourData.escenas[index];
    if (!data) return;

    // 🧹 Detener audios anteriores
    [videoMain, videoLateral, videoLateralVR].forEach((v) => {
      try {
        v.pause();
        v.currentTime = 0;
        v.removeAttribute("src");
        v.load();
      } catch {}
    });

    fadeOut(() => {
      // 🎬 Cargar nuevas fuentes
      videoMain.setAttribute("src", data.archivo);
      videoLateral.setAttribute("src", data.lateralVideo);
      videoLateralVR.setAttribute("src", data.lateralVideo);
      sphere.setAttribute("src", "#video-main");

      fadeIn();

      // ✅ Reproducir solo el video actual
      videoMain.play().catch(() => {});
      setTimeout(() => videoLateralVR.play().catch(() => {}), 800);

      // Cuando termina el principal
      videoMain.onended = () => {
        if (index < tourData.escenas.length - 1) loadScene(index + 1);
      };
    });
  }

  //▶️ Botones del video lateral
  btnPlay.addEventListener("click", () => {
    videoLateralVR.play().catch(() => {});
  });
  btnPause.addEventListener("click", () => {
    videoLateralVR.pause();
  });
  btnCerrar.addEventListener("click", () => {
    videoLateralVR.pause();
    document.getElementById("video-card").setAttribute("visible", "false");
  });

  // 🎯 Activar láser al entrar a VR
  sceneEl.addEventListener("enter-vr", () => {
    const lasers = document.querySelectorAll("[laser-controls]");
    setTimeout(() => {
      lasers.forEach((l) => {
        l.setAttribute("visible", true);
        l.setAttribute("raycaster", "objects: .clickable; lineColor: #ffd34d");
      });
    }, 400);
  });

  sceneEl.addEventListener("loaded", () => {
    const lasers = document.querySelectorAll("[laser-controls]");
    lasers.forEach((l) => {
      l.setAttribute("visible", true);
      l.setAttribute("raycaster", "objects: .clickable; lineColor: #ffd34d");
    });
  });

  // 🚀 Iniciar tour
  loadScene(0);
};
