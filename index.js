// ===============================
// Guatapé Travel - Control del Tour
// ===============================

async function obtenerUrlBackblaze(file) {
  try {
    const res = await fetch(`/api/download?file=${file}`);
    const data = await res.json();
    return data.downloadUrl || null;
  } catch (err) {
    console.error("Error obteniendo URL Backblaze:", err);
    return null;
  }
}

async function mostrarEscena(id) {
  const escena = window.TOUR_DATA.escenas.find(e => e.id === id);
  if (!escena) return;

  const video360 = document.querySelector("#video360");
  const videoLateral = document.querySelector("#videoLateral");

  // 🎥 Cargar video principal
  if (escena.archivo.startsWith("b2:")) {
    const file = escena.archivo.replace("b2:", "");
    const url = await obtenerUrlBackblaze(file);
    if (url) video360.setAttribute("src", url);
  } else {
    video360.setAttribute("src", escena.archivo);
  }

  // 🎬 Cargar video lateral
  if (escena.lateralVideo) {
    const file = escena.lateralVideo.replace("b2:", "");
    const url = await obtenerUrlBackblaze(file);
    if (url) {
      videoLateral.setAttribute("src", url);
      document.getElementById("videoLateralContainer").style.display = "block";
    }
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

function mostrarInfo(titulo, texto) {
  const panel = document.getElementById("infoPanel");
  document.getElementById("infoTitulo").textContent = titulo;
  document.getElementById("infoTexto").textContent = texto;
  panel.style.display = "block";
}

function cerrarInfo() {
  document.getElementById("infoPanel").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.TOUR_DATA?.escenas?.length) {
    mostrarEscena(window.TOUR_DATA.escenas[0].id);
  } else {
    console.error("❌ No se encontró ninguna escena en data.js");
  }
});

