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
          x: -2,
          y: 1,
          z: -2,
          titulo: "Piedra del Penol",
          descripcion:
            "Un monolito de 220 metros con una vista espectacular del embalse de Guatapé. Imponente y majestuosa, La Piedra del Peñol es uno de los monumentos naturales más impresionantes de Colombia."
        },
        {
          id: "hs2",
          tipo: "camera",
          x: 2,
          y: 1,
          z: -2,
          titulo: "Galeria de imagenes",
          descripcion: "Imágenes del lugar.",
          imagenes: [
            "images/imagen1.jpeg",
            "images/guat1.jpeg",
            "images/guat1(2).jpeg",
            "images/guat1(3).jpeg",
            "images/guat1(1).jpeg"
          ],
          caption: "Imagenes"
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
          x: 1,
          y: 0.5,
          z: -2,
          titulo: "Galeria de imagenes",
          descripcion: "Fotos por el malecon y embalse",
          imagenes: [
            "images/guat2.jpeg",
            "images/guat2(2).jpeg",
            "images/guat2(1).jpeg",
            "images/guat2(1).jpg",
            "images/guat2(2).jpg"
          ],
          caption: "Galería de imagenes"
        },
        {
          id: "hs4",
          tipo: "info",
          x: -2,
          y: 1,
          z: -1,
          titulo: "Paseo en barco",
          descripcion: "El encanto del malecón de Guatapé, punto ideal para relajarte y disfrutar la vista del embalse.
Emprende un paseo en barco y vive una experiencia inolvidable entre montañas, islas y paisajes únicos."
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
          x: 0,
          y: 1.5,
          z: -3,
          titulo: "Guatape – Pueblo de Zocalos",
          descripcion:
            "Conocido como el pueblo más colorido de Colombia, Guatapé encanta con sus zócalos llenos de arte, calles vibrantes y un ambiente alegre que refleja la calidez de su gente."
        },
        {
          id: "hs6",
          tipo: "camera",
          x: 2,
          y: -1,
          z: -2,
          titulo: "Picnic - Galería",
          descripcion: "Imágenes del mirador y la zona de picnic.",
          imagenes: [
            "images/guat3.jpg",
            "images/guat3(1).jpeg",
            "images/guat(6).jpeg",
            "images/guat3(2).jpeg"
          ],
          caption: "Galeria de imagenes"
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
          id: "hs5",
          tipo: "info",
          x: 0,
          y: 1.5,
          z: -3,
          titulo: "Calle de las Sombrillas y Plaza de los Zocalos",
          descripcion:
            "Un rincón lleno de color y magia. Las sombrillas suspendidas decoran el cielo, guiando el camino hacia la Plaza de los Zócalos, donde el arte y la tradición dan vida al corazón de Guatapé.."
        },
        {
          id: "hs6",
          tipo: "camera",
          x: 2,
          y: -1,
          z: -2,
          titulo: "Calle de las Sombrillas y Plaza de los Zócalos",
          descripcion: "Imagenes",
          imagenes: [
            "images/guata4(1).jpg",
            "images/guata4(2).jpg",
            "images/guata4(3).jpg",
            "images/guata4(4).jpg",
            "images/guata4(5).jpg",
            "images/guata4(1).jpg"
          ],
          caption: "Galería — Mirador"
        }
      ]
    }
  ]
};

export default tourData;
