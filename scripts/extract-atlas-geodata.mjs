/*
 * Creates the compact, local atlas basemap from Natural Earth 1:10m GeoJSON.
 * Source data is public domain: https://www.naturalearthdata.com/about/terms-of-use/
 *
 * Usage:
 * node scripts/extract-atlas-geodata.mjs <countries.geojson> <rivers.geojson>
 */
import { readFile, writeFile } from 'node:fs/promises';

const [countriesFile, riversFile] = process.argv.slice(2);
if (!countriesFile || !riversFile) {
  throw new Error('Usage: node scripts/extract-atlas-geodata.mjs <countries.geojson> <rivers.geojson>');
}

const countries = JSON.parse(await readFile(countriesFile, 'utf8'));
const rivers = JSON.parse(await readFile(riversFile, 'utf8'));
const countryNames = new Set(['Afghanistan', 'Pakistan', 'India', 'Nepal', 'Bhutan', 'Bangladesh', 'Sri Lanka', 'Myanmar', 'China']);
const riverNames = new Set(['Indus', 'Ganges', 'Yamuna', 'Brahmaputra', 'Narmada', 'Krishna', 'Cauvery']);

const round = (value) => Math.round(value * 10000) / 10000;
const reduceLine = (line, stride = 2) => line.filter((_, index) => index === 0 || index === line.length - 1 || index % stride === 0).map(([x, y]) => [round(x), round(y)]);
const reduceGeometry = (geometry) => {
  if (geometry.type === 'Polygon') return { ...geometry, coordinates: geometry.coordinates.map((ring) => reduceLine(ring)) };
  if (geometry.type === 'MultiPolygon') return { ...geometry, coordinates: geometry.coordinates.map((polygon) => polygon.map((ring) => reduceLine(ring))) };
  if (geometry.type === 'LineString') return { ...geometry, coordinates: reduceLine(geometry.coordinates, 1) };
  if (geometry.type === 'MultiLineString') return { ...geometry, coordinates: geometry.coordinates.map((line) => reduceLine(line, 1)) };
  return geometry;
};

const output = {
  type: 'FeatureCollection',
  metadata: {
    source: 'Natural Earth 1:10m Admin 0 Countries and Rivers + Lake Centerlines',
    license: 'Public domain',
    projection: 'WGS 84 geographic coordinates (EPSG:4326)',
    sourceUrl: 'https://www.naturalearthdata.com/'
  },
  features: [
    ...countries.features.filter((feature) => countryNames.has(feature.properties.ADMIN)).map((feature) => ({
      type: 'Feature', properties: { layer: 'country', name: feature.properties.ADMIN, iso: feature.properties.ISO_A3 }, geometry: reduceGeometry(feature.geometry)
    })),
    ...rivers.features.filter((feature) => riverNames.has(feature.properties.name_en)).map((feature) => ({
      type: 'Feature', properties: { layer: 'river', name: feature.properties.name_en }, geometry: reduceGeometry(feature.geometry)
    }))
  ]
};

await writeFile(new URL('../data/atlas/south-asia-geography.json', import.meta.url), JSON.stringify(output));
