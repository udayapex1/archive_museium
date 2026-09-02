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
    coreCenter: [69.5, 28.0],
    label: [70.2, 28.2],
    heartland: 'INDUS, GHAGGAR & GUJARAT REALM',
    ring: [
      [61.0, 25.0],
      [61.8, 27.5],
      [64.5, 30.5],
      [68.5, 33.2],
      [72.5, 34.0],
      [75.0, 32.5],
      [77.5, 30.5],
      [77.8, 28.5],
      [75.5, 26.0],
      [73.5, 23.5],
      [72.5, 21.2],
      [69.2, 21.8],
      [68.0, 23.5],
      [66.5, 24.8],
      [62.5, 25.0],
      [61.0, 25.0],
    ],
  },
  'mauryan-empire': {
    coreCenter: [82.5, 25.0],
    label: [79.5, 24.2],
    heartland: 'PAN-SUBCONTINENTAL EMPIRE',
    ring: [
      [61.5, 34.5],
      [65.5, 36.8],
      [71.0, 36.2],
      [74.8, 35.0],
      [80.0, 31.8],
      [86.0, 28.8],
      [92.5, 26.5],
      [92.8, 22.8],
      [89.5, 21.5],
      [86.0, 19.5],
      [80.5, 14.5],
      [77.5, 13.0],
      [75.0, 13.5],
      [73.5, 16.0],
      [72.5, 19.5],
      [70.0, 21.5],
      [67.0, 24.5],
      [62.0, 25.5],
      [61.0, 30.5],
      [61.5, 34.5],
    ],
  },
  'gupta-empire': {
    coreCenter: [81.5, 25.5],
    label: [81.2, 25.6],
    heartland: 'GANGETIC PLAIN & MALWA',
    ring: [
      [71.5, 30.5],
      [74.5, 32.5],
      [78.5, 31.0],
      [84.5, 28.5],
      [89.5, 27.0],
      [91.8, 24.5],
      [90.0, 22.0],
      [86.5, 21.0],
      [82.0, 21.5],
      [77.5, 21.0],
      [73.5, 21.5],
      [70.0, 22.0],
      [70.5, 25.0],
      [71.5, 28.0],
      [71.5, 30.5],
    ],
  },
  'mughal-empire': {
    coreCenter: [76.5, 27.5],
    label: [77.2, 26.8],
    heartland: 'IMPERIAL HINDUSTAN & DECCAN SUBAHS',
    ring: [
      [64.5, 33.5],
      [68.5, 35.5],
      [74.0, 35.0],
      [78.0, 32.5],
      [84.0, 29.0],
      [90.0, 27.0],
      [93.0, 24.0],
      [90.5, 21.8],
      [87.0, 20.5],
      [81.5, 18.0],
      [76.0, 18.0],
      [73.5, 19.5],
      [70.5, 21.5],
      [67.5, 24.0],
      [64.0, 26.0],
      [62.5, 30.0],
      [64.5, 33.5],
    ],
  },
  'british-era': {
    coreCenter: [79.0, 22.0],
    label: [79.2, 22.5],
    heartland: 'BRITISH RAJ & PRINCELY STATES',
    ring: [
      [61.5, 25.0],
      [62.5, 29.5],
      [66.5, 32.5],
      [69.5, 34.5],
      [73.5, 36.5],
      [78.0, 35.5],
      [81.0, 31.0],
      [88.5, 28.0],
      [92.5, 27.5],
      [97.0, 27.0],
      [98.5, 21.0],
      [98.0, 15.0],
      [94.5, 16.0],
      [92.5, 21.0],
      [89.0, 21.5],
      [85.0, 19.0],
      [80.0, 13.5],
      [79.2, 9.2],
      [77.5, 8.1],
      [75.5, 12.5],
      [73.0, 18.5],
      [70.0, 21.0],
      [68.0, 23.5],
      [67.0, 24.5],
      [61.5, 25.0],
    ],
  },
  'modern-india-republic': {
    coreCenter: [78.5, 22.0],
    label: [78.8, 21.5],
    heartland: 'SOVEREIGN CONSTITUTIONAL REPUBLIC',
    ring: [],
  },
};

// Precompute static rings for historical entities
const precomputedTerritoryPaths: Record<string, string> = {};
for (const [id, def] of Object.entries(historicalGeometry)) {
  if (def.ring && def.ring.length > 0) {
    precomputedTerritoryPaths[id] = ringPath(def.ring);
  }
}

// Surrounding Continents & Broad Geographic Realms
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

const continentAndRealmRenderData = continentAndRealmLabels.map(([label, coord, rot]) => {
  const [x, y] = project(coord);
  return { label, x, y, rot: rot ?? 0 };
});

// Major Seas, Gulfs, Straits and Oceans
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

const seaRenderData = seaLabels.map(([label, coord, rot]) => {
  const [x, y] = project(coord);
  const isMajorOcean = label.includes('OCEAN') || label.includes('SEA') || label.includes('BAY');
  return { label, x, y, rot: rot ?? 0, isMajorOcean };
});

// Physical geographic mountain & plateau landmarks
const physicalLandLabels: Array<[string, Position, number?]> = [
  ['HINDU KUSH', [69.0, 36.5], -18],
  ['H I M A L A Y A', [84.0, 33.5], -10],
  ['THAR DESERT', [71.5, 26.8], 0],
  ['DECCAN PLATEAU', [77.8, 17.5], 0],
  ['WESTERN GHATS', [75.2, 14.2], -78],
  ['EASTERN GHATS', [82.5, 16.5], 55],
];

const physicalLandRenderData = physicalLandLabels.map(([label, coord, rot]) => {
  const [x, y] = project(coord);
  return { label, x, y, rot: rot ?? 0 };
});

// Contextual Historical Regions
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

const eraHistoricalRenderData: Record<string, Array<{ name: string; x: number; y: number }>> = {};
for (const [eraKey, items] of Object.entries(eraHistoricalRegions)) {
  eraHistoricalRenderData[eraKey] = items.map(([name, coord]) => {
    const [x, y] = project(coord);
    return { name, x, y };
  });
}

// Modern Country Reference Labels
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

const modernCountryRenderData = modernCountryReferenceLabels.map(([label, coord]) => {
  const [x, y] = project(coord);
  return { label, x, y };
});

// Modern States & Provinces
const modernStateAndProvinceLabels: Array<[string, Position]> = [
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
  ['Sindh', [68.8, 26.0]],
  ['Punjab (PK)', [72.5, 30.5]],
  ['Balochistan', [65.0, 28.5]],
  ['Khyber Pakhtunkhwa', [71.5, 34.5]],
  ['Kabul', [69.2, 34.6]],
  ['Kandahar', [65.7, 31.6]],
  ['Herat', [62.2, 34.3]],
  ['Dhaka Region', [90.4, 23.8]],
  ['Kathmandu Valley', [85.3, 27.7]],
  ['Central Province (SL)', [80.7, 7.2]],
];

const modernStateRenderData = modernStateAndProvinceLabels.map(([name, coord]) => {
  const [x, y] = project(coord);
  return { name, x, y };
});

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
  const targetPan = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const wheelRafRef = useRef<number | null>(null);
  const targetScale = useRef(1);

  // World landmass polygons from Natural Earth 1:110m
  const worldFeatures = (geographyWorld.features as unknown) as Array<{
    geometry: { type: string; coordinates: Position[][] };
  }>;

  // Memoize world paths once (eliminates continuous stringification during drags)
  const worldPaths = useMemo(() => {
    return worldFeatures.map((feature) =>
      feature.geometry.coordinates.map((ring) => linePath(ring) + ' Z').join(' ')
    );
  }, [worldFeatures]);

  // High-resolution South Asia features
  const southAsiaFeatures = geographySouthAsia.features as GeoFeature[];
  const countries = useMemo(
    () => southAsiaFeatures.filter((feature) => feature.properties.layer === 'country'),
    [southAsiaFeatures]
  );
  const rivers = useMemo(
    () => southAsiaFeatures.filter((feature) => feature.properties.layer === 'river'),
    [southAsiaFeatures]
  );

  // Memoize country paths once
  const countryPathList = useMemo(() => {
    return countries.map((country) => ({
      name: country.properties.name,
      d: geometryPath(country.geometry),
    }));
  }, [countries]);

  // Combined country path for coastal bathymetric waves and clipPath
  const combinedCountryPath = useMemo(() => {
    return countryPathList.map((c) => c.d).join(' ');
  }, [countryPathList]);

  // India geometry path for Modern Republic
  const indiaD = useMemo(() => {
    const ind = countries.find((c) => c.properties.name === 'India');
    return ind ? geometryPath(ind.geometry) : '';
  }, [countries]);

  // Memoize river paths and label coordinates
  const riverRenderData = useMemo(() => {
    return rivers.map((river) => {
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

      return {
        key: `${river.properties.name}-${midpoint.join(',')}`,
        name: river.properties.name,
        d: riverPath(river.geometry),
        isMajorArtery,
        labelX,
        labelY,
      };
    });
  }, [rivers]);

  // Zoom-dependent Level of Detail (LoD)
  const showRegionalDetail = scale >= 1.22;
  const showLocalDetail = scale >= 1.90;

  const setZoom = (factor: number) =>
    setScale((value) => Math.max(0.80, Math.min(4.0, value * factor)));

  useEffect(() => {
    targetScale.current = scale;
  }, [scale]);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.14 : 0.88;
    targetScale.current = Math.max(0.80, Math.min(4.0, targetScale.current * factor));
    if (wheelRafRef.current === null) {
      wheelRafRef.current = requestAnimationFrame(() => {
        setScale(targetScale.current);
        wheelRafRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    element?.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      element?.removeEventListener('wheel', handleWheel);
      if (wheelRafRef.current !== null) {
        cancelAnimationFrame(wheelRafRef.current);
      }
    };
  }, [handleWheel]);

  const onPointerDown = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest('button, .interactive-region, .interactive-place')) return;
    setDragging(true);
    dragStart.current = { x: event.clientX, y: event.clientY };
    panStart.current = pan;
    targetPan.current = pan;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    targetPan.current = {
      x: Math.max(-750, Math.min(750, panStart.current.x + event.clientX - dragStart.current.x)),
      y: Math.max(-550, Math.min(550, panStart.current.y + event.clientY - dragStart.current.y)),
    };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setPan(targetPan.current);
        rafRef.current = null;
      });
    }
  };

  const onPointerUp = (event: React.PointerEvent) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPan(targetPan.current);
    setDragging(false);
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
  };

  const reset = () => {
    targetScale.current = 1;
    targetPan.current = { x: 0, y: 0 };
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
        background: 'linear-gradient(145deg, #7c9aa8 0%, #8ca9b7 50%, #7896a4 100%)',
      }}
    >
      {/* Refined Museum Inset Border */}
      <div className="pointer-events-none absolute inset-2.5 z-10 rounded-2xl border border-[#ede1cd]/70 shadow-[inset_0_0_0_9px_rgba(58,42,28,0.06)]" />

      {/* Tactile Antique Laid Paper Grain & Parchment Vignette (GPU-composited CSS outside SVG for 60+ FPS) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 grain opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(ellipse at center, transparent 40%, rgba(68, 48, 30, 0.20) 100%)',
        }}
      />

      <svg
        viewBox="0 0 1000 700"
        className={`h-full w-full ${
          dragging ? 'transition-none' : 'transition-transform duration-200 ease-out'
        }`}
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
          transformOrigin: '500px 350px',
          willChange: dragging ? 'transform' : 'auto',
        }}
        shapeRendering="geometricPrecision"
      >
        <defs>
          {/* Global Landmask ClipPath: Precomputed single combined paths */}
          <clipPath id="world-land-clip">
            {worldPaths.map((d, idx) => (
              <path key={`clip-w-${idx}`} d={d} />
            ))}
            <path d={combinedCountryPath} />
          </clipPath>

          {/* Desert Stipple Texture (Fast hardware-supported static vector pattern) */}
          <pattern id="desert-stipple" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="0.75" fill="#846d53" opacity="0.45" />
            <circle cx="7.5" cy="4.5" r="0.65" fill="#846d53" opacity="0.35" />
            <circle cx="4.0" cy="8.0" r="0.55" fill="#846d53" opacity="0.40" />
            <circle cx="8.5" cy="8.5" r="0.50" fill="#846d53" opacity="0.30" />
          </pattern>
        </defs>

        {/* 1. WATER LAYER: Archival dusty blue-grey ocean */}
        <rect width="1000" height="700" fill="#809ea9" />

        {/* Coastal Bathymetric Waves (Single combined paths for high performance) */}
        <g fill="none" pointerEvents="none">
          <path d={combinedCountryPath} stroke="#6e8d98" strokeWidth="2.2" opacity="0.40" />
          <path d={combinedCountryPath} stroke="#668794" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.45" />
          <path d={combinedCountryPath} stroke="#5d7f8d" strokeWidth="0.9" strokeDasharray="1.5 5" opacity="0.35" />
          <path d={combinedCountryPath} stroke="#6e8d98" strokeWidth="5.5" opacity="0.22" />
        </g>

        {/* 2. WORLD CONTINENTAL LANDMASS (Warm aged parchment buff tone) */}
        <g fill="#ebdcc8" stroke="#baaa93" strokeWidth="0.55" strokeLinejoin="round">
          {worldPaths.map((d, idx) => (
            <path key={`w-land-${idx}`} d={d} />
          ))}
        </g>

        {/* Desert Stipple Texture Overlays in Arid Zones */}
        <g pointerEvents="none">
          <ellipse
            cx={project([71.5, 27.0])[0]}
            cy={project([71.5, 27.0])[1]}
            rx="48"
            ry="36"
            fill="url(#desert-stipple)"
          />
          <ellipse
            cx={project([64.5, 28.5])[0]}
            cy={project([64.5, 28.5])[1]}
            rx="42"
            ry="26"
            fill="url(#desert-stipple)"
          />
          <ellipse
            cx={project([56.0, 32.5])[0]}
            cy={project([56.0, 32.5])[1]}
            rx="45"
            ry="25"
            fill="url(#desert-stipple)"
          />
        </g>

        {/* 3. HIGH-RESOLUTION SOUTH ASIA LANDMASS (Warm antique parchment tone) */}
        <g fill="#eedfcb" stroke="#8d7760" strokeWidth="0.8" strokeLinejoin="round">
          {countryPathList.map((country) => (
            <path
              key={`sa-land-${country.name}`}
              d={country.d}
              stroke={showModernBorders ? '#8d7760' : 'none'}
            />
          ))}
        </g>

        {/* External Subcontinent Coastline Contour */}
        <g fill="none" stroke="#7a6550" strokeWidth="0.95" strokeLinejoin="round" pointerEvents="none">
          <path d={combinedCountryPath} />
        </g>

        {/* 4. MODERN REFERENCE BORDERS (ONLY visible when toggle is ON) */}
        {showModernBorders && (
          <g fill="none" stroke="#634c3a" strokeWidth="0.85" strokeDasharray="3 3.5" opacity="0.85" pointerEvents="none">
            <path d={combinedCountryPath} />
          </g>
        )}

        {/* 5. HISTORICAL TERRITORIAL WASH (Subordinate to geography, clipped to world landmass) */}
        <g clipPath="url(#world-land-clip)">
          {regions.map((region) => {
            const isSelected = selectedRegion?.id === region.id;
            const isHovered = hoveredRegion?.id === region.id;
            const uncertain = region.certainty !== 'well-supported';

            // Get territorial path
            const territoryPath =
              region.id === 'modern-india-republic' && indiaD
                ? indiaD
                : precomputedTerritoryPaths[region.id] || null;

            if (!territoryPath) return null;

            return (
              <g
                key={region.id}
                className="interactive-region cursor-pointer transition-opacity duration-200"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectRegion(isSelected ? null : region);
                }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* A. Broad Continuous Rich Watercolor Wash */}
                <path
                  d={territoryPath}
                  fill={region.colorTheme}
                  fillOpacity={isSelected ? 0.44 : isHovered ? 0.38 : 0.32}
                  stroke="none"
                />

                {/* B. Central Emphasis Tint */}
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

        {/* 6. GEOGRAPHY LAYER: River Systems */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {riverRenderData.map((river) => (
            <g key={river.key}>
              <path
                d={river.d}
                stroke="#22485c"
                strokeWidth={river.isMajorArtery ? 1.95 : 1.35}
                opacity="0.95"
              />
              {showRegionalDetail && (
                <text
                  x={river.labelX}
                  y={river.labelY - 3}
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
                  {river.name}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* 7. Continents and Broad Surrounding World Realms */}
        <g fill="#695642" fontFamily="Georgia, serif" opacity="0.85" pointerEvents="none">
          {continentAndRealmRenderData.map(({ label, x, y }) => (
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
          ))}
        </g>

        {/* 8. Seas, Gulfs, Straits and Oceans (Antique Italic Typography) */}
        <g fill="#173f52" fontFamily="Georgia, serif" fontStyle="italic" opacity="0.92" pointerEvents="none">
          {seaRenderData.map(({ label, x, y, rot, isMajorOcean }) => {
            if (!isMajorOcean && !showRegionalDetail) return null;
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}
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
          {physicalLandRenderData.map(({ label, x, y, rot }) => {
            if (!showRegionalDetail) return null;
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}
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
            {(eraHistoricalRenderData[currentEra] || []).map(({ name, x, y }) => (
              <text key={name} x={x} y={y} textAnchor="middle" stroke="#eedfcb" strokeWidth="2.4" paintOrder="stroke">
                {name}
              </text>
            ))}
          </g>
        )}

        {/* 11. Modern Country Reference Labels (ONLY shown when Modern Borders toggle is ON) */}
        {showModernBorders && (
          <g fill="#332418" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="8.5" letterSpacing="1.8" opacity="0.90" pointerEvents="none">
            {modernCountryRenderData.map(({ label, x, y }) => (
              <text key={label} x={x} y={y} textAnchor="middle" stroke="#eedfcb" strokeWidth="3.0" paintOrder="stroke">
                {label}
              </text>
            ))}
          </g>
        )}

        {/* 12. Modern States & Provinces (ONLY shown when Modern Borders is ON AND Zoomed in >= 1.22) */}
        {showModernBorders && showRegionalDetail && (
          <g fill="#4f3b2c" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="7" letterSpacing="0.8" opacity="0.85" pointerEvents="none">
            {modernStateRenderData.map(({ name, x, y }) => (
              <text key={name} x={x} y={y} textAnchor="middle" stroke="#eedfcb" strokeWidth="2.4" paintOrder="stroke">
                {name}
              </text>
            ))}
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
