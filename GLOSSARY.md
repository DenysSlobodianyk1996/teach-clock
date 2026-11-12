# Teach Clock

A game that teaches children to read and set an analogue clock.

## Language

### Playing

**Player**:
The child playing, known only by the name they type in to be greeted.
_Avoid_: User, account, profile

**Game**:
One of the four clock puzzles: Drag Hours, Drag Minutes, Drag Arrows, Set Time.
_Avoid_: Module, exercise

**Mode**:
How a Round treats wrong Answers: Teach or Test.
_Avoid_: Game type

**Teach**:
The Mode where a wrong Answer shows the correct one and the Player must fix it before moving on.
_Avoid_: Practice, learn mode

**Test**:
The Mode where every Answer moves on, right or wrong, with no help, and the result is shown only in the Summary.
_Avoid_: Exam, challenge

**Level**:
The minute step that Clock Times in a Round snap to: 1, 5 or 15 minutes (1 by default). Drag Hours and Drag Minutes have no Level.
_Avoid_: Priority, difficulty

**Round**:
One playthrough of a Game in a Mode: ten Tasks, or the twelve numbers in Drag Hours or Drag Minutes. A Round only moves forward.
_Avoid_: Session, level

**Task**:
A single question inside a Round, such as "what time does this clock show?".
_Avoid_: Question, puzzle

**Answer**:
The Player's response to a Task, submitted with a button and marked right or wrong.

**Hint**:
What a Player in Teach is shown after a wrong try: the correct Answer, or in Drag Hours and Drag Minutes where the number goes ("7 goes between 6 and 8", "10 goes between 5 and 15"). A Task that needed a Hint counts as wrong.
_Avoid_: Tip, solution

**Place-It button**:
In Teach, the button beside a Hint that puts the number on its right place for the Player. The number still counts as helped.
_Avoid_: Auto-place, solve

**Summary**:
The read-only screen at the end of a Round, grouping Tasks into right and wrong and showing the Player's first Answer next to the correct one.
_Avoid_: Results, report

**Settings**:
The choice of Game, Mode and Level the Player makes before a Round.
_Avoid_: Options, setup

**Preferences**:
The interface language (Ukrainian or English) and colour theme (middle, dark or light), kept on the device.
_Avoid_: Settings, config

### The clock

**Clock Time**:
An hour (1–12) and a minute shown on an analogue clock; there are no seconds and no 24-hour times.
_Avoid_: Time value

**Hour Hand**:
The short hand; it moves gradually between numbers as the minutes pass.
_Avoid_: Small arrow

**Minute Hand**:
The long hand.
_Avoid_: Big arrow

**Grip**:
The circle at a hand's tip in Drag Arrows that the Player grabs to turn the hand.
_Avoid_: Handle, knob

**Lit Place**:
The tick the Minute Hand points to and the number the Hour Hand has passed, lit in the hands' colours. Shown in Teach only, in Drag Arrows and Set Time.
_Avoid_: Highlight, pointed place, target, ring

### Games

**Drag Hours**:
The Game where the Player drags the numbers 1–12 onto an empty clock face.
_Avoid_: Drag Numbers

**Drag Minutes**:
The Game where the Player drags the minutes 5, 10, … 60 onto an empty clock face: minute N×5 goes on the slot of hour N (60 at the top).

**Hour Badge**:
The small hour 1–12 by each slot on the Drag Minutes face. It is part of the face, so it shows in both Modes; it is not a Hint.
_Avoid_: hint, label

**Drag Arrows**:
The Game where the Player is given a Clock Time and drags the Hour Hand and Minute Hand to show it.
_Avoid_: Set the Clock, ArrowManipulation

**Set Time**:
The Game where the clock shows a Clock Time and the Player enters it as digits.
_Avoid_: Read the Clock, TimeArrow

**Range**:
The numbers a Set Time box accepts, shown under it: "1–12" for the hours, "0–59" for the minutes. Shown in every Mode; it is not a Hint.
_Avoid_: Hint, tooltip
