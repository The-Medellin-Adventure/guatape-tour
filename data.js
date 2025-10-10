const tourData = {
  escenas: [
    {
      id: "escena1",
      titulo: "Guatapé - Escena principal",
      archivo:
        "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/guatape1.mp4",
      lateralVideo:
        "https://pub-1ab3c72b80f94ad28d41f13ba24bec51.r2.dev/video1.mp4",
      hotspots: [
        {
          id: "hs1",
          tipo: "info",
          x: 0,
          y: 1.5,
          z: -3,
          titulo: "Piedra del Peñol",
          descripcion:
            "Un monolito de 220 metros de altura con vista panorámica."
        },
        {
          id: "hs2",
          tipo: "camara",
          x: -1.5,
          y: 1.2,
          z: -2.5,
          titulo: "Vista del embalse",
          descripcion: "Haz clic para ver la galería de imágenes."
        }
      ]
    }
  ]
};

export default tourData;
