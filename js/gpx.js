import { gpx } from 'https://esm.sh/@tmcw/togeojson@5.8.1';

/**
 * Parse a GPX file string into a GeoJSON FeatureCollection.
 * Uses the browser's native DOMParser — no backend required.
 */
export function parseGpx(text) {
  const dom = new DOMParser().parseFromString(text, 'text/xml');
  return gpx(dom);
}
