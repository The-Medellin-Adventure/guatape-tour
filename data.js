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
          titulo: "Piedra del Peñol",
          descripcion: "Un monolito de 220 metros con una vista espectacular del embalse de Guatapé..."
        },
        {
          id: "hs2",
          tipo: "camera",
          x: 2, y: 1, z: -2,
          titulo: "Galería de imágenes",
          descripcion: "Imágenes del lugar",
          imagenes: [
            {src:"images/imagen1.jpeg", caption:"Vista panorámica"},
            {src:"images/guat1.jpeg", caption:"Subida a La Piedra"},
            {src:"images/guat1(2).jpeg", caption:"Escaleras"},
            {src:"images/guat1(3).jpeg", caption:"Cima"},
            {src:"images/guat1(1).jpeg", caption:"Vista desde lejos"}
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
          titulo: "Galería de imágenes",
          descripcion: "Fotos por el malecon y embalse",
          imagenes: [
            {src:"images/guat2.jpeg", caption:"Malecon"},
            {src:"images/guat2(2).jpeg", caption:"Embarcadero"},
            {src:"images/guat2(1).jpeg", caption:"Paisaje"},
            {src:"images/guat2(1).jpg", caption:"Reflejo del embalse"},
            {src:"images/guat2(2).jpg", caption:"Atardecer"}
          ]
        },
        {
          id: "hs4",
          tipo: "info",
          x: -2, y: 1, z: -1,
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
          x: 0, y: 1.5, z: -3,
          titulo: "Guatape – Pueblo de Zocalos",
          descripcion: "Conocido como el pueblo más colorido de Colombia..."
        },
        {
          id: "hs6",
          tipo: "camera",
          x: 2, y: -1, z: -2,
          titulo: "Galería",
          descripcion: "Imágenes del pueblo",
          imagenes: [
            {src:"images/guat3.jpg", caption:"Calle principal"},
            {src:"images/guat3(1).jpeg", caption:"Zócalos"},
            {src:"images/guat(6).jpeg", caption:"Arte callejero"},
            {src:"images/guat3(2).jpeg", caption:"Plaza"}
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
          x: 0, y: 1.5, z: -3,
          titulo: "Calle de las Sombrillas",
          descripcion: "Un rincón lleno de color y magia..."
        },
        {
          id: "hs8",
          tipo: "camera",
          x: 2, y: -1, z: -2,
          titulo: "Galería de Sombrillas",
          descripcion: "Imagenes de la calle",
          imagenes: [
            {src:"images/guata4(1).jpg", caption:"Calle central"},
            {src:"images/guata4(2).jpg", caption:"Sombrillas"},
            {src:"images/guata4(3).jpg", caption:"Tiendas"},
            {src:"images/guata4(4).jpg", caption:"Plaza"},
            {src:"images/guata4(5).jpg", caption:"Atardecer"}
          ]
        }
      ]
    }
  ]
};

export default tourData;
