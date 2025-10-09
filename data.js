window.TOUR_DATA = {
  titulo: "Tour Virtual - Calle de los Zócalos, Guatapé",
  escenas: [
    {
      id: "zocalos",
      nombre: "Calle de los Zócalos",
      tipo: "video",
      archivo: "/api/download?file=guatape1.mp4", // 🎥 tu video 360 principal
      lateralVideo: "/api/download?file=video1.mp4", // 🎬 video informativo al costado
      descripcion: "Recorre la emblemática Calle de los Zócalos en Guatapé, un rincón lleno de color, cultura y arte.",
      
      // 🟡 Hotspots de información
      hotspots: [
        {
          id: "hs1",
          titulo: "Los Zócalos",
          texto: "Cada casa tiene un zócalo diferente, con figuras que representan la historia o la profesión de sus habitantes.",
          posicion: "2 1.5 -3" // (x, y, z) dónde aparece el punto
        },
        {
          id: "hs2",
          titulo: "Los Colores de Guatapé",
          texto: "El colorido de sus fachadas convierte a Guatapé en uno de los pueblos más fotogénicos de Colombia.",
          posicion: "-1 1.4 -2"
        }
      ]
    }
  ]
};

