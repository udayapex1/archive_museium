# The Archive — Interactive Digital Museum

Frontend-only Next.js museum of Indian history. It contains four galleries and 16 curated exhibits, all loaded from local JSON. There is no backend, database, authentication, or persistence.

## Run locally

```bash
npm install
npm run dev
```

The production build is configured for static export with `npm run build`.

## Structure

- `app/` — home, gallery, exhibit, timeline, search and quiz routes
- `components/` — navigation, cards, narration, media and UI pieces
- `data/` — galleries, exhibit JSON and quiz question bank
- `lib/` — shared types, flattened exhibit data and filtering
- `public/images/` — local SVG artwork used as lightweight exhibit imagery

To add an exhibit, append an object matching `lib/types.ts` to the relevant JSON file. The gallery, search, timeline and related-exhibit views pick it up automatically. New galleries are added to `data/galleries.json` and a matching exhibit file/import in `lib/getExhibits.ts`.

## 3D and audio credits

Great Bath of Mohenjo-Daro, Taj Mahal, Red Fort, and Chandrayaan use the supplied Sketchfab embeds. Ashoka Pillar currently remains an image/audio exhibit because no real model asset is available for it. If a model is supplied later, add it under `/public/models/` and enable its `has3D` flag in the relevant JSON.

Narration uses the browser Web Speech API, avoiding an unlicensed recorded-audio pipeline. Taj Mahal and Red Fort use the supplied Sketchfab embeds in the exhibit viewer. Credits: [Taj Mahal by uday](https://sketchfab.com/3d-models/taj-mahal-7b43e635cbfb47719d5a124302b78579), [Red Fort Model by vfx_review](https://sketchfab.com/3d-models/red-fort-model-2ad9ae0a1b524a37a2c3ab245b0e5423), both hosted on Sketchfab; verify each model’s current license before deployment.
