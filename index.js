import tourData from "./data.js";

window.onload = () => {
  const sceneEl = document.getElementById("scene");
  const sphere = document.getElementById("sphere");
  const videoMain = document.getElementById("video-main");
  const videoLateral = document.getElementById("video-lateral");
  const videoLateralVR = document.getElementById("video-lateral-vr");
  const menuIcon = document.getElementById("menu-icon");
  const sceneMenu = document.getElementById("scene-menu");

  let currentSceneIndex = 0;
  let menuVisible = false;

  // Requerir interacción de usuario antes de reproducir video (móvil)
  function enablePlaybackOnce() {
    videoMain.play().catch(() => {});
    videoLateral.play().catch(() => {});
    window.removeEventListener("click", enablePlaybackOnce);
  }
  window.addEventListener("click", enablePlaybackOnce);

  // Cargar escena
  function loadScene(index) {
    const data = tourData.escenas[index];
    if (!data) return;

    currentSceneIndex = index;
    videoMain.setAttribute("src", data.archivo);
    videoLateral.setAttribute("src", data.lateralVideo);
    videoLateralVR.setAttribute("src", data.lateralVideo);

    sphere.setAttribute("src", "#video-main");

    console.log("🎬 Escena cargada:", data.titulo);
  }

  // Crear menú de escenas profesional azul
  function createSceneMenu() {
    sceneMenu.innerHTML = "";

    // Fondo del menú
    const bg = document.createElement("a-plane");
    bg.setAttribute("color", "#073047");
    bg.setAttribute("width", "1.8");
    bg.setAttribute("height", `${tourData.escenas.length * 0.45 + 0.4}`);
    bg.setAttribute("position", "0 0 0");
    bg.setAttribute("opacity", "0.95");
    sceneMenu.appendChild(bg);

    // Título del menú
    const header = document.createElement("a-text");
    header.setAttribute("value", "🌎 Escenas disponibles");
    header.setAttribute("align", "center");
    header.setAttribute("color", "#ffd34d");
    header.setAttribute("position", "0 0.4 0.01");
    header.setAttribute("width", "1.8");
    sceneMenu.appendChild(header);

    // Botones de escena
    tourData.escenas.forEach((esc, i) => {
      const btn = document.createElement("a-plane");
      btn.setAttribute("width", "1.6");
      btn.setAttribute("height", "0.35");
      btn.setAttribute("color", i === currentSceneIndex ? "#ffd34d" : "#ffffff");
      btn.setAttribute("opacity", "0.95");
      btn.setAttribute("position", `0 ${-0.45 * (i + 1)} 0.01`);
      btn.classList.add("clickable");

      const txt = document.createElement("a-text");
      txt.setAttribute("value", esc.titulo);
      txt.setAttribute("align", "center");
      txt.setAttribute("color", "#073047");
      txt.setAttribute("width", "1.5");
      txt.setAttribute("position", "0 0 0.02");
      btn.appendChild(txt);

      btn.addEventListener("mouseenter", () => btn.setAttribute("color", "#ffd34d"));
      btn.addEventListener("mouseleave", () =>
        btn.setAttribute("color", i === currentSceneIndex ? "#ffd34d" : "#ffffff")
      );
      btn.addEventListener("click", () => {
        loadScene(i);
        toggleMenu(false);
      });

      sceneMenu.appendChild(btn);
    });
  }

  // Mostrar / ocultar menú
  function toggleMenu(force) {
    menuVisible = typeof force === "boolean" ? force : !menuVisible;
    sceneMenu.setAttribute("visible", menuVisible);
  }

  // Clic en icono del menú
  menuIcon.addEventListener("click", () => toggleMenu());

  // Iniciar tour
  createSceneMenu();
  loadScene(0);

  console.log("✅ Tour 360° listo.");
};
