document.addEventListener("DOMContentLoaded", () => {
  const infoHotspot = document.querySelector("#infoHotspot");
  const cameraHotspot = document.querySelector("#cameraHotspot");
  const infoCard = document.querySelector("#infoCard");

  // Mostrar tarjeta de información
  infoHotspot.addEventListener("click", () => {
    infoCard.style.display = "block";
  });

  // Cerrar tarjeta
  window.closeInfo = function() {
    infoCard.style.display = "none";
  };

  // Hotspot cámara (por ahora muestra alerta, luego pondremos el carrusel)
  cameraHotspot.addEventListener("click", () => {
    alert("Aquí se mostrará el carrusel de imágenes.");
  });
});

// Cambiar de escena
function changeScene(sceneName) {
  const videoSphere = document.querySelector("#video360");
  const videoAsset = document.querySelector("#videoPlaza");

  if (sceneName === "pueblito") {
    videoAsset.setAttribute("src", "video/pueblito.mp4");
  } else {
    videoAsset.setAttribute("src", "video/plaza.mp4");
  }

  videoSphere.setAttribute("src", "#videoPlaza");
}
