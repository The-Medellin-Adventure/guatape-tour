// ===============================
// GUATAPÉ TRAVEL - TOUR VIRTUAL 360°
// ===============================

window.TOUR_DATA = {
  escenas: [
    {
      id: "zocalos",
      nombre: "Calle de los Zócalos",
      // 🎥 Video principal 360° desde Backblaze
      archivo: "b2:videos/guatape1.mp4",

      // 🎬 Video lateral pequeño
      lateralVideo: "b2:video1.mp4",

      // 🟡 Hotspots informativos
      hotspots: [
        {
          titulo: "Los Zócalos de Guatapé",
          texto: "Cada casa de esta calle luce zócalos coloridos que reflejan historias y tradiciones locales.",
          posicion: "1 1.5 -3"
        },
        {
          titulo: "Artesanías y Cultura",
          texto: "Aquí puedes encontrar talleres donde los artesanos elaboran los zócalos a mano.",
          posicion: "-2 1.5 -2"
        },
        {
          titulo: "Mirador del Callejón",
          texto: "Un punto ideal para capturar las mejores fotos de la calle y sus colores vibrantes.",
          posicion: "0 1.3 2"
        }
      ]
    }
  ]
};
