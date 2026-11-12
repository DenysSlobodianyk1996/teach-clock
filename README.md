# Teach Clock

A browser game that teaches children to read and set an analogue clock. Three games
(Drag Hours, Drag Arrows, Set Time), each in Teach or Test mode. Works offline as a PWA.

**Play it:** https://denysslobodianyk1996.github.io/teach-clock/

- [Product brief](docs/product-brief.md): screens, games, rules
- [Glossary](GLOSSARY.md)
- [Tech stack](docs/tech-stack.md)
- [Decisions](docs/adr/)
- Design prototype: [online canvas](https://claude.ai/artifact/7EUG95X5c8toe1Nb1TbGEu) (private) · [local gallery](docs/design/gallery.html) (open the file in a browser)

## Run it

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:4200. Every push to `main` deploys to GitHub Pages.

Tests: `npx vitest run` and `npx playwright test`.
