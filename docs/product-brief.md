# Time Teacher — product brief

Distilled from the 2019 master's thesis and its defence deck (`docs/original/`, both in Ukrainian).
Only the idea, game rules and screens carry over. The 2019 stack (ASP.NET Core 2.1 + Angular 7 + MySQL)
and the code listings in the thesis appendix are **not** a reference for the rebuild.

## Idea

A browser game that teaches children (target age 6–10) to read an analogue clock, and to say the time
in a foreign language (English first). Usable at home and in classrooms. Short, timed rounds with a
score keep it playful; results are stored so progress can be tracked.

The thesis compared three existing apps, each covering one skill, and combined all of them plus a new
"say the time in a language" mode.

## Game modes

Shared rules for every mode: a round has a countdown (screens show **90 s**), the player answers as many
tasks as possible, presses **Next (ДАЛІ >>)** to check the answer and get a new task. A correct answer
adds to the score (screens show **+10** per answer). The thesis also mentions a limited number of
mistakes per round. The round ends when time runs out or mistakes are used up; the result is saved.

| # | Mode (2019 name) | Player sees | Player does | Screenshot |
|---|---|---|---|---|
| 1 | Drag Numbers (`DragNumbers`) | A clock face (smiling mascot face) with 12 empty slots, and 12 shuffled number balls beside it | Drags each number 1–12 onto its slot | `screenshots/mode-1-drag-numbers.png` |
| 2 | Read the Clock (`TimeArrow`) | A clock showing a random time | Types the time into `HH : MM` boxes | `screenshots/mode-2-time-arrow.png` |
| 3 | Set the Clock (`ArrowManipulation`) | A target time `HH : MM` and a clock | Drags/rotates the hour and minute hands to that time | `screenshots/mode-3-arrow-manipulation.png` |
| 4 | Say the Time (`LanguageTime`) | A clock with a random time, a language picker, shuffled word tiles (`it's`, `ten`, `to`, `five`, `minutes`…) | Drags tiles into order to build the sentence ("It's ten minutes to five") | `screenshots/mode-4-language-time.png` |

## Screens

- **Account page** — sign in / sign up.
- **Main page** (`screenshots/main-page-wireframe.png`) — header (title, UI language switch, Exit),
  left menu "Choose game mode" with the four modes plus **Results**, and a play area that shows the
  rules until a mode is picked.
- **Mode screen** — per mode, always contains: player name + one-line rules, the clock, the answer
  area, remaining time, score, Next button.
- **Results / statistics** — progress charts per mode, visible to the player and to admins.

## Other functionality in the 2019 design

- Accounts with login/password; roles (user, admin).
- Admin area: manage users, view their results.
- Results e-mailed to the address given at sign-up after each round.
- UI language switch.

## Visual style (2019)

- Background: light parchment texture, base `#E5D88E`; text dark grey `#2D2D2F`; inputs and buttons
  light grey `#F5F5F5`.
- Clock: green outer ring, yellow ring, red inner ring, peach face, bold red numerals, blue and green
  arrow hands, orange centre pin. Clock takes about a third of the play area.
- Minimal elements per screen, because the users are children.

## Data model (2019, for reference)

`User`, `Role`, `UserRole`, `TaskType` (name, description, priority = difficulty), `Task`,
`Result` (one round), `TaskAnswer` (per task: correct?, time to answer).
The useful idea: store every answer with its time, so statistics can show accuracy and speed per mode.

## Gaps and open questions for the rebuild

- **Hand realism.** In the 2019 screens the hour hand sits exactly on the hour (e.g. at 12 for 12:15).
  A real clock moves the hour hand between numbers; children should learn that.
- **Difficulty levels.** Only hinted at (`TaskType.priority`). Natural ladder: o'clock → half past →
  quarters → 5-minute steps → any minute; 12 h vs 24 h.
- **Attempts / feedback.** What happens on a wrong answer: show the correct answer, retry, lose a life?
- **Accounts for children.** E-mail + password is a poor fit for 6-year-olds. Options: local profiles
  with avatars, or a parent/teacher account that owns child profiles.
- **Admin + e-mail results.** Needed for an MVP, or later (teacher dashboard)?
- **Languages.** Which time-telling languages beyond English (Ukrainian?) and which UI languages.
- **Devices.** Touch-first for tablets/phones vs desktop mouse.
- **New ideas worth discussing:** voice-over (read the time aloud), sound effects and rewards,
  a free-play "explore the clock" mode, offline play (PWA), a "time of day" context (morning/night).
- **Art.** The mascot face and number balls need new original art (SVG).
