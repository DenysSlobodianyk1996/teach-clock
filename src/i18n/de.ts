import type uk from './uk.ts'

/** German interface text. Same keys as `uk.ts`. */
export default {
  app: {
    name: 'Uhr lernen',
    description: 'Ein Spiel, mit dem Kinder die Uhr lesen und stellen lernen.',
    clockShows: 'Die Uhr zeigt {time}',
    clockDrag: 'Uhr mit den Zeigern auf {time}. Ziehe die Zeiger.',
    previewAlt:
      'Uhr lernen: eine Uhr mit Zeigern und vier Spiele, um die Uhr lesen und stellen zu lernen',
  },
  header: {
    home: 'Startseite',
    leave: 'Beenden',
    languageNow: 'Sprache: {language}',
    themeNow: 'Design: {theme}',
  },
  themes: { light: 'hell', dark: 'dunkel' },
  welcome: {
    title: 'Hallo! Lerne die Uhr lesen',
    intro:
      'Vier kurze Spiele: Setze die Stunden und dann die Minuten auf das Zifferblatt, stelle die Zeiger auf eine Uhrzeit und lies ab, wie spät es ist. Ohne Anmeldung – einfach spielen.',
    nameLabel: 'Wie heißt du?',
    namePlaceholder: 'Dein Name',
    nameRequired: 'Schreib deinen Namen',
    start: 'Starten',
  },
  /** The ⓘ by a heading on a phone, which opens its Info Popup. */
  info: { more: 'Mehr erfahren', moreAbout: 'Mehr erfahren: {section}' },
  settings: {
    greeting: '{name}, was spielen wir?',
    game: 'Spiel',
    mode: 'Modus',
    level: 'Minutenschritt',
    hours: 'Stunden',
    back: 'Zurück',
    play: 'Spielen',
  },
  games: {
    dragHours: {
      name: 'Stunden ziehen',
      description: 'Ziehe die Zahlen {range} an ihren Platz.',
    },
    dragMinutes: {
      name: 'Minuten ziehen',
      description: 'Ziehe die Minuten 5–60 an ihren Platz.',
    },
    dragArrows: { name: 'Zeiger stellen', description: 'Zeige die genannte Uhrzeit auf der Uhr.' },
    setTime: { name: 'Uhrzeit lesen', description: 'Schau auf die Uhr und gib die Uhrzeit ein.' },
  },
  modes: {
    teach: {
      name: 'Üben',
      description: 'Ein Fehler? Wir zeigen dir, wie es richtig geht, und helfen dir dabei.',
    },
    test: { name: 'Prüfen', description: 'Ohne Hilfe. Dein Ergebnis siehst du am Ende.' },
  },
  levels: {
    '15': { name: '15 Min.', description: ':00, :15, :30, :45' },
    '5': { name: '5 Min.', description: 'Alle 5 Minuten' },
    '1': { name: '1 Min.', description: 'Jede Minute' },
  },
  hours: {
    '12': { name: '1–12', description: 'Nachts und vormittags' },
    '24': { name: '13–24', description: 'Nachmittags und abends' },
  },
  round: {
    progress: 'Aufgabe {n} von {total}',
    progressLabel: 'Fortschritt: Aufgabe {n} von {total}',
    question: 'Wie spät ist es?',
    setHands: 'Stelle die Zeiger auf',
    hourHand: 'Kleiner Zeiger – Stunden',
    minuteHand: 'Großer Zeiger – Minuten',
    hours: 'Stunden',
    minutes: 'Minuten',
    /** A box's range, shown under it. */
    range: '{from}–{to}',
    clear: 'Löschen',
    submit: 'Prüfen',
    errors: {
      hour: 'Stunden: von 1 bis 12',
      minute: 'Minuten: von 00 bis 59',
    },
  },
  teach: {
    wrongTitle: 'Fast! So ist es richtig:',
    gotIt: 'Verstanden',
    setCorrect: 'Richtige Antwort einstellen',
    right: 'Richtig! Weiter…',
    mistakes: {
      hourAhead:
        'Der kleine Zeiger hat die Zahl {next} noch nicht erreicht – die Stunde ist also noch {hour}.',
      hourOn: 'Der kleine Zeiger zeigt auf die Zahl {hour} – die Stunde ist also {hour}.',
      hourBetween:
        'Der kleine Zeiger steht zwischen {hour} und {next} – die Stunde ist also {hour}.',
      minuteZero: 'Der große Zeiger zeigt auf die Zahl 12 – es ist also genau {time}.',
      minuteOn:
        'Der große Zeiger zeigt auf die Zahl {number}. Zähle in Fünferschritten: Das ergibt Minute {minute}.',
      minuteBetween:
        'Der große Zeiger steht kurz hinter der Zahl {number}. Zähle die kleinen Striche: Das ergibt Minute {minute}.',
      swapped: 'Verwechsle die Zeiger nicht: Der kleine zeigt die Stunden, der große die Minuten.',
      both: 'Der kleine Zeiger zeigt die Stunden ({hour}), der große Zeiger die Minuten ({minute}).',
    },
  },
  numbers: {
    heading: 'Bring die Zahlen an ihren Platz',
    progress: '{n} von {total} am Platz',
    progressLabel: 'Fortschritt: {n} von {total} Zahlen am Platz',
    face: 'Zifferblatt, {n} von 12 Zahlen am Platz',
    slot: 'Platz {n}',
    placedTile: '{number} auf Platz {n}',
    placedCount: '{n} von {total} gesetzt',
    placedLabel: '{n} von {total} Zahlen gesetzt',
    testHelp: 'Noch {n}. Zieh eine Zahl auf einen anderen Platz, dann tauschen beide.',
    allPlaced: 'Alle Zahlen sind gesetzt. Prüfe sie und tippe auf „Fertig“.',
    submit: 'Fertig',
    tray: 'Zahlen',
    help: 'Ziehe eine Zahl an ihren Platz oder tippe erst die Zahl und dann den Platz an.',
    between: '{number} gehört zwischen {before} und {after}',
    showFilled: 'Fertige Uhr zeigen',
    filledTitle: 'So soll die Uhr aussehen',
    filledFace: 'Die fertige Uhr: Jede Zahl ist an ihrem Platz',
  },
  leave: {
    title: 'Runde beenden?',
    body: 'Diese Runde wird nicht gespeichert. Du kehrst zur Spielauswahl zurück.',
    stay: 'Weiterspielen',
    leave: 'Beenden',
  },
  summary: {
    cheer: 'Gut gemacht, {name}!',
    headline: '{right} von {total} richtig',
    numbersHeadline: '{right} von {total} am richtigen Platz',
    right: 'Richtig',
    wrong: 'Das üben wir noch',
    firstTry: 'Erster Versuch',
    yourAnswer: 'Deine Antwort',
    pair: '{caption} {first}, richtig {answer}',
    numberFirst: '{caption}: {number} auf Platz {slot}',
    none: 'Keine',
    perfect: 'Keine Fehler.',
    tryLevel: 'Probier den Schritt {level}!',
    tryOther: 'Probier ein anderes Spiel oder einen anderen Modus!',
    playAgain: 'Nochmal spielen',
    toSettings: 'Zur Spielauswahl',
    yourFace: 'Dein Zifferblatt',
    correctFace: 'Korrekt',
    misplacedNote: 'Eingekreiste Zahlen stehen falsch',
    yourFaceLabel: 'Dein Zifferblatt, falsch platziert: {numbers}',
    correctFaceLabel: 'Das richtige Zifferblatt',
    rightFaceLabel: 'Richtig: {numbers}',
  },
  footer: {
    privacy: 'Datenschutz',
    contact: 'Kontakt',
  },
  // The Privacy Page: the app screen (/privacy-policy) and the static privacy/index.html share it.
  privacy: {
    language: 'Sprache',
    title: 'Datenschutzerklärung',
    updated: 'Aktualisiert:',
    version: 'Version:',
    noDataTitle: 'Keine personenbezogenen Daten',
    noData:
      '„Uhr lernen“ ist ein Spiel für Kinder. Es erhebt keine Daten, sendet nichts an einen Server, speichert nichts extern und gibt nichts an andere weiter.',
    onDeviceTitle: 'Was auf deinem Gerät bleibt',
    onDevice:
      'Auf dem Gerät bleiben nur die Spieleinstellungen und der zuletzt eingegebene Name. Ergebnisse werden nach dem Ende einer Runde nicht aufbewahrt. Zum Löschen entferne die Daten der App oder der Website.',
    noAdsTitle: 'Keine Werbung, Analyse, Konten oder Berechtigungen',
    noAds:
      'Das Spiel zeigt keine Werbung, nutzt keine Analyse, kein Tracking und keine Dienste Dritter, braucht kein Konto und fragt nach keinen Geräteberechtigungen.',
    childrenTitle: 'Kinder',
    children:
      'Das Spiel ist für Kinder gemacht. Da es nichts erhebt, erhebt es auch von Kindern nichts.',
    contactTitle: 'Kontakt',
    contactIntro: 'Fragen zu dieser Erklärung oder zum Spiel:',
    email: 'E-Mail:',
    developerTitle: 'Entwickler',
    createdBy: 'Erstellt von Denys Slobodianyk',
    back: 'Zurück zum Spiel',
  },
} satisfies typeof uk
