import type uk from './uk.ts'

/** Spanish interface text. Same keys as `uk.ts`. */
export default {
  app: {
    name: 'Aprende la hora',
    description: 'Un juego que enseña a los niños a leer y poner la hora en un reloj de agujas.',
    clockShows: 'El reloj marca {time}',
    clockDrag: 'Reloj con las manecillas en {time}. Arrastra las manecillas.',
    previewAlt:
      'Aprende la hora: un reloj de agujas y cuatro juegos para aprender a leer y poner la hora',
  },
  header: {
    home: 'Inicio',
    leave: 'Salir',
    languageNow: 'Idioma: {language}',
    themeNow: 'Tema: {theme}',
  },
  themes: { light: 'claro', dark: 'oscuro' },
  welcome: {
    title: '¡Hola! Aprende a leer la hora',
    intro:
      'Cuatro juegos cortos: coloca las horas y luego los minutos en la esfera, mueve las manecillas a una hora y lee la hora del reloj. Sin registro, solo jugar.',
    nameLabel: '¿Cómo te llamas?',
    namePlaceholder: 'Tu nombre',
    nameRequired: 'Escribe tu nombre',
    start: 'Empezar',
  },
  /** The ⓘ by a heading on a phone, which opens its Info Popup. */
  info: { more: 'Más información', moreAbout: 'Más información: {section}' },
  settings: {
    greeting: '{name}, ¿a qué jugamos?',
    game: 'Juego',
    mode: 'Modo',
    level: 'Paso de minutos',
    hours: 'Horas',
    back: 'Atrás',
    play: 'Jugar',
  },
  games: {
    dragHours: {
      name: 'Pon las horas',
      description: 'Arrastra los números {range} a su sitio.',
    },
    dragMinutes: {
      name: 'Pon los minutos',
      description: 'Arrastra los minutos 5–60 a su sitio.',
    },
    dragArrows: {
      name: 'Mueve las manecillas',
      description: 'Muestra en el reloj la hora indicada.',
    },
    setTime: { name: 'Lee el reloj', description: 'Mira el reloj y escribe la hora.' },
  },
  modes: {
    teach: {
      name: 'Aprender',
      description: '¿Un error? Te mostramos la respuesta correcta y te ayudamos a arreglarlo.',
    },
    test: { name: 'Prueba', description: 'Sin ayuda. Verás tu resultado al final.' },
  },
  levels: {
    '15': { name: '15 min', description: ':00, :15, :30, :45' },
    '5': { name: '5 min', description: 'Cada 5 minutos' },
    '1': { name: '1 min', description: 'Cada minuto' },
  },
  hours: {
    '12': { name: '1–12', description: 'Madrugada y mañana' },
    '24': { name: '13–24', description: 'Tarde y noche' },
  },
  round: {
    progress: 'Pregunta {n} de {total}',
    progressLabel: 'Progreso: pregunta {n} de {total}',
    question: '¿Qué hora es?',
    setHands: 'Pon las manecillas en',
    hourHand: 'Manecilla pequeña – horas',
    minuteHand: 'Manecilla grande – minutos',
    hours: 'Horas',
    minutes: 'Minutos',
    /** A box's range, shown under it. */
    range: '{from}–{to}',
    clear: 'Borrar',
    submit: 'Comprobar',
    errors: {
      hour: 'Horas: de 1 a 12',
      minute: 'Minutos: de 00 a 59',
    },
  },
  teach: {
    wrongTitle: '¡Casi! Mira la respuesta:',
    gotIt: 'Entendido',
    setCorrect: 'Poner la respuesta correcta',
    right: '¡Correcto! Seguimos…',
    mistakes: {
      hourAhead:
        'La manecilla pequeña aún no ha llegado al número {next}: la hora sigue siendo {hour}.',
      hourOn: 'La manecilla pequeña señala el número {hour}: la hora es {hour}.',
      hourBetween:
        'La manecilla pequeña está entre los números {hour} y {next}: la hora es {hour}.',
      minuteZero: 'La manecilla grande señala el número 12: la hora exacta es {time}.',
      minuteOn:
        'La manecilla grande señala el número {number}. Cuenta de 5 en 5: es el minuto {minute}.',
      minuteBetween:
        'La manecilla grande acaba de pasar el número {number}. Cuenta las marcas pequeñas: es el minuto {minute}.',
      swapped: 'No confundas las manecillas: la pequeña marca las horas y la grande los minutos.',
      both: 'La manecilla pequeña marca las horas ({hour}) y la manecilla grande los minutos ({minute}).',
    },
  },
  numbers: {
    heading: 'Pon los números en su sitio',
    progress: 'En su sitio: {n} de {total}',
    progressLabel: 'Progreso, números en su sitio: {n} de {total}',
    face: 'Esfera, números en su sitio: {n} de 12',
    slot: 'Lugar {n}',
    placedTile: '{number} en el lugar {n}',
    placedCount: 'En la esfera: {n} de {total}',
    placedLabel: 'Números en la esfera: {n} de {total}',
    testHelp: 'Quedan: {n}. Arrastra un número a otro lugar para intercambiarlos.',
    allPlaced: 'Todos los números están en la esfera. Revísalos y pulsa «Listo».',
    submit: 'Listo',
    tray: 'Números',
    help: 'Arrastra un número a su sitio, o toca el número y luego el lugar.',
    between: '{number} va entre {before} y {after}',
    showFilled: 'Ver el reloj completo',
    filledTitle: 'Así debe quedar el reloj',
    filledFace: 'El reloj completo: cada número en su sitio',
  },
  leave: {
    title: '¿Salir de la partida?',
    body: 'Esta partida no se guardará. Volverás a la elección de juego.',
    stay: 'Seguir jugando',
    leave: 'Salir',
  },
  summary: {
    cheer: '¡Muy bien, {name}!',
    headline: 'Respuestas correctas: {right} de {total}',
    numbersHeadline: 'En su sitio: {right} de {total}',
    right: 'Correctas',
    wrong: 'Para practicar',
    firstTry: 'Primer intento',
    yourAnswer: 'Tu respuesta',
    pair: '{caption} {first}, correcta {answer}',
    numberFirst: '{caption}: {number} en el lugar {slot}',
    none: 'Ninguna',
    perfect: 'Sin errores.',
    tryLevel: '¡Prueba este paso: {level}!',
    tryOther: '¡Prueba otro juego u otro modo!',
    playAgain: 'Otra partida',
    toSettings: 'Elegir juego',
    yourFace: 'Tu esfera',
    correctFace: 'Correcta',
    misplacedNote: 'Los números con círculo están mal colocados',
    yourFaceLabel: 'Tu esfera, mal colocados: {numbers}',
    correctFaceLabel: 'La esfera correcta',
    rightFaceLabel: 'Correctos: {numbers}',
  },
  footer: {
    privacy: 'Privacidad',
    contact: 'Contacto',
  },
  // The Privacy Page: the app screen (/privacy-policy) and the static privacy/index.html share it.
  privacy: {
    language: 'Idioma',
    title: 'Política de privacidad',
    updated: 'Actualizada:',
    version: 'Versión:',
    noDataTitle: 'Ningún dato personal',
    noData:
      '«Aprende la hora» es un juego para niños. No recoge datos, no envía nada a ningún servidor, no guarda nada fuera del dispositivo y no comparte nada con nadie.',
    onDeviceTitle: 'Qué se queda en tu dispositivo',
    onDevice:
      'En el dispositivo solo quedan los ajustes del juego y el último nombre escrito. Los resultados no se conservan al terminar una partida. Para borrarlos, elimina los datos de la app o del sitio web.',
    noAdsTitle: 'Sin anuncios, analítica, cuentas ni permisos',
    noAds:
      'El juego no muestra anuncios, no usa analítica, seguimiento ni servicios de terceros, no necesita cuenta y no pide permisos del dispositivo.',
    childrenTitle: 'Niños',
    children:
      'El juego está hecho para niños. Como no recoge nada, tampoco recoge nada de los niños.',
    contactTitle: 'Contacto',
    contactIntro: 'Preguntas sobre esta política o sobre el juego:',
    email: 'Correo:',
    developerTitle: 'Desarrollador',
    createdBy: 'Creado por Denys Slobodianyk',
    back: 'Volver al juego',
  },
} satisfies typeof uk
