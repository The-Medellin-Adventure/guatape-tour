import tourData from "./data.js";
window.onload = () => {
  const sceneEl=document.getElementById("scene");
  const sphere=document.getElementById("sphere");
  const videoMain=document.getElementById("video-main");
  const videoLateral=document.getElementById("video-lateral");
  const videoLateralVR=document.getElementById("video-lateral-vr");
  const btnPlay=document.getElementById("btn-play-vr");
  const btnPause=document.getElementById("btn-pause-vr");
  const btnCerrar=document.getElementById("btn-cerrar-vr");
  const hotspotContainer=document.getElementById("hotspot-container");
  const infoPanelVR=document.getElementById("info-panel-vr");
  const infoTitleVR=document.getElementById("info-title-vr");
  const infoDescVR=document.getElementById("info-desc-vr");
  const infoCloseVR=document.getElementById("info-close-vr");
  const immersiveGallery=document.getElementById("immersive-gallery");
  const galleryImage=document.getElementById("gallery-image");
  const galleryCaption=document.getElementById("gallery-caption");
  const galleryPrev=document.getElementById("gallery-prev");
  const galleryNext=document.getElementById("gallery-next");
  const galleryClose=document.getElementById("gallery-close");
  const menuIcon=document.getElementById("menu-icon");
  const sceneMenu=document.getElementById("scene-menu");
  const exitVrBtn=document.getElementById("exit-vr-btn");
  const fadeOverlay=document.createElement("a-plane");
  fadeOverlay.setAttribute("id","fade-overlay");
  fadeOverlay.setAttribute("color","#000");
  fadeOverlay.setAttribute("width","100");
  fadeOverlay.setAttribute("height","100");
  fadeOverlay.setAttribute("position","0 0 -1");
  fadeOverlay.setAttribute("material","opacity: 0; transparent: true");
  fadeOverlay.setAttribute("visible","true");
  sceneEl.appendChild(fadeOverlay);
  let currentSceneIndex=0;let menuVisible=false;
  function fadeIn(cb){fadeOverlay.setAttribute("animation","property: material.opacity; from: 1; to: 0; dur: 500;");setTimeout(()=>cb&&cb(),500);}
  function fadeOut(cb){fadeOverlay.setAttribute("animation","property: material.opacity; from: 0; to: 1; dur: 500;");setTimeout(()=>cb&&cb(),500);}
  function loadScene(index){
    [videoMain,videoLateral,videoLateralVR].forEach(v=>{try{v.pause();v.currentTime=0;v.removeAttribute("src");v.load();}catch(e){}});
    setTimeout(()=>{
      const data=tourData.escenas[index];if(!data)return;currentSceneIndex=index;
      fadeOut(()=>{
        videoMain.setAttribute("src",data.archivo);
        videoLateral.setAttribute("src",data.lateralVideo);
        videoLateralVR.setAttribute("src",data.lateralVideo);
        sphere.setAttribute("src","#video-main");
        fadeIn();
        console.log("🎬 Escena cargada:",data.titulo);
        setTimeout(()=>{videoLateralVR.play().catch(()=>{});},800);
        videoMain.onended=()=>{if(currentSceneIndex<tourData.escenas.length-1)loadScene(currentSceneIndex+1);};
      });
    },300);
  }
  btnPlay.addEventListener("click",()=>videoLateralVR.play());
  btnPause.addEventListener("click",()=>videoLateralVR.pause());
  btnCerrar.addEventListener("click",()=>{videoLateralVR.pause();document.getElementById("video-card").setAttribute("visible","false");});
  menuIcon.addEventListener("click",()=>loadScene((currentSceneIndex+1)%tourData.escenas.length));
  exitVrBtn.addEventListener("click",()=>sceneEl.exitVR&&sceneEl.exitVR());
  sceneEl.addEventListener("enter-vr",()=>{const lasers=document.querySelectorAll("[laser-controls]");setTimeout(()=>{lasers.forEach(l=>{l.setAttribute("visible",true);l.setAttribute("raycaster","objects: .clickable; lineColor: #ffd34d");});},500);});
  sceneEl.addEventListener("loaded",()=>{const lasers=document.querySelectorAll("[laser-controls]");lasers.forEach(l=>{l.setAttribute("visible",true);l.setAttribute("raycaster","objects: .clickable; lineColor: #ffd34d");});});
  loadScene(0);
};