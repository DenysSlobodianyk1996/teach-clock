# Translation review list

What a native speaker should check first. The German, French, Italian and Spanish interface, Play listings and Privacy text were drafted by Claude and shipped in batch 28 without a native check. Quotes are copied from the message files and listings. Fix a line in `src/i18n/<lang>.ts` or `docs/store/<lang>/listing.md`, then rerun `npm run store-shots` if it shows on a screenshot.

Limits when rewording: Play's title 30, short description 80, full description 4000 characters; every screen must still fit 320 × 640 (`e2e/no-app-scroll.spec.ts`). Strings with `{hour}`, `{number}` or a count avoid article, elision and plural agreement, because the app has no plural rules. Keep them that way.

In each language, in this order: clock vocabulary, day-half labels, Game Name and Game titles, store listing (then its full text in `docs/store/<lang>/listing.md`), Privacy text (`privacy.*`).

## English (`en`), the default and the fallback

- [ ] Low priority: this text predates the batch, apart from the name error and small rewordings.

| Area             | Where               | Text                                                                                                                                                             |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clock vocabulary | Hour hand label     | Short — hours                                                                                                                                                    |
|                  | Minute hand label   | Long — minutes                                                                                                                                                   |
|                  | Set the hands       | Set the hands to                                                                                                                                                 |
|                  | Hint, hour          | The short hand is between {hour} and {next} — so the hour is {hour}.                                                                                             |
|                  | Hint, minute        | The long hand points at {number}. Count in fives: that’s {minute} minutes.                                                                                       |
|                  | Hint, hands swapped | Don’t mix up the hands: the short one shows the hours, the long one the minutes.                                                                                 |
| Day halves       | 1–12                | First half of the day                                                                                                                                            |
|                  | 13–24               | Second half of the day                                                                                                                                           |
| Game Name        | Game Name           | Teach Clock                                                                                                                                                      |
| Game titles      | Drag Hours          | Drag Hours                                                                                                                                                       |
|                  | Drag Minutes        | Drag Minutes                                                                                                                                                     |
|                  | Drag Arrows         | Drag Arrows                                                                                                                                                      |
|                  | Set Time            | Set Time                                                                                                                                                         |
| Name error       | Welcome             | Type your name to start                                                                                                                                          |
| Store listing    | Title               | Teach Clock — clock for kids                                                                                                                                     |
|                  | Short description   | A calm game where kids learn to read a clock and set its hands. No ads.                                                                                          |
| Privacy          | Title               | Privacy policy                                                                                                                                                   |
|                  | No data             | Teach Clock is a game for children. It collects no data. It sends nothing to any server, stores nothing remotely and shares nothing with anyone.                 |
|                  | On the device       | Only the game settings and the last name entered stay on the device. Results are not kept after a round ends. To erase them, clear the app’s or the site’s data. |
|                  | No ads              | The game shows no ads, uses no analytics, tracking or third-party services, needs no account and asks for no device permissions.                                 |
|                  | Children            | The game is made for children. Because it collects nothing, it collects nothing from children either.                                                            |

## Ukrainian (`uk`), the source text

- [ ] Low priority: this text predates the batch, apart from the name error and small rewordings. The Play title "Вчимо годинник — гра для дітей" is at the 30-character limit, so any change must stay within it.

| Area             | Where               | Text                                                                                                                                                                           |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Clock vocabulary | Hour hand label     | Коротка — години                                                                                                                                                               |
|                  | Minute hand label   | Довга — хвилини                                                                                                                                                                |
|                  | Set the hands       | Постав стрілки на                                                                                                                                                              |
|                  | Hint, hour          | Коротка стрілка між {hour} і {next} — отже, година {hour}.                                                                                                                     |
|                  | Hint, minute        | Довга стрілка показує на {number}. Рахуй п’ятірками: це {minute} хв.                                                                                                           |
|                  | Hint, hands swapped | Не переплутай стрілки: коротка показує години, а довга — хвилини.                                                                                                              |
| Day halves       | 1–12                | Перша половина доби                                                                                                                                                            |
|                  | 13–24               | Друга половина доби                                                                                                                                                            |
| Game Name        | Game Name           | Вчимо годинник                                                                                                                                                                 |
| Game titles      | Drag Hours          | Розстав години                                                                                                                                                                 |
|                  | Drag Minutes        | Розстав хвилини                                                                                                                                                                |
|                  | Drag Arrows         | Постав стрілки                                                                                                                                                                 |
|                  | Set Time            | Який час?                                                                                                                                                                      |
| Name error       | Welcome             | Напиши ім’я, щоб почати                                                                                                                                                        |
| Store listing    | Title               | Вчимо годинник — гра для дітей                                                                                                                                                 |
|                  | Short description   | Гра, у якій діти вчаться читати годинник і ставити стрілки. Без реклами.                                                                                                       |
| Privacy          | Title               | Політика конфіденційності                                                                                                                                                      |
|                  | No data             | «Вчимо годинник» — гра для дітей. Вона не збирає жодних даних, нічого не надсилає на сервер, не зберігає віддалено і нікому не передає.                                        |
|                  | On the device       | На пристрої зберігаються лише налаштування гри та останнє введене ім’я. Результати не зберігаються після завершення раунду. Щоб їх стерти, очистіть дані застосунку або сайту. |
|                  | No ads              | Гра не показує реклами, не використовує аналітики, відстеження чи сторонніх сервісів, не потребує облікового запису і не просить дозволів на пристрої.                         |
|                  | Children            | Гра створена для дітей. Оскільки вона нічого не збирає, вона не збирає нічого й від дітей.                                                                                     |

## German (`de`)

- [ ] Day halves: "Nachts und vormittags" / "Nachmittags und abends". Natural for 1–12 and 13–24, given that 12 is noon and 24 is midnight?
- [ ] Hands: "kleiner / großer Zeiger" in every Hint and on the Round's labels.
- [ ] Mode names "Üben" and "Prüfen": does "Prüfen" sound too much like an exam for a small child?
- [ ] The Privacy text says "du" ("dein Gerät") while a parent is the likely reader. Keep it, or use "Sie"?

| Area             | Where               | Text                                                                                                                                                                                                      |
| ---------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clock vocabulary | Hour hand label     | Kleiner Zeiger – Stunden                                                                                                                                                                                  |
|                  | Minute hand label   | Großer Zeiger – Minuten                                                                                                                                                                                   |
|                  | Set the hands       | Stelle die Zeiger auf                                                                                                                                                                                     |
|                  | Hint, hour          | Der kleine Zeiger steht zwischen {hour} und {next} – die Stunde ist also {hour}.                                                                                                                          |
|                  | Hint, minute        | Der große Zeiger zeigt auf die Zahl {number}. Zähle in Fünferschritten: Das ergibt Minute {minute}.                                                                                                       |
|                  | Hint, hands swapped | Verwechsle die Zeiger nicht: Der kleine zeigt die Stunden, der große die Minuten.                                                                                                                         |
| Day halves       | 1–12                | Nachts und vormittags                                                                                                                                                                                     |
|                  | 13–24               | Nachmittags und abends                                                                                                                                                                                    |
| Game Name        | Game Name           | Uhr lernen                                                                                                                                                                                                |
| Game titles      | Drag Hours          | Stunden ziehen                                                                                                                                                                                            |
|                  | Drag Minutes        | Minuten ziehen                                                                                                                                                                                            |
|                  | Drag Arrows         | Zeiger stellen                                                                                                                                                                                            |
|                  | Set Time            | Uhrzeit lesen                                                                                                                                                                                             |
| Name error       | Welcome             | Schreib deinen Namen                                                                                                                                                                                      |
| Store listing    | Title               | Uhr lernen — für Kinder                                                                                                                                                                                   |
|                  | Short description   | Ein ruhiges Spiel: Kinder lernen, die Uhr zu lesen und zu stellen. Ohne Werbung.                                                                                                                          |
| Privacy          | Title               | Datenschutzerklärung                                                                                                                                                                                      |
|                  | No data             | „Uhr lernen“ ist ein Spiel für Kinder. Es erhebt keine Daten, sendet nichts an einen Server, speichert nichts extern und gibt nichts an andere weiter.                                                    |
|                  | On the device       | Auf dem Gerät bleiben nur die Spieleinstellungen und der zuletzt eingegebene Name. Ergebnisse werden nach dem Ende einer Runde nicht aufbewahrt. Zum Löschen entferne die Daten der App oder der Website. |
|                  | No ads              | Das Spiel zeigt keine Werbung, nutzt keine Analyse, kein Tracking und keine Dienste Dritter, braucht kein Konto und fragt nach keinen Geräteberechtigungen.                                               |
|                  | Children            | Das Spiel ist für Kinder gemacht. Da es nichts erhebt, erhebt es auch von Kindern nichts.                                                                                                                 |

## French (`fr`)

- [ ] Day halves: "La nuit et le matin" / "L’après-midi et le soir".
- [ ] **Shortened Game title:** Drag Arrows is "Les aiguilles". Does it still say what the Game does?
- [ ] Mode "Apprendre" sits close to the Game Name "Apprendre l'heure". Confusing side by side?
- [ ] Play title "Apprendre l'heure — enfants" is compressed to fit 30 characters. Acceptable?
- [ ] Word for the clock ("horloge") and punctuation (a non-breaking space before `?`, `!`, `:`).
- [ ] The Game Name has a straight apostrophe (`l'heure`), other text a typographic one (`l’heure`). Confirm which to keep.

| Area             | Where               | Text                                                                                                                                                                                                            |
| ---------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clock vocabulary | Hour hand label     | Petite aiguille – heures                                                                                                                                                                                        |
|                  | Minute hand label   | Grande aiguille – minutes                                                                                                                                                                                       |
|                  | Set the hands       | Règle les aiguilles sur                                                                                                                                                                                         |
|                  | Hint, hour          | La petite aiguille est entre les nombres {hour} et {next} : l’heure est donc {hour}.                                                                                                                            |
|                  | Hint, minute        | La grande aiguille montre le nombre {number}. Compte de 5 en 5 : c’est la minute {minute}.                                                                                                                      |
|                  | Hint, hands swapped | Ne confonds pas les aiguilles : la petite montre les heures, la grande les minutes.                                                                                                                             |
| Day halves       | 1–12                | La nuit et le matin                                                                                                                                                                                             |
|                  | 13–24               | L’après-midi et le soir                                                                                                                                                                                         |
| Game Name        | Game Name           | Apprendre l'heure                                                                                                                                                                                               |
| Game titles      | Drag Hours          | Placer les heures                                                                                                                                                                                               |
|                  | Drag Minutes        | Placer les minutes                                                                                                                                                                                              |
|                  | Drag Arrows         | Les aiguilles                                                                                                                                                                                                   |
|                  | Set Time            | Lire l’heure                                                                                                                                                                                                    |
| Name error       | Welcome             | Écris ton prénom                                                                                                                                                                                                |
| Store listing    | Title               | Apprendre l'heure — enfants                                                                                                                                                                                     |
|                  | Short description   | Un jeu calme pour apprendre à lire l’heure et régler les aiguilles. Sans pub.                                                                                                                                   |
| Privacy          | Title               | Politique de confidentialité                                                                                                                                                                                    |
|                  | No data             | « Apprendre l'heure » est un jeu pour enfants. Il ne collecte aucune donnée, n’envoie rien à un serveur, ne stocke rien à distance et ne partage rien avec personne.                                            |
|                  | On the device       | Seuls les réglages du jeu et le dernier prénom saisi restent sur l’appareil. Les résultats ne sont pas conservés après la fin d’une partie. Pour les effacer, supprime les données de l’application ou du site. |
|                  | No ads              | Le jeu n’affiche aucune publicité, n’utilise ni statistiques, ni suivi, ni service tiers, ne demande aucun compte et aucune autorisation sur l’appareil.                                                        |
|                  | Children            | Le jeu est conçu pour les enfants. Comme il ne collecte rien, il ne collecte rien non plus auprès des enfants.                                                                                                  |

## Italian (`it`)

- [ ] Day halves: "Notte e mattina" / "Pomeriggio e sera".
- [ ] Hands: "lancetta piccola / grande" in every Hint.
- [ ] Mode "Impara" repeats the first word of the Game Name "Impara l'ora". Confusing side by side?
- [ ] Set Time is "Leggi l’orario": is "orario" right here, or should it be "l’ora"?
- [ ] The Game Name has a straight apostrophe (`l'ora`), other text a typographic one. Confirm which to keep.

| Area             | Where               | Text                                                                                                                                                                                                  |
| ---------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clock vocabulary | Hour hand label     | Lancetta piccola – ore                                                                                                                                                                                |
|                  | Minute hand label   | Lancetta grande – minuti                                                                                                                                                                              |
|                  | Set the hands       | Sposta le lancette su                                                                                                                                                                                 |
|                  | Hint, hour          | La lancetta piccola è tra i numeri {hour} e {next}: quindi l’ora è {hour}.                                                                                                                            |
|                  | Hint, minute        | La lancetta grande indica il numero {number}. Conta di 5 in 5: è il minuto {minute}.                                                                                                                  |
|                  | Hint, hands swapped | Non confondere le lancette: la piccola segna le ore, la grande i minuti.                                                                                                                              |
| Day halves       | 1–12                | Notte e mattina                                                                                                                                                                                       |
|                  | 13–24               | Pomeriggio e sera                                                                                                                                                                                     |
| Game Name        | Game Name           | Impara l'ora                                                                                                                                                                                          |
| Game titles      | Drag Hours          | Sposta le ore                                                                                                                                                                                         |
|                  | Drag Minutes        | Sposta i minuti                                                                                                                                                                                       |
|                  | Drag Arrows         | Muovi le lancette                                                                                                                                                                                     |
|                  | Set Time            | Leggi l’orario                                                                                                                                                                                        |
| Name error       | Welcome             | Scrivi il tuo nome                                                                                                                                                                                    |
| Store listing    | Title               | Impara l'ora — per bambini                                                                                                                                                                            |
|                  | Short description   | I bambini imparano a leggere l’ora e a muovere le lancette. Senza pubblicità.                                                                                                                         |
| Privacy          | Title               | Informativa sulla privacy                                                                                                                                                                             |
|                  | No data             | “Impara l'ora” è un gioco per bambini. Non raccoglie dati, non invia nulla a un server, non conserva nulla altrove e non condivide nulla con nessuno.                                                 |
|                  | On the device       | Sul dispositivo restano solo le impostazioni del gioco e l’ultimo nome inserito. I risultati non vengono conservati dopo la fine di una partita. Per cancellarli, elimina i dati dell’app o del sito. |
|                  | No ads              | Il gioco non mostra pubblicità, non usa statistiche, tracciamento o servizi di terzi, non richiede un account né autorizzazioni sul dispositivo.                                                      |
|                  | Children            | Il gioco è pensato per i bambini. Poiché non raccoglie nulla, non raccoglie nulla neppure dai bambini.                                                                                                |

## Spanish (`es`)

- [ ] Day halves: "Madrugada y mañana" / "Tarde y noche".
- [ ] **Shortened Game titles:** Drag Hours is "Pon las horas", Drag Minutes "Pon los minutos". Do they read naturally?
- [ ] Hands: "manecilla" throughout. Fine for Spain (`es-ES`, the Play listing) and for Latin American Players, who may say "aguja"?

| Area             | Where               | Text                                                                                                                                                                                                 |
| ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clock vocabulary | Hour hand label     | Manecilla pequeña – horas                                                                                                                                                                            |
|                  | Minute hand label   | Manecilla grande – minutos                                                                                                                                                                           |
|                  | Set the hands       | Pon las manecillas en                                                                                                                                                                                |
|                  | Hint, hour          | La manecilla pequeña está entre los números {hour} y {next}: la hora es {hour}.                                                                                                                      |
|                  | Hint, minute        | La manecilla grande señala el número {number}. Cuenta de 5 en 5: es el minuto {minute}.                                                                                                              |
|                  | Hint, hands swapped | No confundas las manecillas: la pequeña marca las horas y la grande los minutos.                                                                                                                     |
| Day halves       | 1–12                | Madrugada y mañana                                                                                                                                                                                   |
|                  | 13–24               | Tarde y noche                                                                                                                                                                                        |
| Game Name        | Game Name           | Aprende la hora                                                                                                                                                                                      |
| Game titles      | Drag Hours          | Pon las horas                                                                                                                                                                                        |
|                  | Drag Minutes        | Pon los minutos                                                                                                                                                                                      |
|                  | Drag Arrows         | Mueve las manecillas                                                                                                                                                                                 |
|                  | Set Time            | Lee el reloj                                                                                                                                                                                         |
| Name error       | Welcome             | Escribe tu nombre                                                                                                                                                                                    |
| Store listing    | Title               | Aprende la hora — para niños                                                                                                                                                                         |
|                  | Short description   | Los niños aprenden a leer la hora y a mover las manecillas. Sin anuncios.                                                                                                                            |
| Privacy          | Title               | Política de privacidad                                                                                                                                                                               |
|                  | No data             | «Aprende la hora» es un juego para niños. No recoge datos, no envía nada a ningún servidor, no guarda nada fuera del dispositivo y no comparte nada con nadie.                                       |
|                  | On the device       | En el dispositivo solo quedan los ajustes del juego y el último nombre escrito. Los resultados no se conservan al terminar una partida. Para borrarlos, elimina los datos de la app o del sitio web. |
|                  | No ads              | El juego no muestra anuncios, no usa analítica, seguimiento ni servicios de terceros, no necesita cuenta y no pide permisos del dispositivo.                                                         |
|                  | Children            | El juego está hecho para niños. Como no recoge nada, tampoco recoge nada de los niños.                                                                                                               |
