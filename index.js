// =============================================
// 🎥 TOUR VIRTUAL 360° - CALLE DE LOS ZÓCALOS
// =============================================

// 📌 Función principal: cargar una escena
function mostrarEscena(id) {
  const escena = window.TOUR_DATA.escenas.find(e => e.id === id);
  if (!escena) {
    console.error("❌ No se encontró la escena:", id);
    return;
  }

  // 🎬 Cargar video principal (videosphere)
  const video360 = document.querySelector("#video360");
  video360.setAttribute("src", escena.archivo);

  // 🎥 Cargar video lateral informativo
  const videoLateral = document.querySelector("#videoLateral");
  if (escena.lateralVideo) {
    videoLateral.setAttribute("src", escena.lateralVideo);
    document.getElementById("videoLateralContainer").style.display = "block";
  } else {
    document.getElementById("videoLateralContainer").style.display = "none";
  }

  // 🔄 Eliminar hotspots anteriores (si los hay)
  document.querySelectorAll(".hotspot").forEach(h => h.remove());

  // 🟡 Crear nuevos hotspots de información
  if (escena.hotspots && escena.hotspots.length > 0) {
    escena.hotspots.forEach(hs => {
      const hotspot = document.createElement("a-entity");
      hotspot.setAttribute("geometry", "primitive: sphere; radius: 0.05");
      hotspot.setAttribute("material", "color: #ffd166; shader: flat");
      hotspot.setAttribute("position", hs.posicion);
      hotspot.classList.add("hotspot");

      // Al hacer clic, muestra la información
      hotspot.addEventListener("click", () => {
        mostrarInfo(hs.titulo, hs.texto);
      });

      document.querySelector("a-scene").appendChild(hotspot);
    });
  }

  console.log(`✅ Escena cargada: ${escena.nombre}`);
}

// =============================================
// 🧠 Panel informativo al hacer clic en un hotspot
// =============================================
function mostrarInfo(titulo, texto) {
  const panel = document.getElementById("infoPanel");
  const tituloEl = document.getElementById("infoTitulo");
  const textoEl = document.getElementById("infoTexto");

  tituloEl.textContent = titulo;
  textoEl.textContent = texto;
  panel.style.display = "block";
}

function cerrarInfo() {
  const panel = document.getElementById("infoPanel");
  panel.style.display = "none";
}

// =============================================
// 🚀 Inicializar el tour al cargar la página
// =============================================
window.addEventListener("DOMContentLoaded", () => {
  // Esperar un momento por si data.js tarda en cargar
  setTimeout(() => {
    if (window.TOUR_DATA && window.TOUR_DATA.escenas && window.TOUR_DATA.escenas.length > 0) {
      const primera = window.TOUR_DATA.escenas[0];
      mostrarEscena(primera.id);
    } else {
      console.error("⚠️ No se encontraron escenas en data.js");
    }
  }, 500);
});

// =============================================
// 🧭 Extras opcionales (control manual o depuración)
// =============================================

// Si quieres probar cambiar de escena manualmente desde la consola:
// mostrarEscena("zocalos");


