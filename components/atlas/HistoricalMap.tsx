'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Compass, Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import geography from '@/data/atlas/south-asia-geography.json';
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

// Atlas viewport equirectangular projection centered on the Indian subcontinent
const bounds = { west: 57, east: 99, north: 40, south: 4 };
const mapScale = 12.3;
const project = ([longitude, latitude]: Position): Position => [
  242 + (longitude - bounds.west) * mapScale,
  30 + (bounds.north - latitude) * mapScale,
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

// Geographically grounded historical territorial frontiers
// Anchored along mountain spines, river basins, and natural frontier corridors
const historicalGeometry: Record<string, { ring: Position[]; label: Position; heartland: string }> = {
  'indus-valley-civilization': {
    label: [68.8, 27.8],
    heartland: 'INDUS & GHAGGAR-HAKRA BASIN',
    ring: [
      [61.5, 25.5], [62.0, 27.5], [64.0, 30.5], [66.5, 33.5], [70.5, 34.8],
      [73.5, 34.2], [75.5, 32.5], [76.8, 30.8], [76.5, 28.5], [75.0, 26.0],
      [73.5, 23.5], [72.8, 21.0], [70.5, 20.2], [68.2, 21.8], [66.0, 24.5],
      [62.5, 25.0], [61.5, 25.5]
    ],
  },
  'mauryan-empire': {
    label: [79.8, 24.8],
    heartland: 'MAGADHA & GANGETIC REALM',
    ring: [
      [62.0, 34.5], [67.0, 37.0], [73.5, 36.5], [77.5, 34.5], [82.5, 31.0],
      [88.5, 28.5], [92.5, 26.5], [92.0, 23.5], [88.5, 21.5], [86.0, 19.5],
      [81.5, 15.5], [78.5, 12.5], [75.5, 13.0], [74.5, 15.5], [73.0, 19.0],
      [70.0, 21.5], [66.5, 24.5], [62.0, 26.5], [61.0, 30.5], [62.0, 34.5]
    ],
  },
  'gupta-empire': {
    label: [81.8, 25.5],
    heartland: 'GANGETIC PLAIN & MALWA',
    ring: [
      [72.5, 29.5], [75.5, 31.8], [79.5, 31.0], [84.5, 28.5], [88.5, 27.0],
      [90.5, 25.0], [89.5, 22.5], [86.5, 21.8], [82.5, 22.0], [77.5, 21.5],
      [73.5, 21.8], [71.0, 22.5], [70.5, 25.0], [71.5, 27.5], [72.5, 29.5]
    ],
  },
  'mughal-empire': {
    label: [77.8, 26.2],
    heartland: 'HINDUSTAN & DOAB CORRIDOR',
    ring: [
      [64.5, 34.0], [69.0, 36.5], [74.5, 35.5], [77.5, 34.0], [82.5, 30.5],
      [88.5, 28.0], [92.5, 25.5], [92.0, 22.5], [88.5, 21.5], [84.5, 20.0],
      [79.5, 18.0], [75.0, 18.5], [73.0, 19.5], [70.5, 21.5], [67.5, 24.5],
      [63.5, 26.5], [62.0, 30.0], [64.5, 34.0]
    ],
  },
  'modern-india-republic': {
    label: [79.0, 22.0],
    heartland: 'SOVEREIGN REPUBLIC',
    ring: [], // Handled by exact sovereign geometry from Natural Earth
  },
};

const countryLabels: Array<[string, Position]> = [
  ['AFGHANISTAN', [66.5, 34.2]],
  ['PAKISTAN', [69.2, 29.5]],
  ['INDIA', [78.8, 21.3]],
  ['NEPAL', [83.4, 28.5]],
  ['BHUTAN', [90.4, 27.4]],
  ['BANGLADESH', [90.4, 23.7]],
  ['SRI LANKA', [80.8, 7.4]],
];

const physicalLabels: Array<[string, Position, number?]> = [
  ['HINDU KUSH', [69.3, 36.8], -18],
  ['H I M A L A Y A', [83.0, 33.8], -12],
  ['THAR DESERT', [71.2, 26.7], 0],
  ['DECCAN PLATEAU', [77.8, 17.5], 0],
  ['WESTERN GHATS', [75.2, 14.5], -78],
  ['EASTERN GHATS', [82.5, 16.8], 55],
  ['A R A B I A N   S E A', [62.5, 17.5], -74],
  ['B A Y   O F   B E N G A L', [92.5, 16.0], 70],
  ['I N D I A N   O C E A N', [78.5, 4.8], 0],
];

// Historical place priority hierarchy:
// 3: Imperial Metropolis / Primary Capital
// 2: Major Regional Center / World University / Port
// 1: Archaeological Site / Monument
const placeHierarchy = (place: HistoricalPlace): { level: 1 | 2 | 3; categoryLabel: string } => {
  if (place.type === 'capital') return { level: 3, categoryLabel: 'Imperial Capital' };
  if (place.type === 'port' || place.type === 'learning-center') return { level: 2, categoryLabel: place.type === 'port' ? 'Maritime Port' : 'University' };
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

  const features = geography.features as GeoFeature[];
  const countries = useMemo(
    () => features.filter((feature) => feature.properties.layer === 'country'),
    [features]
  );
  const rivers = useMemo(
    () => features.filter((feature) => feature.properties.layer === 'river'),
    [features]
  );
  const indiaCountry = useMemo(
    () => countries.find((c) => c.properties.name === 'India'),
    [countries]
  );

  // Zoom-dependent Level of Detail (LoD)
  const showRegionalDetail = scale >= 1.28;
  const showLocalDetail = scale >= 1.95;

  const setZoom = (factor: number) =>
    setScale((value) => Math.max(0.85, Math.min(3.8, value * factor)));

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
      x: Math.max(-550, Math.min(550, panStart.current.x + event.clientX - dragStart.current.x)),
      y: Math.max(-380, Math.min(380, panStart.current.y + event.clientY - dragStart.current.y)),
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
        background: 'linear-gradient(135deg, #c7d8de 0%, #d8e4e6 45%, #bfd2d8 100%)',
      }}
    >
      {/* Editorial Museum Border & Inset Frame */}
      <div className="pointer-events-none absolute inset-2.5 z-10 rounded-2xl border border-[#ede3d2]/60 shadow-[inset_0_0_0_10px_rgba(72,50,34,0.06)]" />

      <svg
        viewBox="0 0 1000 700"
        className="h-full w-full transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
          transformOrigin: '500px 350px',
        }}
      >
        <defs>
          {/* Subtle antique paper texture */}
          <filter id="paper-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="grain" />
            <feBlend in="SourceGraphic" in2="grain" mode="multiply" />
          </filter>

          {/* Soft blur for watercolor border ribbon fringe */}
          <filter id="watercolor-wash" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" mode="over" />
          </filter>

          {/* Subcontinent Landmask ClipPath: Automatically clips all historical polities to natural shoreline */}
          <clipPath id="subcontinent-land-clip">
            {countries.map((country) => (
              <path key={country.properties.name} d={geometryPath(country.geometry)} />
            ))}
          </clipPath>
        </defs>

        {/* 1. Sea & Ocean Basemap */}
        <rect width="1000" height="700" fill="#cddde2" opacity="0.65" />

        {/* Subtle Antique Bathymetry Coastal Waterlines */}
        <g fill="none" stroke="#abc5cd" strokeWidth="0.8" opacity="0.45" pointerEvents="none">
          {countries.map((country) => (
            <path key={country.properties.name} d={geometryPath(country.geometry)} strokeWidth="4" />
          ))}
          {countries.map((country) => (
            <path key={`ring2-${country.properties.name}`} d={geometryPath(country.geometry)} strokeWidth="8" opacity="0.5" />
          ))}
        </g>

        {/* 2. Subcontinent Natural Landmass (Antique Parchment Fill) */}
        <g filter="url(#paper-texture)">
          {countries.map((country) => (
            <path
              key={country.properties.name}
              d={geometryPath(country.geometry)}
              fill="#f5ece0"
              stroke="#9e8971"
              strokeWidth="0.95"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* 3. Subtle Modern Reference Borders (Understated, optional toggle) */}
        {showModernBorders && (
          <g fill="none" stroke="#8d7764" strokeWidth="1.0" strokeDasharray="3 3.5" opacity="0.75" pointerEvents="none">
            {countries.map((country) => (
              <path key={country.properties.name} d={geometryPath(country.geometry)} />
            ))}
          </g>
        )}

        {/* 4. HISTORICAL CARTOGRAPHIC TERRITORIES (CLIPPED TO LANDMASS) */}
        {/* Territories are visually subordinate to natural geography:
            - Clipped to shoreline: Never cuts across the sea
            - Inner boundary wash: Fringes the border rather than suffocating the interior
            - Translucent interior tint (6-10% opacity): Rivers and terrain shine through */}
        <g clipPath="url(#subcontinent-land-clip)">
          {regions.map((region) => {
            const isSelected = selectedRegion?.id === region.id;
            const isHovered = hoveredRegion?.id === region.id;
            const uncertain = region.certainty !== 'well-supported';

            // Get territorial path (modern republic uses exact Natural Earth geometry, others use curated historical rings)
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
                {/* A. Soft Inner Border Ribbon ("Grenzkolorit" Watercolor Fringe) */}
                <path
                  d={territoryPath}
                  fill="none"
                  stroke={region.colorTheme}
                  strokeWidth={isSelected ? 22 : isHovered ? 17 : 11}
                  strokeOpacity={isSelected ? 0.36 : isHovered ? 0.28 : 0.18}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter="url(#watercolor-wash)"
                />

                {/* B. Ultra-Subtle Interior Wash (Leaves underlying rivers & land 100% readable) */}
                <path
                  d={territoryPath}
                  fill={region.colorTheme}
                  fillOpacity={isSelected ? 0.14 : isHovered ? 0.10 : 0.06}
                  stroke="none"
                />

                {/* C. Refined Historical Frontier Line */}
                <path
                  d={territoryPath}
                  fill="none"
                  stroke={region.colorTheme}
                  strokeWidth={isSelected ? 2.2 : isHovered ? 1.7 : 1.15}
                  strokeOpacity={isSelected ? 0.95 : 0.82}
                  strokeDasharray={uncertain ? '6 4' : undefined}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>

        {/* 5. GEOGRAPHY LAYER: Great River Systems (Drawn ON TOP of territorial wash) */}
        {/* Crucial cartographic decision: Rivers flow OVER the territory tint, grounding borders in reality */}
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
                  stroke="#477389"
                  strokeWidth={isMajorArtery ? 2.1 : 1.45}
                  opacity="0.88"
                />
                {showRegionalDetail && (
                  <text
                    x={labelX}
                    y={labelY}
                    fill="#366276"
                    stroke="#f5ece0"
                    strokeWidth="2.5"
                    paintOrder="stroke"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fontSize="7.5"
                    letterSpacing="0.8"
                    opacity="0.9"
                  >
                    {river.properties.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* 6. Physical Topography Labels (Himalayas, Deccan, Oceans) */}
        <g fill="#614e3e" fontFamily="Georgia, serif" opacity="0.82" pointerEvents="none">
          {physicalLabels.map(([label, coordinate, rotation]) => {
            const isWater = label.includes('SEA') || label.includes('BAY') || label.includes('OCEAN');
            const [x, y] = project(coordinate);

            // Ocean names visible at all scales; regional mountain names visible at mid-zoom
            if (!isWater && !showRegionalDetail) return null;

            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor="middle"
                transform={rotation ? `rotate(${rotation} ${x} ${y})` : undefined}
                fill={isWater ? '#3b677a' : '#695544'}
                stroke={isWater ? '#cddde2' : '#f5ece0'}
                strokeWidth={isWater ? '2' : '2.5'}
                paintOrder="stroke"
                fontSize={isWater ? '9.5' : '8'}
                fontStyle={isWater ? 'italic' : 'normal'}
                fontWeight={isWater ? '600' : 'bold'}
                letterSpacing={isWater ? '3' : '2'}
              >
                {label}
              </text>
            );
          })}
        </g>

        {/* 7. Understated Modern Country Reference Labels */}
        <g fill="#7d6a59" fontFamily="Georgia, serif" fontWeight="600" fontSize="9" letterSpacing="1.8" opacity={showModernBorders ? 0.8 : 0.45} pointerEvents="none">
          {countryLabels.map(([label, coordinate]) => {
            const [x, y] = project(coordinate);
            return (
              <text key={label} x={x} y={y} textAnchor="middle" stroke="#f5ece0" strokeWidth="2.5" paintOrder="stroke">
                {label}
              </text>
            );
          })}
        </g>

        {/* 8. HISTORICAL CARTOGRAPHIC LABELS (Intelligently Letter-Spaced Across Heartlands) */}
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
                {/* Imperial Polity Title */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  fill="#332219"
                  stroke="#f7f0e6"
                  strokeWidth="3.2"
                  paintOrder="stroke"
                  fontFamily="'Geom', Georgia, serif"
                  fontWeight="bold"
                  fontSize={isSelected ? 14 : isHovered ? 13 : 11.5}
                  letterSpacing="2.8"
                  opacity={isSelected ? 1 : isHovered ? 0.95 : 0.84}
                  className="transition-all duration-200"
                >
                  {region.name.toUpperCase()}
                </text>

                {/* Cultural Heartland Subtitle & Period */}
                {(isSelected || isHovered || showRegionalDetail) && (
                  <text
                    x={x}
                    y={y + 13}
                    textAnchor="middle"
                    fill="#664938"
                    stroke="#f7f0e6"
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

        {/* 9. HISTORICAL CITIES & SITES HIERARCHY */}
        {/* Level 3: Imperial Metropolis (⊙) - Always visible
            Level 2: Major Regional Center / Port (•) - Visible at zoom >= 1.28
            Level 1: Historical Landmark / Monument - Visible at zoom >= 1.95 */}
        <g>
          {places.map((place) => {
            const { level, categoryLabel } = placeHierarchy(place);
            const isSelected = selectedPlace?.id === place.id;
            const isHovered = hoveredPlace?.id === place.id;

            // Visibility filter based on zoom Level of Detail
            const isVisible = level === 3 || (level === 2 && showRegionalDetail) || showLocalDetail || isSelected || isHovered;
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
                {/* Active Selection Glow Ring */}
                {isSelected && <circle r="12" fill="#d47b37" opacity="0.25" className="animate-ping" />}

                {/* Cartographic Symbol */}
                {level === 3 ? (
                  // Level 1: Imperial Metropolis Concentric Circled Dot (⊙)
                  <g>
                    <circle r={isSelected ? 6.5 : 5} fill="#f7f1e4" stroke="#7d302b" strokeWidth="1.6" />
                    <circle r="2.2" fill="#7d302b" />
                  </g>
                ) : level === 2 ? (
                  // Level 2: Regional Center / Port Solid Refined Marker (•)
                  <g>
                    <circle r={isSelected ? 5.5 : 3.8} fill="#f7f1e4" stroke="#38261e" strokeWidth="1.4" />
                    <circle r="1.8" fill="#d47b37" />
                  </g>
                ) : (
                  // Level 3: Archaeological Monument Subtle Dot
                  <circle r={isSelected ? 4.5 : 2.8} fill="#705545" stroke="#f7f1e4" strokeWidth="1" />
                )}

                {/* City & Site Typography */}
                {showTextLabel && (
                  <g>
                    <text
                      x={level === 3 ? '8' : '6'}
                      y={level === 3 ? '-5' : '-4'}
                      fill={level === 3 ? '#5c221e' : '#33231a'}
                      stroke="#f5ece0"
                      strokeWidth="2.8"
                      paintOrder="stroke"
                      fontFamily={level === 3 ? "'Geom', Georgia, serif" : "Arial, sans-serif"}
                      fontWeight={level === 3 ? 'bold' : '600'}
                      fontSize={level === 3 ? '9' : '7.5'}
                      letterSpacing={level === 3 ? '0.4' : '0.2'}
                    >
                      {place.historicalName}
                    </text>

                    {/* Subtitle badge showing modern equivalent on hover / selection */}
                    {(isSelected || isHovered) && (
                      <text
                        x="0"
                        y="15"
                        textAnchor="middle"
                        fill="#7d302b"
                        stroke="#f5ece0"
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

      {/* Floating Map Navigation Controls */}
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
          title={showModernBorders ? 'Hide modern borders' : 'Show modern borders'}
          className={`grid h-9 w-9 place-items-center rounded-full border shadow-md backdrop-blur-md transition active:scale-95 ${
            showModernBorders
              ? 'border-maroon bg-maroon text-white'
              : 'border-[#bba990] bg-[#f7f1e8]/92 text-ink hover:bg-[#eadfcd]'
          }`}
        >
          {showModernBorders ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      </div>

      {/* Top-Left Curatorial Horizon Indicator */}
      <div className="pointer-events-none absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-[#cdbca7] bg-[#f7f1e8]/90 px-3.5 py-2 text-[10px] font-bold tracking-widest text-ink shadow-sm backdrop-blur-sm">
        <Compass size={15} className="text-saffron" />
        <span className="font-display">HISTORICAL ATLAS</span>
        <span className="text-[#8d7563]">·</span>
        <span className="text-[#6d4f3b]">{activeYear < 0 ? `${Math.abs(activeYear)} BCE` : `${activeYear} CE`}</span>
      </div>

      {/* Bottom-Left Museum Cartographic Key */}
      <div className="pointer-events-none absolute bottom-6 left-5 z-20 hidden max-w-[320px] rounded-xl border border-[#cfbfa9] bg-[#f7f1e8]/92 px-3.5 py-2.5 text-[9px] leading-relaxed text-[#624d3b] shadow-md backdrop-blur-md md:block">
        <p className="font-bold uppercase tracking-[0.14em] text-[#3e2d22] border-b border-[#decbb7] pb-1">
          Historical Cartographic Key
        </p>
        <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1 w-3.5 bg-maroon/80" />
            <span>Well-supported frontier</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1 w-3.5 border-b border-dashed border-maroon" />
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
          Frontiers represent historical zones of authority and administrative influence, clipped naturally to physical geography.
        </p>
      </div>
    </div>
  );
}
