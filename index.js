// ===============================
// Guatapé Travel - Control del Tour
// ===============================

function mostrarEscena(id) {
  const escena = window.TOUR_DATA.escenas.find(e => e.id === id);
  if (!escena) return;

  // 🎥 Cargar video principal
  const video360 = document.querySelector("#video360");
  video360.setAttribute("src", escena.archivo);

  // 🎬 Cargar video lateral (si existe)
  const videoLateral = document.querySelector("#videoLateral");
  if (escena.lateralVideo) {
    videoLateral.setAttribute("src", escena.lateralVideo);
    document.getElementById("videoLateralContainer").style.display = "block";
  } else {
    document.getElementById("videoLateralContainer").style.display = "none";
  }

  // 🧹 Limpiar hotspots anteriores
  document.querySelectorAll(".hotspot").forEach(h => h.remove());

  // 🟡 Crear nuevos hotspots
  if (escena.hotspots) {
    const scene = document.querySelector("a-scene");
    escena.hotspots.forEach(hs => {
      const hotspot = document.createElement("a-entity");
      hotspot.setAttribute("geometry", "primitive: sphere; radius: 0.05");
      hotspot.setAttribute("material", "color: #ffd166; shader: flat");
      hotspot.setAttribute("position", hs.posicion);
      hotspot.classList.add("hotspot");

      hotspot.addEventListener("click", () => mostrarInfo(hs.titulo, hs.texto));
      scene.appendChild(hotspot);
    });
  }

  console.log(`✅ Escena cargada: ${escena.nombre}`);
}

// ===============================
// Mostrar información
// ===============================
function mostrarInfo(titulo, texto) {
  const panel = document.getElementById("infoPanel");
  document.getElementById("infoTitulo").textContent = titulo;
  document.getElementById("infoTexto").textContent = texto;
  panel.style.display = "block";
}

function cerrarInfo() {
  document.getElementById("infoPanel").style.display = "none";
}

// ===============================
// Iniciar
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  if (window.TOUR_DATA?.escenas?.length) {
    mostrarEscena(window.TOUR_DATA.escenas[0].id);
  } else {
    console.error("❌ No se encontró ninguna escena en data.js");
  }
});
