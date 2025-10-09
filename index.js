// ===============================================
// LÓGICA PRINCIPAL DEL TOUR GUATAPÉ 360°
// ===============================================

let escenaActual = null;

// Inicia el tour cuando todo haya cargado
window.addEventListener("DOMContentLoaded", () => {

    // ============================
  // ANIMACIÓN DE INICIO (mundo girando)
  // ============================
  const scene = document.querySelector("#scene");
  const media = document.getElementById("media");

  // Crear esfera de bienvenida
  const esferaInicio = document.createElement("a-sphere");
  esferaInicio.setAttribute("radius", "5");
  esferaInicio.setAttribute("color", "#3fa7d6");
  esferaInicio.setAttribute("material", "shader: flat; opacity: 0.8");
  esferaInicio.setAttribute("animation", "property: rotation; to: 0 360 0; loop: true; dur: 20000");
  esferaInicio.setAttribute("position", "0 0 -5");
  scene.appendChild(esferaInicio);

  // Animación de acercamiento a los 3 segundos
  setTimeout(() => {
    esferaInicio.setAttribute("animation__zoom", "property: scale; to: 0 0 0; dur: 2500; easing: easeInOutQuad");

    // Después de acercarse, mostrar la primera escena del tour
    setTimeout(() => {
      esferaInicio.parentNode.removeChild(esferaInicio);
      mostrarEscena("escena1");
    }, 2500);
  }, 3000);
  // Cargar todos los archivos del tour (videos, imágenes, audios)
  const assets = document.getElementById("assets");
  TOUR_DATA.escenas.forEach((escena) => {
    if (escena.tipo === "video") {
      const vid = document.createElement("video");
      vid.setAttribute("id", escena.id);
      vid.setAttribute("src", escena.archivo);
      vid.setAttribute("loop", true);
      vid.setAttribute("crossorigin", "anonymous");
      assets.appendChild(vid);
    } else {
      const img = document.createElement("img");
      img.setAttribute("id", escena.id);
      img.setAttribute("src", escena.archivo);
      assets.appendChild(img);
    }

    // Precargar audios
    const audio = document.createElement("audio");
    audio.setAttribute("id", `audio-${escena.id}`);
    audio.setAttribute("src", escena.audioGuia);
    assets.appendChild(audio);
  });

  // Mostrar la primera escena
  mostrarEscena("escena1");

  // Bloquear clic derecho y teclas de inspección
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (
      e.ctrlKey &&
      ["s", "u", "c", "i", "j"].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
    }
  });
});

// Cambia de escena
function mostrarEscena(id) {
  const escena = TOUR_DATA.escenas.find((e) => e.id === id);
  if (!escena) return;

  escenaActual = escena;

  const media = document.getElementById("media");
  const sceneTitle = document.getElementById("sceneTitle");
  const audioGuia = document.getElementById("audioGuia");
  const hotspot = document.getElementById("hotspot");

  // Limpia cualquier media anterior
  media.innerHTML = "";

  // Crear nueva esfera según el tipo
  let elemento;
  if (escena.tipo === "video") {
    elemento = document.createElement("a-videosphere");
    elemento.setAttribute("src", `#${escena.id}`);
  } else {
    elemento = document.createElement("a-sky");
    elemento.setAttribute("src", `#${escena.id}`);
  }
  elemento.setAttribute("rotation", "0 -90 0");
  media.appendChild(elemento);

  // Mostrar título
  sceneTitle.setAttribute("value", escena.nombre);

  // Reproducir audio del guía
  audioGuia.setAttribute("src", escena.audioGuia);
  audioGuia.components.sound.stopSound();
  audioGuia.components.sound.playSound();

  // Configurar hotspot
  if (escena.hotspotSiguiente) {
    hotspot.setAttribute("visible", true);
    hotspot.setAttribute(
      "onclick",
      `mostrarEscena('${escena.hotspotSiguiente}')`
    );
  } else {
    hotspot.setAttribute("visible", false);
  }
}

