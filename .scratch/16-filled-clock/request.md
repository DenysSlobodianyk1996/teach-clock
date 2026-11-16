# Request

From the author, 2026-11-16:

> 1 more feature. In drag hours / minutes teach mode. Have 1 more icon somewhere nearby clock or so - some eye etc. When we click - show popup and everything set correctly. Means it shows "How clock should looks correctly" for current mode. This is for drag hours/minutes only

## Decisions (grilling, 2026-11-16)

1. New term **Filled Clock** (uk «Заповнений годинник»): a read-only popup with the drag Game's face, every number on its correct slot as a plain yellow tile, drawn as the Round draws it (1–12; 13–24 and Drag Minutes with the Hour Badges). Nothing green or red.
2. Opened by a round **eye** button to the right of the heading «Розстав числа по місцях». Spoken label «Показати заповнений годинник» / "Show the filled clock".
3. Teach only, in Drag Hours (both Hours) and Drag Minutes. Not in Test, Drag Arrows or Set Time.
4. Popup title «Ось так має виглядати годинник» / "This is how the clock should look", the face, and one button **Зрозуміло / Got it**. Escape, a scrim tap and the Android back button close it too; focus returns to the eye.
5. The face is the real Vue component (`NumberFace`), not an image, styled as the board's face (badges not enlarged, the board's shadow), big enough to read every number.
6. Read-only: opening it changes nothing (score, dots, Summary, the ringed tray tile).
7. The eye is disabled while the wrong-drop popup is open and in the pause after the last number.
