# Project Memory

## Project

**The Archive** is an interactive, frontend-only digital museum of Indian history built for academic demonstration.

## Product intent

Visitors explore four historical galleries through visual exhibit cards, detailed exhibit pages, a chronological timeline, live search, and an educational quiz.

## Non-negotiable constraints

- No backend, database, authentication, CMS, API routes, or persistent storage.
- All exhibit, gallery, and quiz content lives in local JSON files.
- Four modeled exhibits are currently included: Great Bath of Mohenjo-Daro, Taj Mahal, Red Fort, and Chandrayaan Missions.
- React hooks are used for state; no Redux or Zustand.
- The app is intended for static export and Vercel deployment.

## Current architecture

- `app/` contains App Router pages.
- `components/` contains reusable layout, gallery, exhibit, UI, and interaction components.
- `data/` contains gallery, exhibit, and quiz JSON.
- `lib/types.ts` contains shared TypeScript interfaces.
- `lib/getExhibits.ts` flattens exhibit JSON and provides lookup/year parsing.
- `lib/search.ts` contains pure search/filter logic.
- `public/images/` contains lightweight local SVG artwork.

## Routes

- `/` — museum home
- `/galleries/[galleryId]` — gallery listing
- `/exhibits/[exhibitId]` — exhibit detail
- `/timeline` — chronological exhibit timeline
- `/search` — query and filter interface
- `/quiz` — shuffled multiple-choice quiz

## Interaction notes

- Flagship narration uses the browser Web Speech API.
- 3D viewing uses React Three Fiber and Drei OrbitControls.
- Current exhibit detail viewers use the supplied Sketchfab embeds.
- Real `.glb` files can be placed under `public/models/` and loaded from the exhibit model component later.

## Design language

Warm parchment backgrounds, heritage maroon, terracotta, moss, saffron, and indigo accents. Serif display headings pair with sans-serif body copy. Cards use rounded corners, soft museum-style shadows, and restrained motion.

## Content care

Historical copy is concise and educational. When adding content, preserve the distinction between documented historical fact and interpretation, and keep descriptions scannable.
