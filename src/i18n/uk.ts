/** Ukrainian interface text. Every screen's text goes through these keys. */
export default {
  app: {
    name: 'Вчимо годинник',
    clockShows: 'Годинник показує {time}',
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
  },
}
