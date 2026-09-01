'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { HistoricalPeriod } from '@/lib/atlasTypes';

interface TimeSliderProps {
  periods: HistoricalPeriod[];
  currentYear: number;
  onYearChange: (year: number) => void;
  activePeriod: HistoricalPeriod;
}

const MILESTONES = [
  { year: -2500, label: '2500 BCE', name: 'Indus' },
  { year: -250, label: '250 BCE', name: 'Maurya' },
  { year: 450, label: '450 CE', name: 'Gupta' },
  { year: 1632, label: '1632 CE', name: 'Mughal' },
  { year: 1900, label: '1900 CE', name: 'British Era' },
  { year: 2023, label: '2023 CE', name: 'Modern Republic' },
];

export function TimeSlider({
  periods,
  currentYear,
  onYearChange,
  activePeriod,
}: TimeSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play time progression
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      // Advance through milestone steps
      const currentIdx = MILESTONES.findIndex((m) => m.year >= currentYear);
      const nextIdx = currentIdx === -1 || currentIdx >= MILESTONES.length - 1 ? 0 : currentIdx + 1;
      onYearChange(MILESTONES[nextIdx].year);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, currentYear, onYearChange]);

  const stepBackward = () => {
    const currentIdx = MILESTONES.slice().reverse().findIndex((m) => m.year < currentYear);
    if (currentIdx !== -1) {
      const target = MILESTONES[MILESTONES.length - 1 - currentIdx];
      onYearChange(target.year);
    } else {
      onYearChange(MILESTONES[0].year);
    }
  };

  const stepForward = () => {
    const next = MILESTONES.find((m) => m.year > currentYear);
    if (next) {
      onYearChange(next.year);
    } else {
      onYearChange(MILESTONES[0].year);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-[#d9ccbd]/90 bg-[#f7f1e8]/95 p-4 shadow-museum backdrop-blur-md transition-all md:p-5">
      {/* Active Epoch Headline */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#e5d9ca] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">Temporal Horizon</span>
            <span className="text-xs text-[#a39082]">·</span>
            <span className="text-xs font-bold text-maroon">{activePeriod.displayPeriod}</span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
            {activePeriod.name}
          </h2>
        </div>

        {/* Playback and Step Controls */}
        <div className="flex items-center gap-1.5 rounded-full border border-[#d9ccbd] bg-[#eee4d6]/60 p-1">
          <button
            onClick={stepBackward}
            aria-label="Previous historical epoch"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition hover:bg-black/10 active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause time travel' : 'Auto travel through time'}
            className="flex h-8 items-center gap-1.5 rounded-full bg-maroon px-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#923933] active:scale-95"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} className="fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Tour'}</span>
          </button>
          <button
            onClick={stepForward}
            aria-label="Next historical epoch"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition hover:bg-black/10 active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Interactive Milestone Buttons */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {MILESTONES.map((milestone) => {
          const isSelected = activePeriod.startYear <= milestone.year && activePeriod.endYear >= milestone.year;

          return (
            <button
              key={milestone.year}
              onClick={() => onYearChange(milestone.year)}
              className={`focus-ring group flex flex-col items-center justify-center rounded-xl p-2 text-center transition-all ${
                isSelected
                  ? 'border border-maroon bg-white shadow-sm ring-1 ring-maroon/20'
                  : 'border border-[#e2d5c6] bg-[#efe6d9]/50 hover:border-[#bfa995] hover:bg-white/80'
              }`}
            >
              <span className={`text-[11px] font-bold ${isSelected ? 'text-maroon' : 'text-[#856f61]'}`}>
                {milestone.label}
              </span>
              <span className={`font-display text-xs font-bold tracking-tight ${isSelected ? 'text-ink' : 'text-[#5c4a3e]'}`}>
                {milestone.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
