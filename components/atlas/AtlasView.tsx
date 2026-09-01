'use client';

import React, { useState, useMemo } from 'react';
import { HistoricalRegion, HistoricalPlace } from '@/lib/atlasTypes';
import {
  periods,
  getPeriodForYear,
  getRegionsActiveAtYear,
  getPlacesActiveAroundYear,
} from '@/lib/atlasData';
import { HistoricalMap } from './HistoricalMap';
import { TimeSlider } from './TimeSlider';
import { EntityDetailDrawer } from './EntityDetailDrawer';
import { GlobalContextPanel } from './GlobalContextPanel';

export function AtlasView() {
  // Primary temporal state (default to Ashokan Mauryan Empire at 250 BCE)
  const [currentYear, setCurrentYear] = useState<number>(-250);
  const [selectedRegion, setSelectedRegion] = useState<HistoricalRegion | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<HistoricalPlace | null>(null);
  const [showModernBorders, setShowModernBorders] = useState<boolean>(false);

  // Compute active period based on current year
  const activePeriod = useMemo(() => getPeriodForYear(currentYear), [currentYear]);

  // Compute active regions visible in current year
  const activeRegions = useMemo(
    () => getRegionsActiveAtYear(currentYear),
    [currentYear]
  );

  // Compute active places visible in current year
  const activePlaces = useMemo(
    () => getPlacesActiveAroundYear(currentYear),
    [currentYear]
  );

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    // Reset individual place selection if it belongs to a vastly different epoch
    if (selectedPlace && Math.abs(selectedPlace.yearActive - year) > 400) {
      setSelectedPlace(null);
    }
  };

  const handleSelectRegion = (region: HistoricalRegion | null) => {
    setSelectedRegion(region);
    if (region) {
      setSelectedPlace(null); // Mutually exclusive focus for clarity
    }
  };

  const handleSelectPlace = (place: HistoricalPlace | null) => {
    setSelectedPlace(place);
    if (place) {
      setSelectedRegion(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f1e8] grain text-[#2f211b] pt-24 pb-14">
      {/* Museum Exhibition Header - matching the original Archive Museum theme */}
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#d8c6b2] pb-5">
          <div>
            <p className="eyebrow">Interactive Cartography · Gallery 04</p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight text-[#2f211b]">
              The Historical Atlas
            </h1>
            <p className="mt-2 max-w-2xl text-sm md:text-base leading-relaxed text-[#786455]">
              Explore five thousand years of the Indian subcontinent through authentic spatial geography, civilizational horizons, and synchronous global contemporaries.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-bold tracking-wider uppercase text-[#8b5e48]">
            <span className="rounded-full border border-[#d5c3b0] bg-[#efe5d7] px-3.5 py-1.5 shadow-sm">
              2500 BCE – Present
            </span>
            <span className="rounded-full border border-[#d5c3b0] bg-[#efe5d7] px-3.5 py-1.5 shadow-sm">
              Natural Earth 1:10m
            </span>
          </div>
        </div>
      </div>

      {/* Framed Map Plate - elegant margins on both sides */}
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="relative h-[680px] md:h-[720px] lg:h-[760px] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(47,33,27,0.16)] border border-[#cbbca7] bg-[#7c9aa8]">
          {/* 1. Interactive Vector Map Layer */}
          <HistoricalMap
            activeYear={currentYear}
            regions={activeRegions}
            places={activePlaces}
            selectedRegion={selectedRegion}
            selectedPlace={selectedPlace}
            onSelectRegion={handleSelectRegion}
            onSelectPlace={handleSelectPlace}
            showModernBorders={showModernBorders}
            onToggleModernBorders={() => setShowModernBorders(!showModernBorders)}
          />

          {/* 2. Global Contemporaries Curiosity Drawer */}
          <GlobalContextPanel period={activePeriod} />

          {/* 3. Entity & Place Inspector Placard */}
          <EntityDetailDrawer
            region={selectedRegion}
            place={selectedPlace}
            onClose={() => {
              setSelectedRegion(null);
              setSelectedPlace(null);
            }}
          />

          {/* 4. Bottom Floating Curatorial Time Dock */}
          <div className="pointer-events-none absolute bottom-5 left-4 right-4 z-20 flex justify-center">
            <div className="pointer-events-auto w-full max-w-4xl">
              <TimeSlider
                periods={periods}
                currentYear={currentYear}
                onYearChange={handleYearChange}
                activePeriod={activePeriod}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
