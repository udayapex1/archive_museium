'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Compass, Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import geographyWorld from '@/data/atlas/world-land.json';
import geographySouthAsia from '@/data/atlas/south-asia-geography.json';
import { HistoricalPlace, HistoricalRegion } from '@/lib/atlasTypes';

interface HistoricalMapProps {
  activeYear: number;
  regions: HistoricalRegion[];
  places: HistoricalPlace[];
  selectedRegion: HistoricalRegion | null;
  selectedPlace: HistoricalPlace | null;
  onSelectRegion: (region: HistoricalRegion | null) => void;
  onSelectPlace: (place: HistoricalPlace | null) => void;
  showModernBorders: boolean;
  onToggleModernBorders: () => void;
}

type Position = [number, number];
type Geometry = { type: string; coordinates: unknown };
type GeoFeature = { properties: { layer: 'country' | 'river'; name: string; iso?: string }; geometry: Geometry };

// Equirectangular projection centered on the Indian subcontinent (~79°E, 21°N)
// Scaled so the Indian subcontinent is the central focal area, while surrounding Afro-Eurasian
// world landmass (Arabia, Iran, Central Asia, China, Southeast Asia) is contiguous and explorable.
const center = { lon: 79, lat: 21 };
const mapScale = 16.0;
const project = ([longitude, latitude]: Position): Position => [
  500 + (longitude - center.lon) * mapScale,
  350 - (latitude - center.lat) * mapScale,
];

const linePath = (line: Position[]) =>
  line.map((point, index) => `${index ? 'L' : 'M'} ${project(point).join(' ')}`).join(' ');

const geometryPath = (geometry: Geometry) => {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : (geometry.coordinates as Position[][][]);
  return polygons
    .map((polygon) => (polygon as Position[][]).map((ring) => `${linePath(ring)} Z`).join(' '))
    .join(' ');
};

const riverPath = (geometry: Geometry) => {
  const lines = geometry.type === 'LineString' ? [geometry.coordinates] : (geometry.coordinates as Position[][]);
  return lines.map((line) => linePath(line as Position[])).join(' ');
};

const ringPath = (ring: Position[]) => `${linePath(ring)} Z`;

// Geographically accurate historical territorial frontiers spanning their genuine cross-border horizons
const historicalGeometry: Record<string, { ring: Position[]; label: Position; coreCenter: Position; heartland: string }> = {
  'indus-valley-civilization': {
    // Spans Makran, Balochistan, Sindh, Pakistani Punjab, Indian Punjab, Haryana, Rajasthan, Gujarat
    coreCenter: [69.5, 28.0],
    label: [70.2, 28.2],
    heartland: 'INDUS, GHAGGAR & GUJARAT REALM',
    ring: [
      [61.0, 25.0], // Makran coast (Sutkagan Dor)
      [61.8, 27.5], // Balochistan
      [64.5, 30.5], // Quetta / Bolan pass corridor
      [68.5, 33.2], // Khyber / Potohar corridor
      [72.5, 34.0], // Swat & Taxila foothills
      [75.0, 32.5], // Punjab (Beas / Sutlej)
      [77.5, 30.5], // Haryana / Rakhigarhi
      [77.8, 28.5], // Upper Yamuna (Alamgirpur)
      [75.5, 26.0], // Rajasthan Aravallis (Kalibangan)
      [73.5, 23.5], // North Gujarat
      [72.5, 21.2], // Gulf of Khambhat / Lothal
      [69.2, 21.8], // Saurashtra peninsula
      [68.0, 23.5], // Rann of Kutch
      [66.5, 24.8], // Indus delta
      [62.5, 25.0],
      [61.0, 25.0]
    ],
  },
  'mauryan-empire': {
    // Spans Afghanistan (Herat, Kandahar, Kabul), all of Pakistan, north/central/east India, Bangladesh, to Karnataka
    coreCenter: [82.5, 25.0],
    label: [79.5, 24.2],
    heartland: 'PAN-SUBCONTINENTAL EMPIRE',
    ring: [
      [61.5, 34.5], // Herat / Arachosia
      [65.5, 36.8], // Hindu Kush
      [71.0, 36.2], // Kabul / Gandhara
      [74.8, 35.0], // Kashmir
      [80.0, 31.8], // Himalayan foothills
      [86.0, 28.8], // Nepal Terai
      [92.5, 26.5], // Assam border
      [92.8, 22.8], // Chittagong / Bengal
      [89.5, 21.5], // Sundarbans delta
      [86.0, 19.5], // Kalinga / Odisha coast
      [80.5, 14.5], // Andhra coast
      [77.5, 13.0], // Karnataka (Brahmagiri / Siddapura edicts)
      [75.0, 13.5], // Western Karnataka
      [73.5, 16.0], // Maharashtra coast
      [72.5, 19.5], // Konkan
      [70.0, 21.5], // Saurashtra (Girnar edicts)
      [67.0, 24.5], // Indus mouth
      [62.0, 25.5], // Gedrosia / Makran
      [61.0, 30.5], // Seistan
      [61.5, 34.5]
    ],
  },
  'gupta-empire': {
    // Core Gangetic valley, Malwa, Bengal, Punjab up to Jhelum, Saurashtra
    coreCenter: [81.5, 25.5],
    label: [81.2, 25.6],
    heartland: 'GANGETIC PLAIN & MALWA',
    ring: [
      [71.5, 30.5], // Punjab / Multan border
      [74.5, 32.5], // Shivalik foothills
      [78.5, 31.0], // Garhwal
      [84.5, 28.5], // Nepal Terai
      [89.5, 27.0], // Bengal / Kamarupa frontier
      [91.8, 24.5], // Samatata (Eastern Bengal)
      [90.0, 22.0], // Bengal delta
      [86.5, 21.0], // Odisha border
      [82.0, 21.5], // Chhattisgarh
      [77.5, 21.0], // Narmada / Vakataka frontier
      [73.5, 21.5], // Gujarat
      [70.0, 22.0], // Saurashtra
      [70.5, 25.0], // Rajasthan
      [71.5, 28.0], // Thar margin
      [71.5, 30.5]
    ],
  },
  'mughal-empire': {
    // Kabul, Kandahar, all of Pakistan, northern India, Bengal, Gujarat, and Deccan subahs
    coreCenter: [76.5, 27.5],
    label: [77.2, 26.8],
    heartland: 'IMPERIAL HINDUSTAN & DECCAN SUBAHS',
    ring: [
      [64.5, 33.5], // Kandahar
      [68.5, 35.5], // Kabul / Hindu Kush
      [74.0, 35.0], // Kashmir
      [78.0, 32.5], // Himalayan frontier
      [84.0, 29.0], // Awadh / Nepal border
      [90.0, 27.0], // Bengal / Assam frontier
      [93.0, 24.0], // Sylhet / Chittagong
      [90.5, 21.8], // Bengal delta
      [87.0, 20.5], // Odisha coast
      [81.5, 18.0], // Deccan / Godavari
      [76.0, 18.0], // Aurangabad
      [73.5, 19.5], // Konkan
      [70.5, 21.5], // Gujarat
      [67.5, 24.0], // Sindh / Indus delta
      [64.0, 26.0], // Balochistan
      [62.5, 30.0], // Seistan
      [64.5, 33.5]
    ],
  },
  'british-era': {
    // British Indian Empire (British Raj provinces & Princely States across India, Pakistan, Bangladesh, and Burma)
    coreCenter: [79.0, 22.0],
    label: [79.2, 22.5],
    heartland: 'BRITISH RAJ & PRINCELY STATES',
    ring: [
      [61.5, 25.0], // Balochistan / Iran frontier
      [62.5, 29.5], // Seistan
      [66.5, 32.5], // Durand Line (Chaman)
      [69.5, 34.5], // Khyber Pass
      [73.5, 36.5], // Gilgit / Karakoram
      [78.0, 35.5], // Ladakh
      [81.0, 31.0], // Tibet frontier
      [88.5, 28.0], // Sikkim
      [92.5, 27.5], // Arunachal
      [97.0, 27.0], // Upper Burma / Yunnan frontier
      [98.5, 21.0], // Shan States
      [98.0, 15.0], // Tenasserim coast
      [94.5, 16.0], // Irrawaddy delta
      [92.5, 21.0], // Arakan
      [89.0, 21.5], // Sundarbans
      [85.0, 19.0], // Odisha coast
      [80.0, 13.5], // Madras presidency coast
      [79.2, 9.2],  // Palk Strait
      [77.5, 8.1],  // Cape Comorin
      [75.5, 12.5], // Malabar coast
      [73.0, 18.5], // Bombay presidency coast
      [70.0, 21.0], // Kathiawar
      [68.0, 23.5], // Rann of Kutch
      [67.0, 24.5], // Karachi / Indus delta
      [61.5, 25.0]
    ],
  },
  'modern-india-republic': {
    coreCenter: [78.5, 22.0],
    label: [78.8, 21.5],
    heartland: 'SOVEREIGN CONSTITUTIONAL REPUBLIC',
    ring: [], // Exact sovereign geometry from Natural Earth
  },
};

// Surrounding Continents & Broad Geographic Realms (always present on world landmass)
const continentAndRealmLabels: Array<[string, Position, number?]> = [
  ['A S I A', [88.0, 42.0], 0],
  ['C E N T R A L   A S I A', [66.5, 40.5], 0],
  ['P E R S I A', [55.5, 32.5], 0],
  ['A R A B I A', [46.5, 24.5], 0],
  ['A F R I C A', [38.5, 15.0], 0],
  ['T I B E T', [87.5, 32.0], 0],
  ['C H I N A', [104.0, 31.5], 0],
  ['S O U T H E A S T   A S I A', [101.5, 16.5], 0],
];

// Major Seas, Gulfs, Straits and Oceans (antique italic cartography)
const seaLabels: Array<[string, Position, number?]> = [
  ['A R A B I A N   S E A', [63.5, 17.5], -74],
  ['B A Y   O F   B E N G A L', [91.0, 15.5], 70],
  ['I N D I A N   O C E A N', [78.5, 3.5], 0],
  ['PERSIAN GULF', [51.5, 26.5], -35],
  ['GULF OF OMAN', [58.5, 24.5], -15],
  ['GULF OF ADEN', [48.5, 12.5], 0],
  ['RED SEA', [39.0, 20.5], -50],
  ['ANDAMAN SEA', [96.0, 11.5], 75],
  ['LAKSHADWEEP SEA', [73.8, 9.5], -75],
  ['GULF OF KUTCH', [69.2, 22.8], 0],
  ['GULF OF KHAMBHAT', [72.3, 21.2], 0],
  ['PALK STRAIT', [79.8, 9.6], 0],
];

// Physical geographic mountain & plateau landmarks
const physicalLandLabels: Array<[string, Position, number?]> = [
  ['HINDU KUSH', [69.0, 36.5], -18],
  ['H I M A L A Y A', [84.0, 33.5], -10],
  ['THAR DESERT', [71.5, 26.8], 0],
  ['DECCAN PLATEAU', [77.8, 17.5], 0],
  ['WESTERN GHATS', [75.2, 14.2], -78],
  ['EASTERN GHATS', [82.5, 16.5], 55],
];

// Contextual Historical Regions (Shown ONLY when Modern Borders is OFF)
const eraHistoricalRegions: Record<string, Array<[string, Position]>> = {
  'ancient-india': [
    ['MAGADHA', [85.2, 25.0]],
    ['GANDHARA', [71.5, 33.8]],
    ['KALINGA', [85.5, 20.0]],
    ['ARYAVARTA', [78.5, 28.5]],
    ['AVANTI', [75.8, 23.2]],
    ['DAKSHINAPATHA', [77.5, 15.5]],
    ['PUNJAB', [73.8, 31.2]],
  ],
  'mughal-era': [
    ['SUBAH HINDUSTAN', [78.2, 27.8]],
    ['SUBAH PUNJAB', [74.2, 31.5]],
    ['SUBAH BENGAL', [88.5, 23.8]],
    ['SUBAH GUJARAT', [72.2, 22.8]],
    ['SUBAH KABUL', [69.2, 34.5]],
    ['DECCAN SUBAHS', [77.5, 18.5]],
  ],
  'modern-india': [
    ['NORTHERN PLAINS', [78.2, 28.0]],
    ['DECCAN PENINSULA', [77.5, 15.5]],
    ['INDUS BASIN', [69.5, 29.5]],
    ['BENGAL DELTA', [89.5, 23.5]],
  ],
};

// Modern Country Reference Labels (ONLY shown when Modern Borders toggle is ON)
const modernCountryReferenceLabels: Array<[string, Position]> = [
  ['AFGHANISTAN', [66.2, 33.8]],
  ['PAKISTAN', [69.2, 29.8]],
  ['INDIA', [78.8, 21.3]],
  ['NEPAL', [83.8, 28.3]],
  ['BHUTAN', [90.4, 27.4]],
  ['BANGLADESH', [90.2, 23.8]],
  ['SRI LANKA', [80.8, 7.5]],
  ['MYANMAR', [95.8, 21.5]],
  ['CHINA (TIBET)', [88.0, 32.5]],
  ['IRAN', [59.5, 32.0]],
];

// Modern States & Provinces (ONLY shown when Modern Borders toggle is ON AND Zoomed in >= 1.25)
const modernStateAndProvinceLabels: Array<[string, Position]> = [
  // India
  ['Punjab', [75.3, 31.0]],
  ['Haryana', [76.3, 29.2]],
  ['Rajasthan', [73.5, 26.5]],
  ['Gujarat', [71.5, 22.5]],
  ['Maharashtra', [75.5, 19.5]],
  ['Karnataka', [75.8, 14.5]],
  ['Kerala', [76.5, 10.2]],
  ['Tamil Nadu', [78.5, 11.2]],
  ['Andhra Pradesh', [80.0, 15.5]],
  ['Telangana', [79.0, 17.8]],
  ['Odisha', [84.5, 20.5]],
  ['West Bengal', [87.8, 23.5]],
  ['Bihar', [85.5, 25.5]],
  ['Uttar Pradesh', [80.5, 27.0]],
  ['Madhya Pradesh', [78.0, 23.5]],
  ['Assam', [92.8, 26.2]],
  ['Jammu & Kashmir', [75.0, 33.8]],
  ['Ladakh', [77.8, 34.5]],
  // Pakistan
  ['Sindh', [68.8, 26.0]],
  ['Punjab (PK)', [72.5, 30.5]],
  ['Balochistan', [65.0, 28.5]],
  ['Khyber Pakhtunkhwa', [71.5, 34.5]],
  // Afghanistan
  ['Kabul', [69.2, 34.6]],
  ['Kandahar', [65.7, 31.6]],
  ['Herat', [62.2, 34.3]],
  // Bangladesh / Nepal / Sri Lanka
  ['Dhaka Region', [90.4, 23.8]],
  ['Kathmandu Valley', [85.3, 27.7]],
  ['Central Province (SL)', [80.7, 7.2]],
];

// Historical place priority hierarchy
const placeHierarchy = (place: HistoricalPlace): { level: 1 | 2 | 3; categoryLabel: string } => {
  if (place.type === 'capital') return { level: 3, categoryLabel: 'Imperial Capital' };
  if (place.type === 'port' || place.type === 'learning-center')
    return { level: 2, categoryLabel: place.type === 'port' ? 'Maritime Port' : 'University' };
  return { level: 1, categoryLabel: 'Historical Site' };
};

export function HistoricalMap({
  activeYear,
  regions,
  places,
  selectedRegion,
  selectedPlace,
  onSelectRegion,
  onSelectPlace,
  showModernBorders,
  onToggleModernBorders,
}: HistoricalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<HistoricalRegion | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<HistoricalPlace | null>(null);

  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  // World landmass polygons from Natural Earth 1:110m (covers whole globe, eliminates empty voids)
  const worldFeatures = (geographyWorld.features as unknown) as Array<{
    geometry: { type: string; coordinates: Position[][] };
  }>;

  // High-resolution South Asia features (rivers & countries)
  const southAsiaFeatures = geographySouthAsia.features as GeoFeature[];
  const countries = useMemo(
    () => southAsiaFeatures.filter((feature) => feature.properties.layer === 'country'),
    [southAsiaFeatures]
  );
  const rivers = useMemo(
    () => southAsiaFeatures.filter((feature) => feature.properties.layer === 'river'),
    [southAsiaFeatures]
  );
  const indiaCountry = useMemo(
    () => countries.find((c) => c.properties.name === 'India'),
    [countries]
  );

  // Zoom-dependent Level of Detail (LoD)
  const showRegionalDetail = scale >= 1.22;
  const showLocalDetail = scale >= 1.90;

  const setZoom = (factor: number) =>
    setScale((value) => Math.max(0.80, Math.min(4.0, value * factor)));

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      setZoom(event.deltaY < 0 ? 1.14 : 0.88);
    },
    []
  );

  useEffect(() => {
    const element = containerRef.current;
    element?.addEventListener('wheel', handleWheel, { passive: false });
    return () => element?.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const onPointerDown = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest('button, .interactive-region, .interactive-place')) return;
    setDragging(true);
    dragStart.current = { x: event.clientX, y: event.clientY };
    panStart.current = pan;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    setPan({
      x: Math.max(-750, Math.min(750, panStart.current.x + event.clientX - dragStart.current.x)),
      y: Math.max(-550, Math.min(550, panStart.current.y + event.clientY - dragStart.current.y)),
    });
  };

  const onPointerUp = (event: React.PointerEvent) => {
    setDragging(false);
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
  };

  const reset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // Determine current active era for contextual historical labels
  const currentEra = useMemo(() => {
    if (activeYear < 0 || activeYear <= 600) return 'ancient-india';
    if (activeYear >= 1500 && activeYear <= 1750) return 'mughal-era';
    if (activeYear >= 1800) return 'modern-india';
    return 'ancient-india';
  }, [activeYear]);

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`relative h-full w-full overflow-hidden select-none touch-none ${
        dragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        // Archival muted dusty blue-grey ocean wash for surrounding canvas
        background: 'linear-gradient(145deg, #7c9aa8 0%, #8ca9b7 50%, #7896a4 100%)',
      }}
    >
      {/* Refined Museum Inset Border */}
      <div className="pointer-events-none absolute inset-2.5 z-10 rounded-2xl border border-[#ede1cd]/70 shadow-[inset_0_0_0_9px_rgba(58,42,28,0.06)]" />

      <svg
        viewBox="0 0 1000 700"
        className="h-full w-full transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
          transformOrigin: '500px 350px',
        }}
      >
        <defs>
          {/* Global Landmask ClipPath: Automatically clips territories to real land so they never spill into the sea,
              while allowing seamless, continuous coverage across Afghanistan, Pakistan, India, Bangladesh, Myanmar, etc. */}
          <clipPath id="world-land-clip">
            {worldFeatures.map((feature, idx) => (
              <path
                key={`clip-w-${idx}`}
                d={feature.geometry.coordinates
                  .map((ring) => linePath(ring) + ' Z')
                  .join(' ')}
              />
            ))}
            {countries.map((country) => (
              <path key={`clip-sa-${country.properties.name}`} d={geometryPath(country.geometry)} />
            ))}
          </clipPath>
        </defs>

        {/* 1. WATER LAYER: Unmistakable archival dusty blue-grey ocean */}
        <rect width="1000" height="700" fill="#809ea9" />

        {/* Subtle Bathymetric Coastal Wave Lines */}
        <g fill="none" stroke="#6e8d98" strokeWidth="2.2" opacity="0.40" pointerEvents="none">
          {countries.map((country) => (
            <path key={`wave-1-${country.properties.name}`} d={geometryPath(country.geometry)} />
          ))}
        </g>
        <g fill="none" stroke="#6e8d98" strokeWidth="5.5" opacity="0.22" pointerEvents="none">
          {countries.map((country) => (
            <path key={`wave-2-${country.properties.name}`} d={geometryPath(country.geometry)} />
          ))}
        </g>

        {/* 2. WORLD CONTINENTAL LANDMASS (Full World Base: Arabia, Iran, Central Asia, China, SE Asia) */}
        {/* Warm aged parchment buff tone - eliminates stark white floating islands! */}
        <g fill="#ebdcc8" stroke="#baaa93" strokeWidth="0.55" strokeLinejoin="round">
          {worldFeatures.map((feature, idx) => (
            <path
              key={`w-land-${idx}`}
              d={feature.geometry.coordinates
                .map((ring) => linePath(ring) + ' Z')
                .join(' ')}
            />
          ))}
        </g>

        {/* 3. HIGH-RESOLUTION SOUTH ASIA LANDMASS (Warm antique parchment tone) */}
        <g fill="#eedfcb" stroke="#8d7760" strokeWidth="0.8" strokeLinejoin="round">
          {countries.map((country) => (
            <path
              key={`sa-land-${country.properties.name}`}
              d={geometryPath(country.geometry)}
              // Modern country partition lines are ONLY stroked when Modern Borders is enabled
              stroke={showModernBorders ? '#8d7760' : 'none'}
            />
          ))}
        </g>

        {/* External Subcontinent Coastline Contour (Always drawn so coast is sharp against the blue sea) */}
        <g fill="none" stroke="#7a6550" strokeWidth="0.95" strokeLinejoin="round" pointerEvents="none">
          {countries.map((country) => (
            <path key={`sa-coast-${country.properties.name}`} d={geometryPath(country.geometry)} />
          ))}
        </g>

        {/* 4. MODERN REFERENCE BORDERS (ONLY visible when toggle is ON) */}
        {showModernBorders && (
          <g fill="none" stroke="#634c3a" strokeWidth="0.85" strokeDasharray="3 3.5" opacity="0.85" pointerEvents="none">
            {countries.map((country) => (
              <path key={`mod-border-${country.properties.name}`} d={geometryPath(country.geometry)} />
            ))}
          </g>
        )}

        {/* 5. HISTORICAL TERRITORIAL WASH (Subordinate to geography, clipped to world landmass) */}
        {/* Confident, richer transparent watercolor land wash spanning the empire's full civilizational horizon
            (Pakistan, Afghanistan, India, Bangladesh, Myanmar, etc.) without modern boundary partition lines */}
        <g clipPath="url(#world-land-clip)">
          {regions.map((region) => {
            const isSelected = selectedRegion?.id === region.id;
            const isHovered = hoveredRegion?.id === region.id;
            const uncertain = region.certainty !== 'well-supported';

            // Get territorial path (Republic uses sovereign geometry, historical entities use genuine cross-border rings)
            const territoryPath =
              region.id === 'modern-india-republic' && indiaCountry
                ? geometryPath(indiaCountry.geometry)
                : historicalGeometry[region.id]?.ring
                ? ringPath(historicalGeometry[region.id].ring)
                : null;

            if (!territoryPath) return null;

            return (
              <g
                key={region.id}
                className="interactive-region cursor-pointer transition-opacity duration-300"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectRegion(isSelected ? null : region);
                }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* A. Broad Continuous Rich Watercolor Wash (Darker and more confident per user request) */}
                <path
                  d={territoryPath}
                  fill={region.colorTheme}
                  fillOpacity={isSelected ? 0.44 : isHovered ? 0.38 : 0.32}
                  stroke="none"
                />

                {/* B. Central Emphasis Tint (Adds depth to the heartland) */}
                <path
                  d={territoryPath}
                  fill={region.colorTheme}
                  fillOpacity={isSelected ? 0.12 : isHovered ? 0.09 : 0.06}
                  stroke="none"
                />

                {/* C. Clean Etched Frontier Line */}
                <path
                  d={territoryPath}
                  fill="none"
                  stroke={region.colorTheme}
                  strokeWidth={isSelected ? 1.6 : isHovered ? 1.2 : 0.95}
                  strokeOpacity={isSelected ? 0.90 : isHovered ? 0.75 : 0.60}
                  strokeDasharray={uncertain ? '4 3.5' : undefined}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>

        {/* 6. GEOGRAPHY LAYER: River Systems (Rendered ON TOP of territory wash for crystal legibility) */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {rivers.map((river) => {
            const isMajorArtery =
              river.properties.name === 'Ganges' ||
              river.properties.name === 'Indus' ||
              river.properties.name === 'Brahmaputra';

            const lines: Position[][] =
              river.geometry.type === 'LineString'
                ? [river.geometry.coordinates as Position[]]
                : (river.geometry.coordinates as Position[][]);
            const midpoint = (lines[0] ?? [[0, 0] as Position])[Math.floor((lines[0]?.length ?? 1) / 2)] as Position;
            const [labelX, labelY] = project(midpoint);

            return (
              <g key={`${river.properties.name}-${riverPath(river.geometry).slice(0, 25)}`}>
                <path
                  d={riverPath(river.geometry)}
                  stroke="#22485c"
                  strokeWidth={isMajorArtery ? 1.95 : 1.35}
                  opacity="0.95"
                />
                {showRegionalDetail && (
                  <text
                    x={labelX}
                    y={labelY - 3}
                    fill="#153b4e"
                    stroke="#eedfcb"
                    strokeWidth="2.8"
                    paintOrder="stroke"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fontSize="8"
                    letterSpacing="0.8"
                    opacity="0.95"
                  >
                    {river.properties.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* 7. Continents and Broad Surrounding World Realms */}
        <g fill="#695642" fontFamily="Georgia, serif" opacity="0.85" pointerEvents="none">
          {continentAndRealmLabels.map(([label, coordinate]) => {
            const [x, y] = project(coordinate);
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                stroke="#eedfcb"
                strokeWidth="2.5"
                paintOrder="stroke"
                fontSize="9"
                fontWeight="bold"
                letterSpacing="3.5"
              >
                {label}
              </text>
            );
          })}
        </g>

        {/* 8. Seas, Gulfs, Straits and Oceans (Antique Italic Typography) */}
        <g fill="#173f52" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.92" pointerEvents="none">
          {seaLabels.map(([label, coordinate, rotation]) => {
            const isMajorOcean = label.includes('OCEAN') || label.includes('SEA') || label.includes('BAY');
            const [x, y] = project(coordinate);

            // Minor gulfs and straits visible when zooming into region
            if (!isMajorOcean && !showRegionalDetail) return null;

            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                transform={rotation ? `rotate(${rotation} ${x} ${y})` : undefined}
                stroke="#809ea9"
                strokeWidth="2.4"
                paintOrder="stroke"
                fontSize={isMajorOcean ? '9.5' : '7.5'}
                fontWeight="bold"
                letterSpacing={isMajorOcean ? '2.8' : '1.2'}
              >
                {label}
              </text>
            );
          })}
        </g>

        {/* 9. Mountain & Plateau Physical Landmarks */}
        <g fill="#4e3c2c" fontFamily="Georgia, serif" opacity="0.88" pointerEvents="none">
          {physicalLandLabels.map(([label, coordinate, rotation]) => {
            const [x, y] = project(coordinate);
            if (!showRegionalDetail) return null;

            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                transform={rotation ? `rotate(${rotation} ${x} ${y})` : undefined}
                stroke="#eedfcb"
                strokeWidth="2.5"
                paintOrder="stroke"
                fontSize="8"
                fontWeight="bold"
                letterSpacing="2"
              >
                {label}
              </text>
            );
          })}
        </g>

        {/* 10. Contextual Historical Regions (Shown ONLY when Modern Borders is OFF) */}
        {!showModernBorders && showRegionalDetail && (
          <g fill="#5a4432" fontFamily="Georgia, serif" fontSize="8" fontStyle="italic" letterSpacing="1.5" opacity="0.85" pointerEvents="none">
            {(eraHistoricalRegions[currentEra] || []).map(([name, coordinate]) => {
              const [x, y] = project(coordinate);
              return (
                <text key={name} x={x} y={y} textAnchor="middle" stroke="#eedfcb" strokeWidth="2.4" paintOrder="stroke">
                  {name}
                </text>
              );
            })}
          </g>
        )}

        {/* 11. Modern Country Reference Labels (ONLY shown when Modern Borders toggle is ON) */}
        {showModernBorders && (
          <g fill="#332418" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="8.5" letterSpacing="1.8" opacity="0.90" pointerEvents="none">
            {modernCountryReferenceLabels.map(([label, coordinate]) => {
              const [x, y] = project(coordinate);
              return (
                <text key={label} x={x} y={y} textAnchor="middle" stroke="#eedfcb" strokeWidth="3.0" paintOrder="stroke">
                  {label}
                </text>
              );
            })}
          </g>
        )}

        {/* 12. Modern States & Provinces (ONLY shown when Modern Borders is ON AND Zoomed in >= 1.22) */}
        {showModernBorders && showRegionalDetail && (
          <g fill="#4f3b2c" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="7" letterSpacing="0.8" opacity="0.85" pointerEvents="none">
            {modernStateAndProvinceLabels.map(([name, coordinate]) => {
              const [x, y] = project(coordinate);
              return (
                <text key={name} x={x} y={y} textAnchor="middle" stroke="#eedfcb" strokeWidth="2.4" paintOrder="stroke">
                  {name}
                </text>
              );
            })}
          </g>
        )}

        {/* 13. Historical Polity Imperial Titles */}
        <g pointerEvents="none">
          {regions.map((region) => {
            const mapping = historicalGeometry[region.id];
            if (!mapping) return null;

            const isSelected = selectedRegion?.id === region.id;
            const isHovered = hoveredRegion?.id === region.id;
            const uncertain = region.certainty !== 'well-supported';
            const [x, y] = project(mapping.label);

            return (
              <g key={`label-${region.id}`}>
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill="#24140b"
                  stroke="#f4ebd9"
                  strokeWidth="3.5"
                  paintOrder="stroke"
                  fontFamily="'Geom', Georgia, serif"
                  fontWeight="bold"
                  fontSize={isSelected ? 14.5 : isHovered ? 13.5 : 12}
                  letterSpacing="2.8"
                  opacity={isSelected ? 1 : isHovered ? 0.95 : 0.90}
                  className="transition-all duration-200"
                >
                  {region.name.toUpperCase()}
                </text>

                {(isSelected || isHovered || showRegionalDetail) && (
                  <text
                    x={x}
                    y={y + 13}
                    textAnchor="middle"
                    fill="#4c311f"
                    stroke="#f4ebd9"
                    strokeWidth="2.2"
                    paintOrder="stroke"
                    fontFamily="Arial, sans-serif"
                    fontSize="7"
                    fontWeight="600"
                    letterSpacing="1.2"
                  >
                    {uncertain ? 'APPROXIMATE HISTORICAL EXTENT' : mapping.heartland}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* 14. Historical Cities & Places Hierarchy */}
        <g>
          {places.map((place) => {
            const { level } = placeHierarchy(place);
            const isSelected = selectedPlace?.id === place.id;
            const isHovered = hoveredPlace?.id === place.id;

            const isVisible =
              level === 3 || (level === 2 && showRegionalDetail) || showLocalDetail || isSelected || isHovered;
            if (!isVisible) return null;

            const [x, y] = project([place.coordinates.longitude, place.coordinates.latitude]);
            const showTextLabel = level >= 2 || showLocalDetail || isSelected || isHovered;

            return (
              <g
                key={place.id}
                className="interactive-place cursor-pointer transition-transform duration-150"
                transform={`translate(${x} ${y})`}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectPlace(isSelected ? null : place);
                }}
                onMouseEnter={() => setHoveredPlace(place)}
                onMouseLeave={() => setHoveredPlace(null)}
              >
                {isSelected && <circle r="12" fill="#d47b37" opacity="0.25" className="animate-ping" />}

                {/* Refined Marker Symbol */}
                {level === 3 ? (
                  <g>
                    <circle r={isSelected ? 6.5 : 5} fill="#f4ebd9" stroke="#7d302b" strokeWidth="1.6" />
                    <circle r="2.2" fill="#7d302b" />
                  </g>
                ) : level === 2 ? (
                  <g>
                    <circle r={isSelected ? 5.5 : 3.8} fill="#f4ebd9" stroke="#2e1d14" strokeWidth="1.4" />
                    <circle r="1.8" fill="#d47b37" />
                  </g>
                ) : (
                  <circle r={isSelected ? 4.5 : 2.8} fill="#543c2c" stroke="#f4ebd9" strokeWidth="1" />
                )}

                {/* City Typography */}
                {showTextLabel && (
                  <g>
                    <text
                      x={level === 3 ? '8' : '6'}
                      y={level === 3 ? '-5' : '-4'}
                      fill={level === 3 ? '#5c221e' : '#1f130c'}
                      stroke="#f4ebd9"
                      strokeWidth="2.8"
                      paintOrder="stroke"
                      fontFamily={level === 3 ? "'Geom', Georgia, serif" : 'Arial, sans-serif'}
                      fontWeight={level === 3 ? 'bold' : '600'}
                      fontSize={level === 3 ? '9' : '7.5'}
                      letterSpacing={level === 3 ? '0.4' : '0.2'}
                    >
                      {place.historicalName}
                    </text>

                    {(isSelected || isHovered) && (
                      <text
                        x="0"
                        y="15"
                        textAnchor="middle"
                        fill="#7d302b"
                        stroke="#f4ebd9"
                        strokeWidth="2.5"
                        paintOrder="stroke"
                        fontFamily="Arial, sans-serif"
                        fontSize="7"
                        fontWeight="bold"
                      >
                        Now: {place.modernGeography.modernEquivalentName || place.modernGeography.primaryPresentCountry}
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Navigation Controls */}
      <div className="absolute right-5 top-5 z-20 flex flex-col items-center gap-2">
        <div className="flex flex-col overflow-hidden rounded-full border border-[#bba990] bg-[#f7f1e8]/92 p-1 shadow-lg backdrop-blur-md">
          <button
            onClick={() => setZoom(1.25)}
            aria-label="Zoom in"
            className="grid h-9 w-9 place-items-center text-ink transition hover:bg-[#eadfcd] active:scale-95"
          >
            <ZoomIn size={17} />
          </button>
          <div className="h-px bg-[#d7c6b1]" />
          <button
            onClick={() => setZoom(0.8)}
            aria-label="Zoom out"
            className="grid h-9 w-9 place-items-center text-ink transition hover:bg-[#eadfcd] active:scale-95"
          >
            <ZoomOut size={17} />
          </button>
        </div>

        <button
          onClick={reset}
          aria-label="Reset map view"
          className="grid h-9 w-9 place-items-center rounded-full border border-[#bba990] bg-[#f7f1e8]/92 text-ink shadow-md backdrop-blur-md transition hover:bg-[#eadfcd] active:scale-95"
        >
          <RotateCcw size={15} />
        </button>

        <button
          onClick={onToggleModernBorders}
          aria-label="Toggle modern reference borders"
          title={showModernBorders ? 'Hide modern reference borders' : 'Show modern reference borders'}
          className={`grid h-9 w-9 place-items-center rounded-full border shadow-md backdrop-blur-md transition active:scale-95 ${
            showModernBorders
              ? 'border-maroon bg-maroon text-white'
              : 'border-[#bba990] bg-[#f7f1e8]/92 text-ink hover:bg-[#eadfcd]'
          }`}
        >
          {showModernBorders ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      </div>

      {/* Top-Left Horizon Indicator */}
      <div className="pointer-events-none absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-[#cdbca7] bg-[#f7f1e8]/90 px-3.5 py-2 text-[10px] font-bold tracking-widest text-ink shadow-sm backdrop-blur-sm">
        <Compass size={15} className="text-saffron" />
        <span className="font-display">HISTORICAL ATLAS</span>
        <span className="text-[#8d7563]">·</span>
        <span className="text-[#6d4f3b]">{activeYear < 0 ? `${Math.abs(activeYear)} BCE` : `${activeYear} CE`}</span>
      </div>

      {/* Bottom-Left Museum Cartographic Key */}
      <div className="pointer-events-none absolute bottom-6 left-5 z-20 hidden max-w-[330px] rounded-xl border border-[#cfbfa9] bg-[#f7f1e8]/92 px-3.5 py-2.5 text-[9px] leading-relaxed text-[#624d3b] shadow-md backdrop-blur-md md:block">
        <p className="font-bold uppercase tracking-[0.14em] text-[#3e2d22] border-b border-[#decbb7] pb-1">
          Historical Cartographic Key
        </p>
        <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-3.5 rounded-sm bg-maroon/50" />
            <span>Territorial land wash</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-3.5 border-b border-dashed border-maroon/60" />
            <span>Approximate extent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-maroon font-bold">⊙</span>
            <span>Imperial Metropolis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#d47b37] font-bold">•</span>
            <span>Regional Center / Port</span>
          </div>
        </div>
        <p className="mt-1.5 border-t border-[#decbb7] pt-1 text-[8.5px] italic text-[#7a6452]">
          {showModernBorders
            ? 'Modern reference layer active: Dotted borders, country names, and provincial states shown.'
            : 'Historical view: Modern borders and nation-states hidden to reflect civilizational horizons.'}
        </p>
      </div>
    </div>
  );
}
