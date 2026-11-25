import type uk from './uk.ts'

/** Italian interface text. Same keys as `uk.ts`. */
export default {
  app: {
    name: "Impara l'ora",
    description: 'Un gioco che insegna ai bambini a leggere e impostare l’ora su un orologio.',
    clockShows: 'L’orologio segna {time}',
    clockDrag: 'Orologio con le lancette su {time}. Trascina le lancette.',
    previewAlt:
      "Impara l'ora: un orologio con le lancette e quattro giochi per imparare a leggere e regolare l'ora",
  },
  header: {
    home: 'Home',
    leave: 'Esci',
    languageNow: 'Lingua: {language}',
    themeNow: 'Tema: {theme}',
  },
  themes: { light: 'chiaro', dark: 'scuro' },
  welcome: {
    title: 'Ciao! Impara a leggere l’ora',
    intro:
      'Quattro brevi giochi: metti le ore e poi i minuti sul quadrante, sposta le lancette su un orario e leggi l’ora sull’orologio. Senza registrazione, basta giocare.',
    nameLabel: 'Come ti chiami?',
    namePlaceholder: 'Il tuo nome',
    nameRequired: 'Scrivi il tuo nome',
    start: 'Inizia',
  },
  /** The ⓘ by a heading on a phone, which opens its Info Popup. */
  info: { more: 'Scopri di più', moreAbout: 'Scopri di più: {section}' },
  settings: {
    greeting: '{name}, a cosa giochiamo?',
    game: 'Gioco',
    mode: 'Modalità',
    level: 'Passo dei minuti',
    hours: 'Ore',
    back: 'Indietro',
    play: 'Gioca',
  },
  games: {
    dragHours: {
      name: 'Sposta le ore',
      description: 'Trascina i numeri {range} al loro posto.',
    },
    dragMinutes: {
      name: 'Sposta i minuti',
      description: 'Trascina i minuti 5–60 al loro posto.',
    },
    dragArrows: {
      name: 'Muovi le lancette',
      description: 'Mostra sull’orologio l’orario richiesto.',
    },
    setTime: { name: 'Leggi l’orario', description: 'Guarda l’orologio e scrivi l’orario.' },
  },
  modes: {
    teach: {
      name: 'Impara',
      description: 'Un errore? Ti mostriamo la risposta giusta e ti aiutiamo a correggere.',
    },
    test: { name: 'Verifica', description: 'Senza aiuti. Vedrai il risultato alla fine.' },
  },
  levels: {
    '15': { name: '15 min', description: ':00, :15, :30, :45' },
    '5': { name: '5 min', description: 'Ogni 5 minuti' },
    '1': { name: '1 min', description: 'Ogni minuto' },
  },
  hours: {
    '12': { name: '1–12', description: 'Notte e mattina' },
    '24': { name: '13–24', description: 'Pomeriggio e sera' },
  },
  round: {
    progress: 'Domanda {n} di {total}',
    progressLabel: 'Avanzamento: domanda {n} di {total}',
    question: 'Che ore sono?',
    setHands: 'Sposta le lancette su',
    hourHand: 'Lancetta piccola – ore',
    minuteHand: 'Lancetta grande – minuti',
    hours: 'Ore',
    minutes: 'Minuti',
    /** A box's range, shown under it. */
    range: '{from}–{to}',
    clear: 'Cancella',
    submit: 'Controlla',
    errors: {
      hour: 'Ore: da 1 a 12',
      minute: 'Minuti: da 00 a 59',
    },
  },
  teach: {
    wrongTitle: 'Quasi! Ecco la risposta:',
    gotIt: 'Ho capito',
    setCorrect: 'Metti la risposta giusta',
    right: 'Giusto! Avanti…',
    mistakes: {
      hourAhead:
        'La lancetta piccola non ha ancora raggiunto il numero {next}: quindi l’ora è ancora {hour}.',
      hourOn: 'La lancetta piccola indica il numero {hour}: quindi l’ora è {hour}.',
      hourBetween: 'La lancetta piccola è tra i numeri {hour} e {next}: quindi l’ora è {hour}.',
      minuteZero: 'La lancetta grande indica il numero 12: quindi l’ora esatta è {time}.',
      minuteOn:
        'La lancetta grande indica il numero {number}. Conta di 5 in 5: è il minuto {minute}.',
      minuteBetween:
        'La lancetta grande ha appena superato il numero {number}. Conta le tacche piccole: è il minuto {minute}.',
      swapped: 'Non confondere le lancette: la piccola segna le ore, la grande i minuti.',
      both: 'La lancetta piccola segna le ore ({hour}), la lancetta grande i minuti ({minute}).',
    },
  },
  numbers: {
    heading: 'Metti i numeri al loro posto',
    progress: 'Al loro posto: {n} di {total}',
    progressLabel: 'Avanzamento, numeri al loro posto: {n} di {total}',
    face: 'Quadrante, numeri al loro posto: {n} di 12',
    slot: 'Posto {n}',
    placedTile: '{number} sul posto {n}',
    placedCount: 'Sul quadrante: {n} di {total}',
    placedLabel: 'Numeri sul quadrante: {n} di {total}',
    testHelp: 'Ancora: {n}. Trascina un numero su un altro posto per scambiarli.',
    allPlaced: 'Tutti i numeri sono sul quadrante. Controllali e premi “Fatto”.',
    submit: 'Fatto',
    tray: 'Numeri',
    help: 'Trascina un numero al suo posto, oppure tocca il numero e poi il posto.',
    between: '{number} va tra {before} e {after}',
    showFilled: 'Mostra l’orologio completo',
    filledTitle: 'Ecco come deve essere l’orologio',
    filledFace: 'L’orologio completo: ogni numero al suo posto',
  },
  leave: {
    title: 'Uscire dalla partita?',
    body: 'Questa partita non verrà salvata. Tornerai alla scelta del gioco.',
    stay: 'Continua a giocare',
    leave: 'Esci',
  },
  summary: {
    cheer: 'Ottimo lavoro, {name}!',
    headline: 'Risposte giuste: {right} su {total}',
    numbersHeadline: 'Al posto giusto: {right} su {total}',
    right: 'Giuste',
    wrong: 'Da ripassare',
    firstTry: 'Primo tentativo',
    yourAnswer: 'La tua risposta',
    pair: '{caption} {first}, giusta {answer}',
    numberFirst: '{caption}: {number} sul posto {slot}',
    none: 'Nessuna',
    perfect: 'Nessun errore.',
    tryLevel: 'Prova questo passo: {level}!',
    tryOther: 'Prova un altro gioco o un’altra modalità!',
    playAgain: 'Gioca ancora',
    toSettings: 'Scegli un gioco',
    yourFace: 'Il tuo quadrante',
    correctFace: 'Corretto',
    misplacedNote: 'I numeri cerchiati sono al posto sbagliato',
    yourFaceLabel: 'Il tuo quadrante, al posto sbagliato: {numbers}',
    correctFaceLabel: 'Il quadrante corretto',
    rightFaceLabel: 'Giusti: {numbers}',
  },
  footer: {
    privacy: 'Privacy',
    contact: 'Contatti',
  },
  // The Privacy Page: the app screen (/privacy-policy) and the static privacy/index.html share it.
  privacy: {
    language: 'Lingua',
    title: 'Informativa sulla privacy',
    updated: 'Aggiornata il:',
    version: 'Versione:',
    noDataTitle: 'Nessun dato personale',
    noData:
      "“Impara l'ora” è un gioco per bambini. Non raccoglie dati, non invia nulla a un server, non conserva nulla altrove e non condivide nulla con nessuno.",
    onDeviceTitle: 'Che cosa resta sul tuo dispositivo',
    onDevice:
      'Sul dispositivo restano solo le impostazioni del gioco e l’ultimo nome inserito. I risultati non vengono conservati dopo la fine di una partita. Per cancellarli, elimina i dati dell’app o del sito.',
    noAdsTitle: 'Niente pubblicità, statistiche, account o autorizzazioni',
    noAds:
      'Il gioco non mostra pubblicità, non usa statistiche, tracciamento o servizi di terzi, non richiede un account né autorizzazioni sul dispositivo.',
    childrenTitle: 'Bambini',
    children:
      'Il gioco è pensato per i bambini. Poiché non raccoglie nulla, non raccoglie nulla neppure dai bambini.',
    contactTitle: 'Contatti',
    contactIntro: 'Domande su questa informativa o sul gioco:',
    email: 'E-mail:',
    developerTitle: 'Sviluppatore',
    createdBy: 'Creato da Denys Slobodianyk',
    back: 'Torna al gioco',
  },
} satisfies typeof uk
