# Draw the game with Vue + SVG, not a canvas engine

The game is three small clock puzzles (drag numbers, read the clock, set the hands), not an action game. We draw everything as SVG inside Vue components. We considered PixiJS (also as a way to learn it), Phaser and Konva. We rejected them because a canvas engine makes scaling, hit areas and on-screen text input our job, while SVG gives all three for free. Keep the clock maths (Clock Time ↔ hand angles) in plain TypeScript, separate from rendering, so a canvas layer could still be added later for effects.
