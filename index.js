import tourData from "./data.js";

// Esperar a que toda la escena A-Frame esté lista
window.addEventListener("DOMContentLoaded", () => {
  const sceneEl = document.querySelector("a-scene");

  if (!sceneEl) {
    console.error("⚠️ No se encontró <a-scene> en el documento.");
    return;
  }

  sceneEl.addEventListener("loaded", () => {
    console.log("✅ Escena cargada completamente");

    const escena = tourData.escenas[0];

    // ==== VIDEOS PRINCIPALES ====
    const videoMain = document.getElementById("video-main");
    const videoLateral = document.getElementById("video-lateral");
    const videoLateralNormal = document.getElementById("video-lateral-normal");
    const videoLateralVR = document.getElementById("video-lateral-vr");

    if (!videoMain || !videoLateral || !videoLateralNormal) {
      console.error("❌ Faltan elementos de video, revisa los IDs en index.html");
      return;
    }

    // Asignar fuentes
    videoMain.src = escena.archivo;
    videoLateral.src = escena.lateralVideo;
    videoLateralNormal.src = escena.lateralVideo;

    // Reproducir videos con retrasos
    setTimeout(() => {
      videoMain.play().catch(() => console.log("🎥 Interacción requerida para video principal"));
    }, 3000);

    setTimeout(() => {
      videoLateral.muted = false;
      videoLateral.play().catch(() => console.log("🎧 Interacción requerida para video lateral"));
    }, 5000);

    // Click en video lateral VR
    if (videoLateralVR) {
      videoLateralVR.addEventListener("click", () => {
        videoLateral.play().catch(() => console.log("🎬 No se pudo reproducir video lateral VR"));
      });
    }

    // ==== HOTSPOTS ====
    const hotspotList = document.getElementById("hotspot-list");
    const infoPanel = document.getElementById("info-panel");
    const hotspotTitle = document.getElementById("hotspot-title");
    const hotspotDescription = document.getElementById("hotspot-description");
    const closeInfo = document.getElementById("close-info");

    const hotspotContainerVR = document.getElementById("hotspot-container");
    const infoPanelVR = document.getElementById("info-panel-vr");
    const infoTitleVR = document.getElementById("info-title-vr");
    const infoDescVR = document.getElementById("info-desc-vr");

    if (escena.hotspots && escena.hotspots.length > 0) {
      escena.hotspots.forEach((hs, index) => {
        // Hotspot lateral (pantalla normal)
        const item = document.createElement("div");
        item.classList.add("hotspot-item");
        const icon = document.createElement("img");
        icon.src = "img/info.png";
        const title = document.createElement("span");
        title.textContent = hs.titulo;
        item.appendChild(icon);
        item.appendChild(title);
        setTimeout(() => item.classList.add("show"), index * 300);

        item.addEventListener("click", () => {
          hotspotTitle.textContent = hs.titulo;
          hotspotDescription.textContent = hs.descripcion;
          infoPanel.classList.add("show");
          infoPanel.classList.remove("hidden");
        });

        hotspotList.appendChild(item);

        // Hotspot VR
        const hsVR = document.createElement("a-plane");
        hsVR.setAttribute("width", "0.45");
        hsVR.setAttribute("height", "0.45");
        hsVR.setAttribute("material", "src: #info-img; transparent: true; opacity: 0.95");
        hsVR.setAttribute("class", "clickable");

        const adjustedY = hs.y < 1.4 ? hs.y + 0.5 : hs.y;
        hsVR.setAttribute("position", `${hs.x} ${adjustedY} ${hs.z}`);
        hsVR.setAttribute("look-at", "[camera]");
        hsVR.setAttribute(
          "animation__pulse",
          "property: scale; dir: alternate; dur: 1200; loop: true; to: 1.3 1.3 1.3"
        );

        const text = document.createElement("a-text");
        text.setAttribute("value", hs.titulo);
        text.setAttribute("align", "center");
        text.setAttribute("color", "#fff");
        text.setAttribute("position", "0 -0.35 0.01");
        text.setAttribute("width", "1");
        hsVR.appendChild(text);

        hsVR.addEventListener("click", () => {
          infoTitleVR.setAttribute("value", hs.titulo);
          infoDescVR.setAttribute("value", hs.descripcion);
          infoPanelVR.setAttribute("visible", "true");
        });

        hotspotContainerVR.appendChild(hsVR);
      });
    }

    // ==== INFO PANEL ====
    if (closeInfo) {
      closeInfo.addEventListener("click", () => {
        infoPanel.classList.remove("show");
        setTimeout(() => infoPanel.classList.add("hidden"), 300);
      });
    }

    // ==== GALERÍA ====
    const camaraIcon = document.getElementById("camara-icon");
    const camaraIconVR = document.getElementById("camara-icon-vr");
    const galleryOverlay = document.getElementById("gallery-overlay");
    const galleryImage = document.getElementById("gallery-image");
    const prevGallery = document.getElementById("prev-gallery");
    const nextGallery = document.getElementById("next-gallery");
    const closeGallery = document.getElementById("close-gallery");

    const galleryImages = ["images/imagen1.jpeg", "images/imagen2.jpeg"];
    let currentGalleryIndex = 0;

    const showGallery = (index) => {
      galleryImage.style.transform = "scale(0.9)";
      setTimeout(() => {
        galleryImage.src = galleryImages[index];
        galleryImage.style.transform = "scale(1)";
      }, 150);
    };

    const openGallery = () => {
      currentGalleryIndex = 0;
      showGallery(currentGalleryIndex);
      galleryOverlay.classList.add("visible");
      galleryOverlay.classList.remove("hidden");
    };

    if (camaraIcon) camaraIcon.addEventListener("click", openGallery);
    if (camaraIconVR) camaraIconVR.addEventListener("click", openGallery);

    if (prevGallery)
      prevGallery.addEventListener("click", () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        showGallery(currentGalleryIndex);
      });

    if (nextGallery)
      nextGallery.addEventListener("click", () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        showGallery(currentGalleryIndex);
      });

    if (closeGallery)
      closeGallery.addEventListener("click", () => {
        galleryOverlay.classList.remove("visible");
        setTimeout(() => galleryOverlay.classList.add("hidden"), 300);
      });

    // ==== SALIR DE VR ====
    const exitVRBtn = document.getElementById("exit-vr-btn");
    if (exitVRBtn) {
      exitVRBtn.addEventListener("click", () => {
        sceneEl.exitVR();
      });
    }
  });
});
