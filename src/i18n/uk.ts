/** Ukrainian interface text. Every screen's text goes through these keys. */
export default {
  app: {
    name: 'Вчимо годинник',
    clockShows: 'Годинник показує {time}',
    clockDrag: 'Годинник зі стрілками на {time}. Перетягни стрілки.',
  },
  header: {
    home: 'Додому',
    leave: 'Вийти',
  },
  welcome: {
    title: 'Привіт! Навчимося читати годинник',
    intro:
      'Три короткі ігри: розстав числа на циферблаті, постав стрілки на потрібний час і прочитай, котру годину показує годинник. Без реєстрації — просто грай.',
    nameLabel: 'Як тебе звати?',
    namePlaceholder: 'Твоє ім’я',
    start: 'Почати',
  },
  settings: {
    greeting: '{name}, у що граємо?',
    game: 'Гра',
    mode: 'Режим',
    level: 'Крок хвилин',
    back: 'Назад',
    play: 'Грати',
  },
  games: {
    dragNumbers: { name: 'Розстав числа', description: 'Перетягни числа 1–12 на їхні місця.' },
    dragArrows: { name: 'Постав стрілки', description: 'Покажи на годиннику заданий час.' },
    setTime: { name: 'Який час?', description: 'Подивись на годинник і введи час.' },
  },
  modes: {
    teach: {
      name: 'Навчання',
      description: 'Помилився — покажемо, як правильно, і допоможемо виправити.',
    },
    test: { name: 'Перевірка', description: 'Без підказок. Що вийшло — побачиш у кінці.' },
  },
  levels: {
    '30': { name: '30 хв', description: ':00 і :30' },
    '15': { name: '15 хв', description: ':00, :15, :30, :45' },
    '5': { name: '5 хв', description: 'Кожні 5 хвилин' },
    '1': { name: '1 хв', description: 'Будь-яка хвилина' },
  },
  round: {
    progress: 'Завдання {n} з {total}',
    progressLabel: 'Прогрес: завдання {n} з {total}',
    comingSoon: 'Тут скоро буде гра',
    question: 'Котра година?',
    setHands: 'Постав стрілки на',
    hourHand: 'Коротка — години',
    minuteHand: 'Довга — хвилини',
    hours: 'Години',
    minutes: 'Хвилини',
    clear: 'Стерти',
    submit: 'Перевірити',
    errors: {
      hour: 'Години — від 1 до 12',
      minute: 'Хвилини — від 00 до 59',
    },
  },
  teach: {
    wrongTitle: 'Майже! Правильно так:',
    gotIt: 'Зрозуміло',
    setCorrect: 'Постав правильну відповідь',
    hint: 'Підказка:',
    right: 'Правильно! Далі…',
    mistakes: {
      hourAhead: 'Коротка стрілка ще не дійшла до {next} — отже, година ще {hour}.',
      hourOn: 'Коротка стрілка показує на {hour} — отже, година {hour}.',
      hourBetween: 'Коротка стрілка між {hour} і {next} — отже, година {hour}.',
      minuteZero: 'Довга стрілка показує на 12 — отже, рівно {time}.',
      minuteOn: 'Довга стрілка показує на {number}. Рахуй п’ятірками: це {minute} хв.',
      minuteBetween:
        'Довга стрілка трохи далі за {number}. Рахуй маленькі поділки — виходить {minute} хв.',
      swapped: 'Не переплутай стрілки: коротка показує години, а довга — хвилини.',
      both: 'Коротка стрілка показує години ({hour}), а довга — хвилини ({minute}).',
    },
  },
  leave: {
    title: 'Покинути раунд?',
    body: 'Цей раунд не збережеться. Ти повернешся до вибору гри.',
    stay: 'Грати далі',
    leave: 'Вийти',
  },
  summary: {
    headline: '{right} з {total} правильно',
    right: 'Правильно',
    wrong: 'Помилки',
    yourAnswer: 'твоя відповідь {time}',
    none: 'Немає',
    playAgain: 'Грати ще',
    toSettings: 'До вибору гри',
  },
}
