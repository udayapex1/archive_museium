# Pull Request & Upstream Merge Guide: The Archive Digital Museum

> **Feature Branch**: `feature/historical-atlas`  
> **Target Branch**: `main`  
> **Target Repository**: `udayapex1/archive_museium`  
> **PR Title**: `feat(museum): Historical Atlas integration, Chronological Timeline overhaul & streamlined navigation`

---

## 1. Executive Summary & Value Proposition

This contribution addresses the two major missing dimensions of **The Archive Digital Museum**:

1. **Spatial Dimension (Gallery 04 · The Historical Atlas)**:
   - Visitors can now explore 5,000 years of the Indian subcontinent on an interactive, Natural Earth 1:10m physical basemap with authentic cross-border civilizational extents across Afghanistan, Pakistan, India, Bangladesh, and Myanmar.
   - Synchronous global context drawer (**"What else was happening?"**) connecting Indian epochs with contemporary Egyptian, Mesopotamian, Mediterranean, and East Asian milestones.

2. **Temporal Dimension (Room 03 · The Historical Timeline Overhaul)**:
   - The timeline has been elevated from a simple 4-card list into the museum's primary chronological passage.
   - Organizes five millennia into **06 curated epochs** (Indus, Maurya, Gupta, Mughal, British Era, Modern Republic).
   - Features 14 pivotal turning points with primary archaeological/historical source citations, interactive epoch filtering, and direct links to both 3D museum exhibits and the Historical Atlas.

3. **Streamlined Museum Architecture**:
   - The redundant 3D "Walkthrough" page has been cleanly removed.
   - The navigation is now focused, intentional, and balanced:  
     `Home | Atlas | Timeline | Search | Quiz`

---

## 2. Changes & File Architecture

### Clean Navigation & Walkthrough Removal
- Removed `app/walkthrough/page.tsx`, `components/walkthrough/`, and `lib/walkthroughLayout.ts`.
- Updated `components/layout/Navbar.tsx` and `components/layout/Footer.tsx` so the navigation cleanly reads `Home | Atlas | Timeline | Search | Quiz`, with "Enter museum" leading to the Atlas.
- Updated `app/page.tsx` hero CTA from Walkthrough to The Historical Atlas.

### Overhauled Timeline Experience
- Added `components/timeline/TimelineView.tsx` with rich epoch banners, historical citations, global context callouts, and 3D exhibit cards.
- Updated `app/timeline/page.tsx` to render the museum-grade timeline with SEO metadata.

### The Historical Atlas (Gallery 04)
- Added `app/atlas/page.tsx` and modular components under `components/atlas/` (`HistoricalMap.tsx`, `AtlasView.tsx`, `TimeSlider.tsx`, `EntityDetailDrawer.tsx`, `GlobalContextPanel.tsx`).
- Natural Earth vector datasets under `data/atlas/` (`south-asia-geography.json`, `world-land.json`, `periods.json`, `regions.json`, `events.json`, `places.json`).

---

## 3. Compatibility & Zero-Risk Guarantee

| Checkpoint | Status | Details |
| :--- | :---: | :--- |
| **Breaking Changes** | **NONE** | Existing exhibits, galleries, 3D models, search, and quiz remain 100% intact. |
| **New Dependencies** | **ZERO** | Uses existing React, Lucide Icons, and Tailwind CSS. No heavy external GIS/Mapbox libraries. |
| **TypeScript Strictness** | **PASSED** | `npx tsc --noEmit` exits with **0 errors**. |
| **Production Build** | **PASSED** | `npm run build` generates all 15 static routes successfully. |
| **Static Export (`out/`)** | **PASSED** | Compiled static assets in `out/` ready for immediate deployment on Vercel or GitHub Pages. |
| **Responsive & Touch Safe**| **PASSED** | Both Atlas and Timeline are responsive across mobile, tablet, and widescreen viewports. |

---

## 4. GitHub Contributor Visibility & Attribution Notes

If contributor avatars or statistics take time to appear on the repository home page:
1. **Default Branch Requirement**: GitHub's main repository page only credits contributors whose commits are merged into the repository's **default branch** (`main`). Once this PR is merged into `main`, GitHub begins attribution calculation.
2. **Email Association**: Ensure that the commit author email (`lakshyadharkar@gmail.com`) is added and verified in the contributor's GitHub account settings (`Settings -> Emails`).
3. **GitHub Background Propagation**: GitHub computes the repository contributors list asynchronously. It may take between 1 hour to 24 hours after merging into `main` for the right-hand sidebar contributor list to refresh.
4. **Merge Method**: When merging on GitHub, select **"Create a merge commit"** or **"Rebase and merge"** to preserve the contributor's individual commit signatures. If choosing **"Squash and merge"**, ensure the commit author field is set to `Httpslakshya <lakshyadharkar@gmail.com>`.

---

## 5. Instructions for Maintainers (How to Review & Merge)

### Option A: Merge via GitHub Web UI (Recommended)
1. Open the Pull Request on GitHub from `Httpslakshya/archive_museium:feature/historical-atlas` into `udayapex1/archive_museium:main`.
2. Verify that GitHub confirms: **"Able to merge. These branches can be automatically merged."**
3. Review changes and merge.

### Option B: Local Review & CLI Merge
```bash
# 1. Fetch the feature branch from the contributor's fork
git remote add contributor https://github.com/Httpslakshya/archive_museium.git
git fetch contributor feature/historical-atlas

# 2. Checkout and test locally
git checkout -b review/historical-atlas contributor/feature/historical-atlas
npm install
npm run dev

# 3. Verify TypeScript and production build
npx tsc --noEmit
npm run build

# 4. Merge into main
git checkout main
git merge --no-ff review/historical-atlas -m "merge: integrate The Historical Atlas and Timeline overhaul"

# 5. Push to origin
git push origin main
```

---

## 6. Verification Checklist for the Maintainer

Once running locally (`npm run dev`):

- [ ] **Navigation Bar**: Displays `Home | Atlas | Timeline | Search | Quiz` (Walkthrough cleanly removed).
- [ ] **Historical Atlas (`/atlas`)**: Natural Earth physical geography, cross-border horizons, milestone selector, modern borders toggle on zoom, and drawer context.
- [ ] **Historical Timeline (`/timeline`)**: 6 historical epochs with curatorial headers, jump buttons, 14 turning points, primary sources, and 3D exhibit cards.
- [ ] **Direct Cross-Links**: Clicking "View in Historical Atlas" from Timeline opens the map with that exact era and year selected.
- [ ] **Existing Galleries & Exhibits**: Check `/`, `/galleries/ancient-india`, `/exhibits/great-bath-mohenjo-daro`, `/search`, `/quiz` — all work cleanly.
