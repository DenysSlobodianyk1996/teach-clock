# Design prototype

Static boards for every Teach Clock screen and state (ticket 01). They show the design only; there is no app code here.

- **Local:** open `gallery.html` in a browser to see all boards, or open any `project/*.dc.html` on its own.
- **Online canvas** (comments, pan/zoom): https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu (private).
- `project/theme.css` holds the colour tokens for the two themes (`.tc` light, `.tc.dark` dark; the app puts light on `:root` and dark under `[data-theme='dark']`), the sun/moon theme toggle (`.theme-toggle`) and the shared parts: clock, hands, tiles, dots, number pad, popups.
- Boards are drawn in Ukrainian; the app starts in the device's language (English unless Ukrainian comes first, batch 13). The header's brand is the clock icon only, so no board shows the Game Name except the Privacy Page's text («Вчимо годинник»).
- Boards are drawn in the dark theme (root `class="tc dark"`); the `Light*` boards show the light theme next to their dark twin. `Main.dc.html` shows both. The app itself still follows the device until the Player taps the toggle. Every header has the sun/moon toggle (`role="switch"`, `aria-checked` true in dark).
- Welcome and Settings end with the Footer (Privacy, Contact). `PhoneWelcome` and `PhoneSettings` are 360 × 701: a 360 × 640 screen, then the Footer below the fold.
- Phone boards are drawn at 360 × 640, the smallest phone everything must fit without scrolling (batch 19); only `PhoneSummary` (390 wide, it scrolls) and `PhoneDragHoursTeachWrong` (390 × 844) are older. On a phone no Settings card shows a description and Welcome hides its intro: an ⓘ opens them in an **Info Popup** (heading, text or a list of names with descriptions, one Зрозуміло). `PhoneWelcomeInfo` and `PhoneSettingsGameInfo` show it open; `PhoneSettingsHours` (Розстав години, with Години) and `PhoneSettingsSetTime` (Який час?, with Крок хвилин) show the compact cards with the extra row. In a Round the clock takes the height left (never below about 150 px), so Перевірити or the tray stays in view. The drag Games' Teach boards show the eye that opens the Filled Clock (batch 16). The Privacy Page has one board (`Privacy.dc.html`): a text screen with Welcome's heading and button, the author's name and no Footer. In the app it lives at `/privacy-policy`; the static `privacy.html` for Google Play is rendered from the same screen (header with the brand only, Ukrainian then English, "До гри" as a link to the game).
- Drag Hours has **Hours** (batch 14): `Settings` and `LightSettings` show the Години group (1–12 picked), `SettingsHours24` has 13–24 picked and the Drag Hours card follows it ("Перетягни числа 13–24…"); `PhoneDragHours24` is a 13–24 Teach Round with the Hour Badges and the wrong-drop popup ("19 стоїть між 18 і 20").
- `SummaryDragHoursTeach` (batch 15): the Teach Summary of a drag Game shows the right numbers green on a face, the helped ones' slots empty, instead of chips. No caption under the face. Потренуймо ще is drawn as the app shows it: a pair of small faces per number (first try ringed red → its slot), 1100 px tall like the other Summaries.
- `project/canvas.json` is the canvas layout. Keep it in sync with `gallery.html` when boards are added or removed.

## Publishing to the online canvas

Local `project/` is the source of truth; the online canvas is a copy of it. Every batch that changes a board (or `theme.css`, or `canvas.json`) publishes it in the same ticket. Batches 09–12 skipped this and the canvas fell four batches behind.

1. List the canvas's files (Artifact tool, `action: "list"`, `scope: "files"`, the canvas URL) and diff the `project/*` paths against local `project/`.
2. Publish once: `url` = the canvas URL, `root` = `docs/design`, `file_path` = the absolute path of `docs/design/project/canvas.json`, `files` = every other changed `project/<name>` mapped to itself, plus `"project/<name>": null` for each board that exists online but not locally.
3. List the files again: the `project/*` paths must match local exactly.

The canvas's own files (`index.html`, `artifact-type/`, `SKILL.md`) are not ours; never send them.

## Boards and the app

The boards are hand-written HTML + inline SVG with no build step. The real app (Vue + SVG, ticket 02 onward) should reuse the tokens and clock geometry, not the markup.
