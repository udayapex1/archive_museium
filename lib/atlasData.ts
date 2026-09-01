import periodsData from '@/data/atlas/periods.json';
import regionsData from '@/data/atlas/regions.json';
import placesData from '@/data/atlas/places.json';
import eventsData from '@/data/atlas/events.json';
import basemapData from '@/data/atlas/basemap.json';
import {
  HistoricalPeriod,
  HistoricalRegion,
  HistoricalPlace,
  HistoricalEvent
} from './atlasTypes';

export const periods: HistoricalPeriod[] = periodsData as HistoricalPeriod[];
export const regions: HistoricalRegion[] = regionsData as HistoricalRegion[];
export const places: HistoricalPlace[] = placesData as HistoricalPlace[];
export const events: HistoricalEvent[] = eventsData as HistoricalEvent[];
export const basemap = basemapData;

export function getAtlasPeriods(): HistoricalPeriod[] {
  return periods;
}

export function getAtlasRegions(): HistoricalRegion[] {
  return regions;
}

export function getAtlasPlaces(): HistoricalPlace[] {
  return places;
}

export function getAtlasEvents(): HistoricalEvent[] {
  return events;
}

export function getRegion(id: string): HistoricalRegion | undefined {
  return regions.find((r) => r.id === id);
}

export function getPlace(id: string): HistoricalPlace | undefined {
  return places.find((p) => p.id === id);
}

export function getPeriodForYear(year: number): HistoricalPeriod {
  // Find matching period or nearest one
  const exact = periods.find((p) => year >= p.startYear && year <= p.endYear);
  if (exact) return exact;

  // If outside ranges, pick closest period
  let closest = periods[0];
  let minDiff = Math.abs(year - periods[0].startYear);
  for (const p of periods) {
    const diff = Math.min(
      Math.abs(year - p.startYear),
      Math.abs(year - p.endYear)
    );
    if (diff < minDiff) {
      minDiff = diff;
      closest = p;
    }
  }
  return closest;
}

export function getRegionsActiveAtYear(year: number): HistoricalRegion[] {
  return regions.filter((r) => year >= r.startYear && year <= r.endYear);
}

export function getPlacesForRegion(regionId: string): HistoricalPlace[] {
  return places.filter((p) => p.regionId === regionId);
}

export function getPlacesActiveAroundYear(
  year: number,
  tolerance = 150
): HistoricalPlace[] {
  const activeRegions = getRegionsActiveAtYear(year).map((r) => r.id);
  return places.filter(
    (p) =>
      activeRegions.includes(p.regionId) ||
      Math.abs(p.yearActive - year) <= tolerance
  );
}

export function getEventsAroundYear(
  year: number,
  tolerance = 100
): HistoricalEvent[] {
  return events.filter((e) => Math.abs(e.year - year) <= tolerance);
}
