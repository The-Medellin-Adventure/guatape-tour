const tourData = {
  escenas: [
    {
      id: "escena1",
      titulo: "Guatapé - Escena principal",
      archivo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/guatape1.mp4",
      lateralVideo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/video1.mp4",
      hotspots: [
        {
          id: "hs1",
          tipo: "info",
          x: -3,
          y: -1,
          z: -2,
          titulo: "Piedra del Peñol",
          descripcion: "Un monolito de 220 metros con una vista espectacular del embalse de Guatapé."
        },
        {
          id: "hs2",
          tipo: "camera",
          x: 2,
          y: 1,
          z: -2,
          titulo: "Plaza - Galería",
          descripcion: "Imágenes del lugar.",
          imagenes: [
            "images/imagen1.jpeg",
            "images/imagen2.jpeg",
            "images/imagen3.jpeg"
          ],
          caption: "Galería — Plaza Principal"
        }
      ]
    },
    {
      id: "escena2",
      titulo: "Guatapé - Calle del Recuerdo",
      archivo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/guatape2.mp4",
      lateralVideo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/video2.mp4",
      hotspots: [
        {
          id: "hs3",
          tipo: "camera",
          x: 1,
          y: 0.5,
          z: -2,
          titulo: "Calle - Galería",
          descripcion: "Fotos de la calle",
          imagenes: [
            "images/imagen2.jpeg",
            "images/imagen3.jpeg",
            "images/imagen1.jpeg"
          ],
          caption: "Galería — Calle del Recuerdo"
        },
        {
          id: "hs4",
          tipo: "info",
          x: -2,
          y: 1,
          z: -1,
          titulo: "Plaza Principal",
          descripcion: "Lugar ideal para disfrutar de comidas típicas."
        }
      ]
    },
    {
      id: "escena3",
      titulo: "Guatapé - Mirador Panorámico",
      archivo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/guatape3.mp4",
      lateralVideo: "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/video3.mp4",
      hotspots: [
        {
          id: "hs5",
          tipo: "info",
          x: 0,
          y: 1.5,
          z: -3,
          titulo: "Mirador de la Piedra",
          descripcion: "Vistas panorámicas de todo el embalse y el pueblo desde lo alto."
        },
        {
          id: "hs6",
          tipo: "camera",
          x: 2,
          y: -1,
          z: -2,
          titulo: "Picnic - Galería",
          descripcion: "Imágenes del mirador y picnic",
          imagenes: [
            "images/imagen3.jpeg",
            "images/imagen1.jpeg"
          ],
          caption: "Galería — Mirador"
        }
      ]
    }
  ]
};

export default tourData;
