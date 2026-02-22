// Leaflet (L) is loaded as a global via the CDN <script> tag in index.html

const ROUTE_COLORS = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4',
  '#42d4f4', '#f032e6', '#e6b800', '#469990', '#9a6324',
];

const routes = [];
let colorIndex = 0;
let legendControl = null;

export const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ' +
    '&copy; <a href="https://carto.com/attributions">CARTO</a>',
}).addTo(map);

function updateLegend() {
  if (legendControl) legendControl.remove();
  if (routes.length === 0) return;

  legendControl = L.control({ position: 'bottomright' });
  legendControl.onAdd = () => {
    const div = L.DomUtil.create('div', 'legend');
    let html = '<h4>Routes</h4>';
    routes.forEach(({ name, color }) => {
      html += `
        <div class="legend-item">
          <div class="legend-color" style="background-color:${color}"></div>
          <span class="legend-name" title="${name}">${name}</span>
        </div>`;
    });
    div.innerHTML = html;
    return div;
  };
  legendControl.addTo(map);
}

function fitAll() {
  const allLayers = routes.flatMap(r => r.layers);
  if (allLayers.length === 0) return;
  map.fitBounds(L.featureGroup(allLayers).getBounds(), { padding: [50, 50] });
}

/**
 * Add a parsed GeoJSON route to the map.
 * Returns the total number of routes loaded so far.
 */
export function addRoute(name, geojson) {
  const color = ROUTE_COLORS[colorIndex % ROUTE_COLORS.length];
  colorIndex++;
  const layers = [];

  geojson.features.forEach(feature => {
    let coordArrays = [];
    if (feature.geometry.type === 'LineString') {
      coordArrays = [feature.geometry.coordinates];
    } else if (feature.geometry.type === 'MultiLineString') {
      coordArrays = feature.geometry.coordinates;
    }

    coordArrays.forEach(coords => {
      const latLngs = coords.map(([lng, lat]) => [lat, lng]);
      const polyline = L.polyline(latLngs, { color, weight: 3, opacity: 0.8 }).addTo(map);

      polyline.bindTooltip(name, { sticky: true, direction: 'top', offset: [0, -10] });
      polyline.on('mouseover', function () { this.setStyle({ weight: 5, opacity: 1 }); this.bringToFront(); });
      polyline.on('mouseout', function () { this.setStyle({ weight: 3, opacity: 0.8 }); });

      layers.push(polyline);
    });
  });

  routes.push({ name, color, layers });
  updateLegend();
  fitAll();

  return routes.length;
}
