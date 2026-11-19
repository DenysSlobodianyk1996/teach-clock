# Request

A report from closed testing (Twelve Testers), as given.

## Samsung S8: Main screen: Selection not visible

> See attached screenshots : White is a real device (Samsung s8) black is emulator
>
> Steps to reproduce:
>
> 1. Open app and hit start (name is correctly persisted from prev session)
> 2. Select "Set time" (bottom part should display now Minute Step)
> 3. Select 5 min
> 4. Tap Play
>
> On the real device selection border is not rendered but application reacts to selection: Minute step is visible for "Set time" selection.
>
> A separate issue (but it could have the same root cause) : in "playing" mode there is no clock.

Screenshots, cropped to the phone:

- Samsung S8, light theme, English: [Settings, no border on the chosen cards](images/01-s8-settings-no-border.png), [Set Time Round, no clock](images/01-s8-round-no-clock.png).
- Emulator, dark theme, English: [Settings](images/01-emulator-settings.png), [Set Time Round](images/01-emulator-round.png).

Both builds show the card descriptions on a phone, so the testers had a build from before batch 19.
