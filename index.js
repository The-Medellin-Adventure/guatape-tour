async function mostrarEscena(id) {
  const escena = window.TOUR_DATA.escenas.find(e => e.id === id);
  if (!escena) return;

  // Obtener la URL del video 360 desde la API
  const res1 = await fetch(`/api/download?file=${escena.archivo}`);
  const data1 = await res1.json();

  const res2 = await fetch(`/api/download?file=${escena.lateralVideo}`);
  const data2 = await res2.json();

  const video360 = document.querySelector("#video360");
  video360.setAttribute("src", data1.downloadUrl);

  const videoLateral = document.querySelector("#videoLateral");
  videoLateral.setAttribute("src", data2.downloadUrl);

  // Crear hotspot
  const scene = document.querySelector("a-scene");
  scene.querySelectorAll(".hotspot").forEach(h => h.remove());

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

function mostrarInfo(titulo, texto) {
  const panel = document.getElementById("infoPanel");
  document.getElementById("infoTitulo").textContent = titulo;
  document.getElementById("infoTexto").textContent = texto;
  panel.style.display = "block";
}

function cerrarInfo() {
  document.getElementById("infoPanel").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => mostrarEscena("zocalos"));


