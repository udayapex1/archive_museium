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
    <div className="relative h-[calc(100vh-68px)] min-h-[640px] w-full overflow-hidden bg-[#efe7db] pt-16">
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
  );
}
