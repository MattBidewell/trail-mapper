import { parseGpx } from './gpx.js';
import { addRoute } from './map.js';

const zone = document.getElementById('upload-zone');
const input = document.getElementById('file-input');
const routeCountEl = document.getElementById('route-count');
const errorEl = document.getElementById('error-msg');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.style.display = 'block';
  setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
}

function updateRouteCount(count) {
  routeCountEl.style.display = count === 0 ? 'none' : '';
  routeCountEl.textContent = `${count} route${count === 1 ? '' : 's'} loaded`;
}

async function handleFiles(files) {
  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      showError(`"${file.name}" is not a GPX file — skipped.`);
      continue;
    }
    try {
      const text = await file.text();
      const geojson = parseGpx(text);
      if (!geojson.features || geojson.features.length === 0) {
        showError(`No route data found in "${file.name}".`);
        continue;
      }
      const count = addRoute(file.name.replace(/\.gpx$/i, ''), geojson);
      updateRouteCount(count);
    } catch (e) {
      showError(`Failed to parse "${file.name}": ${e.message}`);
    }
  }
}

document.getElementById('browse-btn').addEventListener('click', e => { e.stopPropagation(); input.click(); });
zone.addEventListener('click', () => input.click());
input.addEventListener('change', () => handleFiles(input.files));
zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
zone.addEventListener('drop', e => {
  e.preventDefault();
  zone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});
