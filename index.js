import tourData from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const escena = tourData.escenas[0];
  const mainVideo = document.getElementById("main-video");
  const lateralVideo = document.getElementById("lateral-video");
  const hotspotsContainer = document.getElementById("hotspots-container");

  // Cargar videos
  mainVideo.src = escena.archivo;
  lateralVideo.src = escena.lateralVideo;

  // Crear hotspots
  escena.hotspots.forEach(hs => {
    const el = document.createElement("div");
    el.className = "hotspot";
    el.style.left = hs.x;
    el.style.top = hs.y;
    el.title = hs.titulo;

    el.addEventListener("click", () => {
      alert(`${hs.titulo}\n${hs.descripcion}`);
      if (hs.link) window.open(hs.link, "_blank");
    });

    hotspotsContainer.appendChild(el);
  });
});
