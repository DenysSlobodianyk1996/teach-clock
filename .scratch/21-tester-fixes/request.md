# Request

Reports from closed testing (Twelve Testers), as given.

## 1. System bars over the app

> Emulator: The app is not handling Android System WindowInsets correctly.
>
> - The Status Bar overlaps the top navigation tabs.
> - The camera cutout overlaps the Flashcard tab.
> - The Navigation Bar overlaps the bottom links Privacy and Contact.
>
> **Fix:** Respect `WindowInsets.safeDrawing` while keeping edge-to-edge enabled. Ensure all interactive content stays within the safe area.
> Also, because system status bar is on top of your app, none of the top controls are usable.

Screenshot: [images/01-bars-over-app.png](images/01-bars-over-app.png) (Settings, dark theme, English).

## 2. Privacy Page date

> privacy pages - update date each time when deployment is going (pr to main created or so). if need update it each time (add note in claude.md). Or, somehow configure in workflow github
