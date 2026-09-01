import { Era } from './types';

export type CertaintyLevel = 'well-supported' | 'approximate' | 'debated' | 'sphere-of-influence';

export interface HistoricalSource {
  title: string;
  authorOrCitation: string;
  type: 'archaeological' | 'epigraphic' | 'textual' | 'academic';
  note?: string;
}

export interface ModernGeography {
  primaryPresentCountry: string; // e.g. "India", "Pakistan"
  modernStatesOrProvinces: string[]; // e.g. ["Punjab", "Sindh", "Gujarat"]
  modernRelationshipNote: string; // e.g. "Broadly corresponds to parts of present-day northwestern India and eastern Pakistan."
  modernEquivalentName?: string; // For places: e.g. "Patna, Bihar, India"
}

export interface HistoricalConnection {
  targetId: string;
  targetType: 'region' | 'place' | 'event' | 'exhibit';
  label: string; // e.g. "Capital of", "Birthplace of", "Site of Ashoka Pillar"
}

export interface HistoricalRegion {
  id: string;
  name: string;
  nativeOrAlternateName?: string; // e.g. "Magadha", "Sindhu-Sarasvati"
  type: 'civilization' | 'empire' | 'kingdom' | 'republic';
  era: Era;
  startYear: number; // Signed integer (-2600 for 2600 BCE, 1632 for 1632 CE)
  endYear: number;
  displayPeriod: string; // e.g. "c. 2600 – 1900 BCE"
  capitalPlaceId?: string;
  colorTheme: string; // Harmonized with museum palette
  shortDescription: string;
  curatorNarrative: string;
  certainty: CertaintyLevel;
  certaintyNote: string; // e.g. "Core riverine settlements well-documented; peripheral trading outposts approximate."
  modernGeography: ModernGeography;
  // SVG vector geometry coordinates normalized to map projection viewport (0-1000 x 0-700)
  mapCoordinates: {
    center: [number, number]; // [x, y] on map canvas
    pathData: string; // SVG path data (d attribute) for territory boundary
    approximateRadius?: number; // Optional radial boundary for sphere-of-influence
  };
  sources: HistoricalSource[];
  connections: HistoricalConnection[];
  relatedExhibitIds: string[]; // Links to museum exhibits (e.g. ['great-bath-mohenjo-daro'])
}

export interface HistoricalPlace {
  id: string;
  historicalName: string;
  historicalRole: string; // e.g. "Fortified Citadel & Great Bath", "Imperial Capital"
  type: 'capital' | 'urban-center' | 'monument' | 'port' | 'learning-center';
  regionId: string; // Parent historical region / empire
  yearActive: number; // Primary peak year for timeline matching
  displayYear: string; // e.g. "c. 2500 BCE", "1632 CE"
  coordinates: {
    x: number; // SVG map coordinate X (0 - 1000)
    y: number; // SVG map coordinate Y (0 - 700)
    latitude: number;
    longitude: number;
  };
  modernGeography: ModernGeography;
  shortDescription: string;
  sources: HistoricalSource[];
  connections: HistoricalConnection[];
  relatedExhibitId?: string; // Direct link to exhibit (e.g. 'taj-mahal')
}

export interface HistoricalEvent {
  id: string;
  title: string;
  year: number; // Signed integer
  displayYear: string;
  regionId?: string;
  placeId?: string;
  coordinates?: { x: number; y: number };
  category: 'monument-foundation' | 'civilization-peak' | 'cultural-turning-point' | 'scientific-milestone';
  description: string;
  sources: HistoricalSource[];
  relatedExhibitId?: string;
}

export interface GlobalContemporaryEvent {
  id: string;
  region: 'Europe' | 'East Asia' | 'Middle East' | 'Americas' | 'Africa';
  civilizationOrState: string; // e.g. "Old Kingdom Egypt", "Ming Dynasty China"
  title: string;
  description: string;
}

export interface HistoricalPeriod {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  displayPeriod: string;
  era: Era;
  description: string;
  subcontinentHeadline: string;
  globalContemporaries: GlobalContemporaryEvent[];
}
