# Travel Risk Advisor (MVP)

Static React website MVP for a **business-traveler, policy-aligned** travel risk brief:

- Interactive world map (SVG) colored by **worst** category risk
- Search with autocomplete
- Country brief modal with **policy mapping** + action checklist
- Deterministic dummy data (no backend required)

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## AWS Amplify Hosting (no backend)

This is a standard static site build. In Amplify:

- **Install command**: `npm ci` (or `npm install`)
- **Build command**: `npm run build`
- **Build output directory**: `dist`

## Notes

- Dummy risk data is generated deterministically in `src/data/riskGenerator.ts`.
- Map data comes from `world-atlas` TopoJSON (rendered via `d3-geo`).

