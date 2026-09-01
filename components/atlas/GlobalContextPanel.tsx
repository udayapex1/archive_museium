'use client';

import React, { useState } from 'react';
import { Globe, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { HistoricalPeriod } from '@/lib/atlasTypes';

interface GlobalContextPanelProps {
  period: HistoricalPeriod;
}

export function GlobalContextPanel({ period }: GlobalContextPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute left-4 top-20 z-20 max-w-sm">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-full border border-[#d9ccbd]/90 bg-[#f7f1e8]/95 px-4 py-2.5 text-xs font-bold text-ink shadow-md backdrop-blur-md transition hover:bg-white active:scale-95"
      >
        <Globe size={15} className="text-indigo" />
        <span>What else was happening?</span>
        <span className="rounded-full bg-[#eee4d6] px-2 py-0.5 text-[10px] text-maroon font-extrabold">
          {period.globalContemporaries.length}
        </span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Slide-down Curiosity Drawer */}
      {isOpen && (
        <div className="mt-2 max-h-[calc(100vh-200px)] w-80 overflow-y-auto rounded-2xl border border-[#d9ccbd] bg-[#f7f1e8]/98 p-4 text-ink shadow-xl backdrop-blur-xl transition-all md:w-96">
          <div className="flex items-center justify-between border-b border-[#e5d9ca] pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#806d60]">
              <Sparkles size={14} className="text-saffron" />
              <span>SYNCHRONOUS WORLD ({period.displayPeriod})</span>
            </div>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-[#6b584d]">
            While {period.subcontinentHeadline.toLowerCase()}
          </p>

          <div className="mt-4 space-y-3">
            {period.globalContemporaries.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border border-[#e5d9ca] bg-white/90 p-3 shadow-xs transition hover:border-[#bfa995]"
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#91674f]">
                  <span>{event.region}</span>
                  <span className="rounded-full bg-[#f4ece1] px-2 py-0.5 text-ink">
                    {event.civilizationOrState}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm font-bold text-ink">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#635144]">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
