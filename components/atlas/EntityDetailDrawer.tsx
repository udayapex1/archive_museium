'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ArrowUpRight, BookOpen, ShieldCheck, HelpCircle, Compass, Box } from 'lucide-react';
import { HistoricalRegion, HistoricalPlace } from '@/lib/atlasTypes';
import { exhibits, getExhibit } from '@/lib/getExhibits';

interface EntityDetailDrawerProps {
  region: HistoricalRegion | null;
  place: HistoricalPlace | null;
  onClose: () => void;
}

export function EntityDetailDrawer({ region, place, onClose }: EntityDetailDrawerProps) {
  const [showSources, setShowSources] = useState(false);

  if (!region && !place) return null;

  // Find linked exhibits if any
  const linkedExhibitIds = place?.relatedExhibitId
    ? [place.relatedExhibitId]
    : region?.relatedExhibitIds || [];
  const linkedExhibits = linkedExhibitIds.map((id) => getExhibit(id)).filter(Boolean);

  return (
    <aside
      aria-label="Historical entity inspector"
      className="absolute right-4 top-20 z-30 max-h-[calc(100vh-140px)] w-full max-w-md overflow-y-auto rounded-2xl border border-[#d9ccbd] bg-[#f7f1e8]/98 p-6 text-ink shadow-2xl backdrop-blur-xl transition-all"
    >
      {/* Top Bar with Category & Close */}
      <div className="flex items-center justify-between border-b border-[#e5d9ca] pb-3">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-maroon" />
          <span className="eyebrow">
            {place ? 'Historical Landmark' : region?.type ? `${region.type.toUpperCase()} EXTENT` : 'HISTORICAL REGION'}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close details"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#806d60] transition hover:bg-black/10 hover:text-ink active:scale-95"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Placard Content */}
      <div className="mt-4">
        {/* Title & Era Badge */}
        <p className="text-xs font-bold uppercase tracking-wider text-[#a16a4d]">
          {place ? place.displayYear : region?.displayPeriod}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-ink md:text-3xl">
          {place ? place.historicalName : region?.name}
        </h2>
        {(place?.historicalRole || region?.nativeOrAlternateName) && (
          <p className="mt-1 text-xs font-medium italic text-[#705c50]">
            {place ? place.historicalRole : region?.nativeOrAlternateName}
          </p>
        )}

        {/* Historiographical Certainty Indicator (for regions) */}
        {region && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#e2d5c6] bg-[#eee4d6]/60 p-3 text-xs">
            {region.certainty === 'well-supported' ? (
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-moss" />
            ) : (
              <HelpCircle size={16} className="mt-0.5 shrink-0 text-saffron" />
            )}
            <div>
              <span className="font-bold text-ink">
                {region.certainty === 'well-supported' ? 'Well-supported reconstruction' : 'Approximate historical extent'}
              </span>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#6c5a4f]">
                {region.certaintyNote}
              </p>
            </div>
          </div>
        )}

        {/* Narrative or Description */}
        <div className="mt-4 space-y-2 text-sm leading-6 text-[#5a483d]">
          <p>{place ? place.shortDescription : region?.curatorNarrative}</p>
        </div>

        {/* THEN ↔ NOW Comparative Geography Card */}
        <div className="mt-5 rounded-xl border border-[#dfd1c1] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[#eee3d5] pb-2 text-xs font-bold uppercase tracking-wider text-[#91674f]">
            <span>Then ↔ Now</span>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div>
              <span className="font-bold text-ink">Modern Sovereign Geography:</span>
              <p className="mt-0.5 leading-relaxed text-[#6b574a]">
                {place
                  ? place.modernGeography.modernRelationshipNote
                  : region?.modernGeography.modernRelationshipNote}
              </p>
            </div>
            {place?.modernGeography.modernEquivalentName && (
              <div className="pt-1">
                <span className="font-bold text-ink">Present-day Equivalent:</span>
                <p className="mt-0.5 font-medium text-maroon">
                  {place.modernGeography.modernEquivalentName}
                </p>
              </div>
            )}
            {region?.modernGeography.modernStatesOrProvinces && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {region.modernGeography.modernStatesOrProvinces.map((prov) => (
                  <span
                    key={prov}
                    className="rounded-full bg-[#f2ebd9] px-2.5 py-0.5 text-[10px] font-semibold text-[#665245]"
                  >
                    {prov}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Connected Museum Exhibits */}
        {linkedExhibits.length > 0 && (
          <div className="mt-5 border-t border-[#e5d9ca] pt-4">
            <p className="eyebrow text-[10px]">Explore in the Archive Museum</p>
            <div className="mt-2 space-y-2">
              {linkedExhibits.map((exhibit) => (
                <Link
                  key={exhibit!.id}
                  href={`/exhibits/${exhibit!.id}`}
                  className="group flex items-center justify-between rounded-xl border border-[#e5d9ca] bg-white p-3 shadow-sm transition hover:border-maroon hover:shadow-md"
                >
                  <div className="flex items-center gap-2.5">
                    {exhibit!.has3D && (
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-white">
                        <Box size={14} />
                      </span>
                    )}
                    <div>
                      <h3 className="text-xs font-bold text-ink group-hover:text-maroon">
                        {exhibit!.title}
                      </h3>
                      <p className="text-[10px] text-[#806d60]">
                        {exhibit!.has3D ? 'Interactive 3D exhibit' : 'Curated exhibit record'}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-maroon transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Historiographical Sources Accordion */}
        {((place?.sources && place.sources.length > 0) || (region?.sources && region.sources.length > 0)) && (
          <div className="mt-5 border-t border-[#e5d9ca] pt-3">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex w-full items-center justify-between py-1 text-xs font-bold text-[#806d60] transition hover:text-ink"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />
                <span>Historical Sources & Provenance ({place?.sources.length || region?.sources.length})</span>
              </span>
              <span className="text-[10px]">{showSources ? 'Hide' : 'View'}</span>
            </button>

            {showSources && (
              <div className="mt-2 space-y-2 rounded-xl bg-[#eee4d6]/60 p-3 text-[11px]">
                {(place?.sources || region?.sources || []).map((src, idx) => (
                  <div key={idx} className="border-b border-[#e2d5c6] pb-2 last:border-b-0 last:pb-0">
                    <p className="font-bold text-ink">{src.title}</p>
                    <p className="text-[10px] text-[#6b584d]">{src.authorOrCitation}</p>
                    {src.note && <p className="mt-0.5 text-[10px] italic text-[#806e62]">{src.note}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
