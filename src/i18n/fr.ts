import type uk from './uk.ts'

/**
 * French interface text. Same keys as `uk.ts`. A non-breaking space, written as an escape, goes
 * before the marks ! ? : ; and inside French quotes, so that punctuation never starts a line.
 */
export default {
  app: {
    name: "Apprendre l'heure",
    description: 'Un jeu calme pour apprendre à lire l’heure et régler les aiguilles. Sans pub.',
    clockShows: 'L’horloge indique {time}',
    clockDrag: 'Horloge dont les aiguilles indiquent {time}. Fais glisser les aiguilles.',
    previewAlt:
      "Apprendre l'heure : une horloge à aiguilles et quatre jeux pour apprendre à lire et régler l'heure",
  },
  header: {
    home: 'Accueil',
    leave: 'Quitter',
    languageNow: 'Langue\u00a0: {language}',
    themeNow: 'Thème\u00a0: {theme}',
  },
  themes: { light: 'clair', dark: 'sombre' },
  welcome: {
    title: 'Salut\u00a0! Apprends à lire l’heure',
    intro:
      'Quatre petits jeux\u00a0: place les heures puis les minutes sur le cadran, règle les aiguilles sur une heure donnée et lis l’heure affichée. Sans inscription, il suffit de jouer.',
    nameLabel: 'Comment tu t’appelles\u00a0?',
    namePlaceholder: 'Ton prénom',
    nameRequired: 'Écris ton prénom',
    start: 'Commencer',
    googlePlay: 'Disponible sur Google Play',
  },
  /** The ⓘ by a heading on a phone, which opens its Info Popup. */
  info: { more: 'En savoir plus', moreAbout: 'En savoir plus\u00a0: {section}' },
  settings: {
    greeting: '{name}, on joue à quoi\u00a0?',
    game: 'Jeu',
    mode: 'Mode',
    level: 'Pas des minutes',
    hours: 'Heures',
    back: 'Retour',
    play: 'Jouer',
  },
  games: {
    dragHours: {
      name: 'Placer les heures',
      description: 'Fais glisser les nombres {range} à leur place.',
    },
    dragMinutes: {
      name: 'Placer les minutes',
      description: 'Fais glisser les minutes 5–60 à leur place.',
    },
    dragArrows: {
      name: 'Les aiguilles',
      description: 'Montre l’heure demandée sur l’horloge.',
    },
    setTime: { name: 'Lire l’heure', description: 'Regarde l’horloge et écris l’heure.' },
  },
  modes: {
    teach: {
      name: 'Apprendre',
      description: 'Une erreur\u00a0? On te montre la bonne réponse et on t’aide à corriger.',
    },
    test: { name: 'Test', description: 'Sans aide. Tu verras ton résultat à la fin.' },
  },
  levels: {
    '15': { name: '15 min', description: ':00, :15, :30, :45' },
    '5': { name: '5 min', description: 'Toutes les 5 minutes' },
    '1': { name: '1 min', description: 'Chaque minute' },
  },
  hours: {
    '12': { name: '1–12', description: 'La nuit et le matin' },
    '24': { name: '13–24', description: 'L’après-midi et le soir' },
  },
  round: {
    progress: 'Question {n} sur {total}',
    progressLabel: 'Progression\u00a0: question {n} sur {total}',
    question: 'Quelle heure est-il\u00a0?',
    setHands: 'Règle les aiguilles sur',
    hourHand: 'Petite aiguille – heures',
    minuteHand: 'Grande aiguille – minutes',
    hours: 'Heures',
    minutes: 'Minutes',
    /** A box's range, shown under it. */
    range: '{from}–{to}',
    clear: 'Effacer',
    submit: 'Vérifier',
    errors: {
      hour: 'Heures\u00a0: de 1 à 12',
      minute: 'Minutes\u00a0: de 00 à 59',
    },
  },
  teach: {
    wrongTitle: 'Presque\u00a0! Voici la réponse\u00a0:',
    gotIt: 'Compris',
    setCorrect: 'Mettre la bonne réponse',
    right: 'Bravo\u00a0! On continue…',
    mistakes: {
      hourAhead:
        'La petite aiguille n’a pas encore atteint le nombre {next}\u00a0: l’heure reste donc {hour}.',
      hourOn: 'La petite aiguille montre le nombre {hour}\u00a0: l’heure est donc {hour}.',
      hourBetween:
        'La petite aiguille est entre les nombres {hour} et {next}\u00a0: l’heure est donc {hour}.',
      minuteZero: 'La grande aiguille montre le nombre 12\u00a0: l’heure exacte est donc {time}.',
      minuteOn:
        'La grande aiguille montre le nombre {number}. Compte de 5 en 5\u00a0: c’est la minute {minute}.',
      minuteBetween:
        'La grande aiguille a juste dépassé le nombre {number}. Compte les petits traits\u00a0: c’est la minute {minute}.',
      swapped:
        'Ne confonds pas les aiguilles\u00a0: la petite montre les heures, la grande les minutes.',
      both: 'La petite aiguille montre les heures ({hour}), la grande aiguille les minutes ({minute}).',
    },
  },
  numbers: {
    heading: 'Mets les nombres à leur place',
    progress: 'En place\u00a0: {n} sur {total}',
    progressLabel: 'Progression, nombres en place\u00a0: {n} sur {total}',
    face: 'Cadran, nombres en place\u00a0: {n} sur 12',
    slot: 'Place {n}',
    placedTile: '{number} sur la place {n}',
    placedCount: 'Sur le cadran\u00a0: {n} sur {total}',
    placedLabel: 'Nombres sur le cadran\u00a0: {n} sur {total}',
    testHelp: 'Reste à placer\u00a0: {n}. Glisse un nombre sur une autre place pour les échanger.',
    allPlaced: 'Tous les nombres sont placés. Vérifie-les et appuie sur «\u00a0Terminé\u00a0».',
    submit: 'Terminé',
    tray: 'Nombres',
    help: 'Fais glisser un nombre à sa place, ou touche le nombre puis la place.',
    between: '{number} va entre {before} et {after}',
    showFilled: 'Voir l’horloge complète',
    filledTitle: 'Voici à quoi ressemble l’horloge',
    filledFace: 'L’horloge complète\u00a0: chaque nombre à sa place',
  },
  leave: {
    title: 'Quitter la partie\u00a0?',
    body: 'Cette partie ne sera pas enregistrée. Tu reviendras au choix du jeu.',
    stay: 'Continuer',
    leave: 'Quitter',
  },
  summary: {
    cheer: 'Bravo, {name}\u00a0!',
    headline: 'Bonnes réponses\u00a0: {right} sur {total}',
    numbersHeadline: 'À la bonne place\u00a0: {right} sur {total}',
    right: 'Réussi',
    wrong: 'À retravailler',
    firstTry: 'Premier essai',
    yourAnswer: 'Ta réponse',
    pair: '{caption} {first}, bonne réponse {answer}',
    numberFirst: '{caption}\u00a0: {number} sur la place {slot}',
    none: 'Aucun',
    perfect: 'Aucune erreur.',
    tryLevel: 'Essaie ce pas\u00a0: {level}\u00a0!',
    tryOther: 'Essaie un autre jeu ou un autre mode\u00a0!',
    playAgain: 'Encore une partie',
    toSettings: 'Choisir un jeu',
    yourFace: 'Ton cadran',
    correctFace: 'Correct',
    misplacedNote: 'Les nombres entourés sont mal placés',
    yourFaceLabel: 'Ton cadran, mal placés\u00a0: {numbers}',
    correctFaceLabel: 'Le cadran correct',
    rightFaceLabel: 'Réussis\u00a0: {numbers}',
  },
  footer: {
    privacy: 'Confidentialité',
    contact: 'Contact',
  },
  // The Privacy Page: the app screen (/privacy-policy) and the static privacy/index.html share it.
  privacy: {
    language: 'Langue',
    title: 'Politique de confidentialité',
    updated: 'Mise à jour\u00a0:',
    version: 'Version\u00a0:',
    noDataTitle: 'Aucune donnée personnelle',
    noData:
      "«\u00a0Apprendre l'heure\u00a0» est un jeu pour enfants. Il ne collecte aucune donnée, n’envoie rien à un serveur, ne stocke rien à distance et ne partage rien avec personne.",
    onDeviceTitle: 'Ce qui reste sur ton appareil',
    onDevice:
      'Seuls les réglages du jeu et le dernier prénom saisi restent sur l’appareil. Les résultats ne sont pas conservés après la fin d’une partie. Pour les effacer, supprime les données de l’application ou du site.',
    noAdsTitle: 'Ni publicité, ni statistiques, ni compte, ni autorisation',
    noAds:
      'Le jeu n’affiche aucune publicité, n’utilise ni statistiques, ni suivi, ni service tiers, ne demande aucun compte et aucune autorisation sur l’appareil.',
    childrenTitle: 'Enfants',
    children:
      'Le jeu est conçu pour les enfants. Comme il ne collecte rien, il ne collecte rien non plus auprès des enfants.',
    contactTitle: 'Contact',
    contactIntro: 'Questions sur cette politique ou sur le jeu\u00a0:',
    email: 'E-mail\u00a0:',
    developerTitle: 'Développeur',
    createdBy: 'Créé par Denys Slobodianyk',
    back: 'Retour au jeu',
  },
} satisfies typeof uk
