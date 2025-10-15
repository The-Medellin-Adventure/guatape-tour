const tourData = {
  escenas: [
    {
      id: "escena1",
      titulo: "La Piedra",
      archivo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/guatape1.mp4",
      lateralVideo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/video1.mp4",
      hotspots: [
        {
          id: "hs1",
          tipo: "info",
          x: -2, y: 1, z: -2,
          titulo: "La Piedra",
          descripcion: "Un monolito de 220 metros con una vista espectacular del embalse de Guatape..."
        },
        {
          id: "hs2",
          tipo: "camera",
          x: 2, y: 1, z: -2,
          titulo: "Galeria de imagenes",
          imagenes: [
            "images/imagen1.jpeg",
            "images/guat1.jpeg",
            "images/guat1(2).jpeg",
            "images/guat1(3).jpeg",
            "images/guat1(1).jpeg"
          ]
        }
      ]
    },

    {
      id: "escena2",
      titulo: "Guatape – Malecon - Embalse",
      archivo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/guatape2.mp4",
      lateralVideo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/video2.mp4",
      hotspots: [
        {
          id: "hs3",
          tipo: "camera",
          x: 1, y: 0.5, z: -2,
          titulo: "Galeria de imagenes",
          imagenes: [
            "images/guat2.jpeg",
            "images/guat2(2).jpeg",
            "images/guat2(1).jpeg",
            "images/guat2(1).jpg",
            "images/guat2(2).jpg"
          ]
        },
        {
          id: "hs4",
          tipo: "info",
           x: -2, y: 1, z: -2,
          titulo: "Paseo en barco",
          descripcion: "El encanto del malecon de Guatape, punto ideal para relajarte..."
        }
      ]
    },

    {
      id: "escena3",
      titulo: "Guatape – Pueblo de Zocalos",
      archivo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/guatape3.mp4",
      lateralVideo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/video3.mp4",
      hotspots: [
        {
          id: "hs5",
          tipo: "info",
           x: -2, y: 1, z: -2,
          titulo: "Guatape – Pueblo de Zocalos",
          descripcion: "Conocido como el pueblo mas colorido de Colombia."
        },
        {
          id: "hs6",
          tipo: "camera",
          x: 2, y: -1, z: -2,
          titulo: "Galeria",
          imagenes: [
            "images/guat3.jpg",
            "images/guat3(1).jpeg",
            "images/guat(6).jpeg",
            "images/guat3(2).jpeg"
          ]
        }
      ]
    },

    {
      id: "escena4",
      titulo: "Calle de las Sombrillas",
      archivo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/guatape4.mp4",
      lateralVideo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/video4.mp4",
      hotspots: [
        {
          id: "hs7",
          tipo: "info",
           x: -2, y: 1, z: -2,
          titulo: "Calle de las Sombrillas",
          descripcion: "Un rincon lleno de color y magia."
        },
        {
          id: "hs8",
          tipo: "camera",
          x: 2, y: -1, z: -2,
          titulo: "Galeria de imagenes",
          imagenes: [
            "images/guata4(1).jpg",
            "images/guata4(2).jpg",
            "images/guata4(3).jpg",
            "images/guata4(4).jpg",
            "images/guata4(5).jpg"
          ]
        }
      ]
    }
  ]
};

export default tourData;
