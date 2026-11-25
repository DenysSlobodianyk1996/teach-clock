/** Ukrainian interface text. Every screen's text goes through these keys. */
export default {
  app: {
    name: 'Вчимо годинник',
    /**
     * The page's description (search results, link previews, the install prompt): the Play listing's
     * short description in docs/store/<lang>/listing.md, word for word (batch 31).
     */
    description: 'Гра, у якій діти вчаться читати годинник і ставити стрілки. Без реклами.',
    clockShows: 'Годинник показує {time}',
    clockDrag: 'Годинник зі стрілками на {time}. Перетягни стрілки.',
    /** The link preview image's alt text (og:image:alt): the store's feature graphic. */
    previewAlt:
      'Вчимо годинник: годинник зі стрілками і чотири гри, щоб навчитися читати й ставити час',
  },
  header: {
    home: 'Додому',
    leave: 'Вийти',
    /** The round language button: it shows the language in use; a tap opens the list. */
    languageNow: 'Мова: {language}',
    /** The round theme button: it shows the theme in use (sun or moon); a tap switches it. */
    themeNow: 'Тема: {theme}',
  },
  themes: { light: 'світла', dark: 'темна' },
  welcome: {
    title: 'Привіт! Навчимося читати годинник',
    intro:
      'Чотири короткі гри: розстав на циферблаті години, потім хвилини, постав стрілки на потрібний час і прочитай, котру годину показує годинник. Без реєстрації — просто грай.',
    nameLabel: 'Як тебе звати?',
    namePlaceholder: 'Твоє ім’я',
    nameRequired: 'Напиши ім’я, щоб почати',
    start: 'Почати',
    /**
     * The link to the Android App's Play listing under Start, in the Web App only, once the app is
     * in production (GOOGLE_PLAY_LIVE). Google's own badge wording in each language.
     */
    googlePlay: 'Завантажте з Google Play',
  },
  /** The ⓘ by a heading on a phone, which opens its Info Popup. */
  info: { more: 'Докладніше', moreAbout: 'Докладніше: {section}' },
  settings: {
    greeting: '{name}, у що граємо?',
    game: 'Гра',
    mode: 'Режим',
    level: 'Крок хвилин',
    hours: 'Години',
    back: 'Назад',
    play: 'Грати',
  },
  games: {
    dragHours: { name: 'Розстав години', description: 'Перетягни числа {range} на їхні місця.' },
    dragMinutes: { name: 'Розстав хвилини', description: 'Перетягни хвилини 5–60 на їхні місця.' },
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
    '15': { name: '15 хв', description: ':00, :15, :30, :45' },
    '5': { name: '5 хв', description: 'Кожні 5 хвилин' },
    '1': { name: '1 хв', description: 'Будь-яка хвилина' },
  },
  hours: {
    '12': { name: '1–12', description: 'Перша половина доби' },
    '24': { name: '13–24', description: 'Друга половина доби' },
  },
  round: {
    progress: 'Завдання {n} з {total}',
    progressLabel: 'Прогрес: завдання {n} з {total}',
    question: 'Котра година?',
    setHands: 'Постав стрілки на',
    hourHand: 'Коротка — години',
    minuteHand: 'Довга — хвилини',
    hours: 'Години',
    minutes: 'Хвилини',
    /** A box's range, shown under it. */
    range: '{from}–{to}',
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
  numbers: {
    heading: 'Розстав числа по місцях',
    progress: 'На місці {n} з {total}',
    progressLabel: 'Прогрес: на місці {n} з {total} чисел',
    face: 'Циферблат, на місці {n} з 12 чисел',
    slot: 'Місце {n}',
    placedTile: '{number} на місці {n}',
    placedCount: 'Розставлено {n} з {total}',
    placedLabel: 'Розставлено {n} з {total} чисел',
    testHelp:
      'Залишилось: {n}. Число на циферблаті можна перетягнути на інше місце — вони поміняються.',
    allPlaced: 'Усі числа на циферблаті. Перевір і натисни «Готово».',
    submit: 'Готово',
    tray: 'Числа',
    help: 'Перетягни число на його місце або торкнись числа, а потім місця.',
    between: '{number} стоїть між {before} і {after}',
    showFilled: 'Показати заповнений годинник',
    filledTitle: 'Ось так має виглядати годинник',
    filledFace: 'Заповнений годинник: усі числа на своїх місцях',
  },
  leave: {
    title: 'Покинути раунд?',
    body: 'Цей раунд не збережеться. Ти повернешся до вибору гри.',
    stay: 'Грати далі',
    leave: 'Вийти',
  },
  summary: {
    cheer: 'Молодець, {name}!',
    headline: '{right} з {total} правильно',
    numbersHeadline: '{right} з {total} на своїх місцях',
    right: 'Правильно',
    wrong: 'Потренуймо ще',
    firstTry: 'Перша спроба',
    yourAnswer: 'Твоя відповідь',
    pair: '{caption} {first}, правильно {answer}',
    numberFirst: '{caption}: {number} на місці {slot}',
    none: 'Немає',
    perfect: 'Помилок немає.',
    tryLevel: 'Спробуй крок {level}!',
    tryOther: 'Спробуй іншу гру чи режим!',
    playAgain: 'Грати ще',
    toSettings: 'До вибору гри',
    yourFace: 'Твій циферблат',
    correctFace: 'Правильний',
    misplacedNote: 'Обведені — не на своєму місці',
    yourFaceLabel: 'Твій циферблат, не на своїх місцях: {numbers}',
    correctFaceLabel: 'Правильний циферблат',
    rightFaceLabel: 'Правильно: {numbers}',
  },
  footer: {
    privacy: 'Конфіденційність',
    contact: 'Зв’язатися',
  },
  // The Privacy Page: the app screen (/privacy-policy) and the static privacy/index.html share it.
  privacy: {
    /** The static page's language links, named in every language. */
    language: 'Мова',
    title: 'Політика конфіденційності',
    updated: 'Оновлено:',
    version: 'Версія:',
    noDataTitle: 'Жодних персональних даних',
    noData:
      '«Вчимо годинник» — гра для дітей. Вона не збирає жодних даних, нічого не надсилає на сервер, не зберігає віддалено і нікому не передає.',
    onDeviceTitle: 'Що залишається на вашому пристрої',
    onDevice:
      'На пристрої зберігаються лише налаштування гри та останнє введене ім’я. Результати не зберігаються після завершення раунду. Щоб їх стерти, очистіть дані застосунку або сайту.',
    noAdsTitle: 'Без реклами, аналітики, облікових записів і дозволів',
    noAds:
      'Гра не показує реклами, не використовує аналітики, відстеження чи сторонніх сервісів, не потребує облікового запису і не просить дозволів на пристрої.',
    childrenTitle: 'Діти',
    children:
      'Гра створена для дітей. Оскільки вона нічого не збирає, вона не збирає нічого й від дітей.',
    contactTitle: 'Контакт',
    contactIntro: 'Питання щодо цієї політики чи гри:',
    email: 'Ел. пошта:',
    developerTitle: 'Розробник',
    createdBy: 'Створив Денис Слободяник',
    back: 'До гри',
  },
}
