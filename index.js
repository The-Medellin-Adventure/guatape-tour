import tourData from "./data.js";

window.onload = () => {
  const sceneEl = document.getElementById("scene");
  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralNormal = document.getElementById("video-lateral-normal");

  const hotspotContainerVR = document.getElementById("hotspot-container");
  const infoPanelVR = document.getElementById("info-panel-vr");
  const infoTitleVR = document.getElementById("info-title-vr");
  const infoDescVR = document.getElementById("info-desc-vr");
  const infoClose = document.getElementById("info-close");

  const camaraIconVR = document.getElementById("camara-icon-vr");
  const galleryOverlay = document.getElementById("gallery-overlay");
  const galleryWrapper = document.getElementById("gallery-wrapper");
  const galleryClose = document.getElementById("close-gallery");

  const btnPlay = document.getElementById("btn-play");
  const btnPause = document.getElementById("btn-pause");
  const btnCloseVideo = document.getElementById("btn-close-video");

  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  const exitVrBtn = document.getElementById("exit-vr-btn");

  let currentSceneIndex = 0;
  let currentGalleryIndex = 0;
  let galleryList = [];
  let lastOpenedHotspotId = null;

  // autoplay policy
  const startPlayback = () => {
    videoMain.play().catch(() => {});
    videoLateral.play().catch(() => {});
    window.removeEventListener("click", startPlayback);
  };
  window.addEventListener("click", startPlayback);

  // cargar escena
  function loadScene(index) {
    const sceneData = tourData.escenas[index];
    if (!sceneData) return;
    currentSceneIndex = index;

    videoMain.src = sceneData.archivo;
    videoLateral.src = sceneData.lateralVideo;
    videoLateralNormal.src = sceneData.lateralVideo;

    createHotspotsForScene(sceneData);

    // cerrar UIs
    infoPanelVR.setAttribute("visible", "false");
    galleryOverlay.style.display = "none";
    lastOpenedHotspotId = null;
  }

  // hotspots
  function createHotspotsForScene(sceneData) {
    hotspotContainerVR.innerHTML = "";
    sceneData.hotspots.forEach(hs => {
      const el = document.createElement("a-image");
      el.setAttribute("position", `${hs.x} ${hs.y} ${hs.z}`);
      el.setAttribute("look-at", "[camera]");
      el.setAttribute("class", "clickable");

      // icono según tipo
      el.setAttribute("src", hs.tipo === "info" ? "#info-img" : "#camara-img");
      el.setAttribute("width", "0.5");
      el.setAttribute("height", "0.5");

      el.addEventListener("click", () => {
        if (hs.tipo === "info") {
          infoTitleVR.setAttribute("value", hs.titulo);
          infoDescVR.setAttribute("value", hs.descripcion);
          infoPanelVR.setAttribute("visible", "true");
        } else if (hs.tipo === "camera") {
          galleryList = hs.imagenes.map((img, idx) => ({
            src: img,
            caption: hs.caption + " " + (idx + 1)
          }));
          renderGallery();
          galleryOverlay.style.display = "flex";
        }
      });

      hotspotContainerVR.appendChild(el);
    });
  }

  // cerrar info panel
  infoClose.addEventListener("click", () => {
    infoPanelVR.setAttribute("visible", "false");
  });

  // Carrusel
  function renderGallery() {
    galleryWrapper.innerHTML = "";
    galleryList.forEach(img => {
      const slide = document.createElement("div");
      slide.classList.add("swiper-slide");
      slide.innerHTML = `<img src="${img.src}" /><p>${img.caption}</p>`;
      galleryWrapper.appendChild(slide);
    });
    new Swiper(".swiper", {
      loop: true,
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      pagination: { el: ".swiper-pagination", clickable: true },
    });
  }
  galleryClose.addEventListener("click", () => {
    galleryOverlay.style.display = "none";
  });

  // video lateral
  btnPlay.addEventListener("click", () => videoLateralNormal.play());
  btnPause.addEventListener("click", () => videoLateralNormal.pause());
  btnCloseVideo.addEventListener("click", () => videoLateralNormal.pause());

  // menú de escenas
  menuIcon.addEventListener("click", () => {
    const visible = sceneMenu.getAttribute("visible") === "true";
    sceneMenu.setAttribute("visible", !visible);
    if (!visible) {
      sceneMenu.innerHTML = "";
      tourData.escenas.forEach((s, i) => {
        const scEl = document.createElement("a-plane");
        scEl.setAttribute("width", "1.2");
        scEl.setAttribute("height", "0.3");
        scEl.setAttribute("position", `0 ${-0.35*i} 0`);
        scEl.setAttribute("color", "#ffcc00");
        scEl.setAttribute("class", "clickable");
        const text = document.createElement("a-text");
        text.setAttribute("value", s.titulo);
        text.setAttribute("align", "center");
        text.setAttribute("color", "#000");
        text.setAttribute("width", "1.1");
        scEl.appendChild(text);
        scEl.addEventListener("click", () => loadScene(i));
        sceneMenu.appendChild(scEl);
      });
    }
  });

  // salir VR
  exitVrBtn.addEventListener("click", () => {
    const vrDisplay = sceneEl.renderer.xr.getSession();
    if (vrDisplay) vrDisplay.end();
  });

  loadScene(currentSceneIndex);
};
