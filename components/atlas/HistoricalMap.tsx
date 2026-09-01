'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Compass, MapPin, Eye, EyeOff } from 'lucide-react';
import { HistoricalRegion, HistoricalPlace, HistoricalEvent } from '@/lib/atlasTypes';
import { basemap } from '@/lib/atlasData';

interface HistoricalMapProps {
  activeYear: number;
  regions: HistoricalRegion[];
  places: HistoricalPlace[];
  events?: HistoricalEvent[];
  selectedRegion: HistoricalRegion | null;
  selectedPlace: HistoricalPlace | null;
  onSelectRegion: (region: HistoricalRegion | null) => void;
  onSelectPlace: (place: HistoricalPlace | null) => void;
  showModernBorders: boolean;
  onToggleModernBorders: () => void;
}

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

  // Transform state: scale and pan offsets
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const [hoveredPlace, setHoveredPlace] = useState<HistoricalPlace | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<HistoricalRegion | null>(null);

  // Pan interaction handlers (mouse & pointer)
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, .interactive-pin, .interactive-region')) {
      return;
    }
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Wheel zoom handler
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.75), 4.5));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const zoomIn = () => setScale((s) => Math.min(s * 1.25, 4.5));
  const zoomOut = () => setScale((s) => Math.max(s * 0.8, 0.75));
  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative h-full w-full overflow-hidden select-none bg-[#e8e0d3] touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        backgroundImage: 'radial-gradient(rgba(47, 33, 27, 0.05) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* Antique Map Border Trim */}
      <div className="pointer-events-none absolute inset-2.5 z-10 rounded-2xl border border-[#c4b5a2]/60 shadow-inner" />

      {/* Main SVG Vector Canvas */}
      <svg
        viewBox={basemap.viewBox}
        className="h-full w-full transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${scale})`,
          transformOrigin: '500px 350px',
        }}
      >
        <defs>
          {/* Subtle parchment grain filter */}
          <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.95   0 0 0 0 0.92   0 0 0 0 0.87  0 0 0 0.15 0" />
            <feBlend mode="multiply" in="SourceGraphic" in2="noise" />
          </filter>

          {/* Region Glow Filters */}
          <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" mode="over" />
          </filter>
        </defs>

        {/* Ocean Background & Water Bodies */}
        <rect x="0" y="0" width="1000" height="700" fill="#dfd8cb" opacity="0.6" />

        {/* Continental Landmass */}
        <g id="landmass" filter="url(#paper-texture)">
          <path
            d={basemap.landmass.subcontinent}
            fill="#f7f2e9"
            stroke="#cfc1af"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d={basemap.landmass.sriLanka}
            fill="#f7f2e9"
            stroke="#cfc1af"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* River Systems */}
        <g id="rivers" opacity="0.85">
          {basemap.waterBodies.map((river, idx) => (
            <g key={idx}>
              <path
                d={river.path}
                fill="none"
                stroke="#6c8e9b"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {river.branches?.map((branch, bIdx) => (
                <path
                  key={bIdx}
                  d={branch}
                  fill="none"
                  stroke="#7c9da9"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              ))}
            </g>
          ))}
        </g>

        {/* Mountain Terrain Ribbons */}
        <g id="terrain" opacity="0.45">
          {basemap.terrainFeatures.map((feature, idx) => (
            <path
              key={idx}
              d={feature.path}
              fill="none"
              stroke="#8a7968"
              strokeWidth="5"
              strokeDasharray="3 4"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Modern Reference Borders Overlay (Optional Toggle) */}
        {showModernBorders && (
          <g id="modern-borders" opacity="0.6" className="transition-opacity duration-300">
            {basemap.modernReferenceContours.map((border) => (
              <path
                key={border.id}
                d={border.path}
                fill="none"
                stroke="#9c8774"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            ))}
          </g>
        )}

        {/* Historical Regions & Empires (Active in Selected Year) */}
        <g id="historical-regions">
          {regions.map((region) => {
            const isSelected = selectedRegion?.id === region.id;
            const isHovered = hoveredRegion?.id === region.id;
            const isApprox = region.certainty === 'approximate' || region.certainty === 'debated';

            return (
              <g
                key={region.id}
                className="interactive-region cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRegion(isSelected ? null : region);
                }}
                onMouseEnter={() => setHoveredRegion(region)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Territory Polygon Fill */}
                <path
                  d={region.mapCoordinates.pathData}
                  fill={region.colorTheme}
                  fillOpacity={isSelected ? 0.38 : isHovered ? 0.32 : 0.22}
                  stroke={region.colorTheme}
                  strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.8}
                  strokeDasharray={isApprox ? '8 5' : undefined}
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />

                {/* Region Centroid Title Label */}
                <text
                  x={region.mapCoordinates.center[0]}
                  y={region.mapCoordinates.center[1]}
                  textAnchor="middle"
                  className="pointer-events-none font-display text-[15px] font-bold tracking-wider"
                  fill="#2f211b"
                  stroke="#f7f2e9"
                  strokeWidth="3.5"
                  paintOrder="stroke"
                  opacity={isSelected || isHovered ? 1 : 0.88}
                >
                  {region.name.toUpperCase()}
                </text>
                <text
                  x={region.mapCoordinates.center[0]}
                  y={region.mapCoordinates.center[1] + 16}
                  textAnchor="middle"
                  className="pointer-events-none font-sans text-[10px] font-semibold uppercase tracking-[0.2em]"
                  fill="#7a4f38"
                  stroke="#f7f2e9"
                  strokeWidth="2.5"
                  paintOrder="stroke"
                >
                  {region.displayPeriod}
                </text>
              </g>
            );
          })}
        </g>

        {/* Historical Places & Landmark Pins */}
        <g id="historical-places">
          {places.map((place) => {
            const isSelected = selectedPlace?.id === place.id;
            const isHovered = hoveredPlace?.id === place.id;

            return (
              <g
                key={place.id}
                className="interactive-pin cursor-pointer transition-transform duration-200"
                transform={`translate(${place.coordinates.x}, ${place.coordinates.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlace(isSelected ? null : place);
                }}
                onMouseEnter={() => setHoveredPlace(place)}
                onMouseLeave={() => setHoveredPlace(null)}
              >
                {/* Pulsing indicator if selected */}
                {isSelected && (
                  <circle
                    r="14"
                    fill="#d47b37"
                    opacity="0.3"
                    className="animate-ping"
                  />
                )}

                {/* Pin Outer Ring */}
                <circle
                  r={isSelected ? '7' : isHovered ? '6' : '4.5'}
                  fill="#f7f2e9"
                  stroke={isSelected ? '#7d302b' : '#2f211b'}
                  strokeWidth={isSelected ? '2.5' : '1.8'}
                  className="transition-all duration-200"
                />

                {/* Pin Center Core */}
                <circle
                  r={isSelected ? '3.5' : '2.2'}
                  fill={isSelected ? '#7d302b' : '#d47b37'}
                />

                {/* Pin Text Label */}
                <text
                  x="0"
                  y={isSelected ? '-12' : '-9'}
                  textAnchor="middle"
                  className={`font-sans text-[11px] font-bold tracking-tight transition-all duration-200 ${
                    isSelected ? 'fill-maroon font-extrabold' : 'fill-ink'
                  }`}
                  stroke="#f7f2e9"
                  strokeWidth="3.5"
                  paintOrder="stroke"
                >
                  {place.historicalName}
                </text>

                {/* Modern Place Subtitle when Hovered or Selected */}
                {(isSelected || isHovered) && (
                  <text
                    x="0"
                    y="18"
                    textAnchor="middle"
                    className="font-sans text-[9px] font-semibold text-[#806d60]"
                    fill="#806d60"
                    stroke="#f7f2e9"
                    strokeWidth="2.5"
                    paintOrder="stroke"
                  >
                    Now: {place.modernGeography.modernEquivalentName || place.modernGeography.primaryPresentCountry}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Map Navigation & Curatorial Controls */}
      <div className="absolute right-6 top-6 z-20 flex flex-col items-center gap-2">
        <div className="flex flex-col overflow-hidden rounded-full border border-[#d9ccbd] bg-[#f7f1e8]/90 p-1 shadow-lg backdrop-blur-md">
          <button
            onClick={zoomIn}
            aria-label="Zoom in"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-black/10 active:scale-95"
          >
            <ZoomIn size={17} />
          </button>
          <div className="h-px w-full bg-[#d9ccbd]" />
          <button
            onClick={zoomOut}
            aria-label="Zoom out"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition hover:bg-black/10 active:scale-95"
          >
            <ZoomOut size={17} />
          </button>
        </div>

        <button
          onClick={resetView}
          aria-label="Reset view"
          title="Reset map perspective"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9ccbd] bg-[#f7f1e8]/90 text-ink shadow-md backdrop-blur-md transition hover:bg-black/10 active:scale-95"
        >
          <RotateCcw size={15} />
        </button>

        {/* Modern Borders Toggle Button */}
        <button
          onClick={onToggleModernBorders}
          aria-label="Toggle modern reference borders"
          title={showModernBorders ? 'Hide modern borders' : 'Show modern borders'}
          className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition active:scale-95 ${
            showModernBorders
              ? 'border-maroon bg-maroon text-white'
              : 'border-[#d9ccbd] bg-[#f7f1e8]/90 text-ink hover:bg-black/10'
          }`}
        >
          {showModernBorders ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      </div>

      {/* Curatorial Map Compass & Orientation Badge */}
      <div className="pointer-events-none absolute left-6 top-6 z-20 flex items-center gap-2.5 rounded-full border border-[#d9ccbd]/80 bg-[#f7f1e8]/85 px-4 py-2 text-xs font-bold tracking-wider text-ink shadow-sm backdrop-blur-sm">
        <Compass size={16} className="text-saffron" />
        <span className="font-display">HISTORICAL ATLAS</span>
        <span className="text-[#a89785]">·</span>
        <span className="text-[11px] font-semibold text-[#7d5f4c]">
          {activeYear < 0 ? `${Math.abs(activeYear)} BCE` : `${activeYear} CE`}
        </span>
      </div>

      {/* Minimalist Legend & Historiographical Disclaimer */}
      <div className="pointer-events-auto absolute bottom-6 left-6 z-20 hidden max-w-sm flex-col gap-2 rounded-xl border border-[#d9ccbd]/80 bg-[#f7f1e8]/90 p-3 text-[11px] text-[#6b584d] shadow-md backdrop-blur-md md:flex">
        <div className="flex items-center justify-between border-b border-[#e2d5c6] pb-1.5 font-bold uppercase tracking-wider text-ink">
          <span>Cartographic Key</span>
          <span className="text-[9px] font-normal text-[#9c8774]">Scale: ~1:10M</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-0.5 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-maroon" />
            <span>Well-supported extent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-b border-dashed border-maroon" />
            <span>Approximate boundary</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full border border-ink bg-saffron" />
            <span>Landmark place</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 border-b border-dotted border-[#9c8774]" />
            <span>Modern reference</span>
          </div>
        </div>
        <p className="border-t border-[#e2d5c6] pt-1.5 text-[9px] italic leading-tight text-[#8c7a6e]">
          Historical boundaries are approximate reconstructions based on archaeological and epigraphic evidence.
        </p>
      </div>
    </div>
  );
}
