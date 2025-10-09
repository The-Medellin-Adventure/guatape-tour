// =========================================
// INFORMACIÓN DEL TOUR GUATAPÉ 360°
// =========================================

// Cada escena puede ser tipo "video" o "imagen".
// Puedes cambiar las rutas de cada archivo según tus nombres.
const TOUR_DATA = {
  titulo: "🏞️ Guatapé Virtual Tour 360°",
  escenas: [
    {
      id: "escena1",
      nombre: "Malecón de Guatapé",
      tipo: "video",
      archivo: "videos/guatape1.mp4",
      audioGuia: "audios/guia1.mp3",
      hotspotSiguiente: "escena2",
      descripcion:
        "Disfruta de una vista panorámica del Malecón, con sus coloridas fachadas y el reflejo del embalse.",
    },
    {
      id: "escena2",
      nombre: "Plaza Principal",
      tipo: "imagen",
      archivo: "imagenes/plaza.jpg",
      audioGuia: "audios/guia2.mp3",
      hotspotSiguiente: "escena3",
      descripcion:
        "Aquí se encuentra el corazón del pueblo, rodeado de zócalos y tradiciones.",
    },
    {
      id: "escena3",
      nombre: "Vista del Embalse",
      tipo: "video",
      archivo: "videos/guatape2.mp4",
      audioGuia: "audios/guia1.mp3",
      hotspotSiguiente: null, // última escena
      descripcion:
        "Desde aquí puedes ver el inmenso embalse y la piedra del Peñol dominando el paisaje.",
    },
  ],
};

