import type { MessageSchema } from '.'

/** English interface text. Same keys as `uk.ts`; the language switch arrives with ticket 10. */
export default {
  app: {
    name: 'Teach Clock',
    clockShows: 'The clock shows {time}',
  },
  header: {
    home: 'Home',
    leave: 'Leave',
  },
  welcome: {
    title: 'Hi! Let’s learn to read a clock',
    intro:
      'Three short games: put the numbers on the clock face, set the hands to a time, and read what time the clock shows. No sign-up — just play.',
    nameLabel: 'What’s your name?',
    namePlaceholder: 'Your name',
    start: 'Start',
  },
  settings: {
    greeting: '{name}, what shall we play?',
    game: 'Game',
    mode: 'Mode',
    level: 'Minute step',
    back: 'Back',
    play: 'Play',
  },
  games: {
    dragNumbers: { name: 'Drag Numbers', description: 'Drag the numbers 1–12 to their places.' },
    dragArrows: { name: 'Drag Arrows', description: 'Show the given time on the clock.' },
    setTime: { name: 'Set Time', description: 'Look at the clock and enter the time.' },
  },
  modes: {
    teach: {
      name: 'Teach',
      description: 'Made a mistake? We’ll show what’s right and help you fix it.',
    },
    test: { name: 'Test', description: 'No hints. You’ll see how you did at the end.' },
  },
  levels: {
    '30': { name: '30 min', description: ':00 and :30' },
    '15': { name: '15 min', description: ':00, :15, :30, :45' },
    '5': { name: '5 min', description: 'Every 5 minutes' },
    '1': { name: '1 min', description: 'Any minute' },
  },
  round: {
    progress: 'Task {n} of {total}',
    progressLabel: 'Progress: task {n} of {total}',
    comingSoon: 'The game is coming soon',
    question: 'What time is it?',
    hours: 'Hours',
    minutes: 'Minutes',
    clear: 'Clear',
    submit: 'Check',
    errors: {
      hour: 'Hours go from 1 to 12',
      minute: 'Minutes go from 00 to 59',
    },
  },
  leave: {
    title: 'Leave this Round?',
    body: 'This Round won’t be saved. You’ll go back to choosing a game.',
    stay: 'Keep playing',
    leave: 'Leave',
  },
  summary: {
    headline: '{right} of {total} right',
    right: 'Right',
    wrong: 'Wrong',
    yourAnswer: 'your answer {time}',
    none: 'None',
    playAgain: 'Play again',
    toSettings: 'Back to Settings',
  },
} satisfies MessageSchema
