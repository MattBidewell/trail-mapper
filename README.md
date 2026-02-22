# Trail Mapper

A browser-based app for visualizing GPX trails on an interactive map. Upload one or more GPX files and your routes are rendered instantly — no backend, no account required.

## Features

- Drag-and-drop or browse to upload GPX files
- Multiple routes supported with a 10-color palette
- Hover tooltips showing route names
- Legend listing all loaded routes
- Auto-fits map to show all routes
- All parsing happens in the browser — nothing is uploaded to a server

## Requirements

- [Bun](https://bun.sh) (v1.0 or later)

## Local Development

```bash
# Clone the repo
git clone <repo-url>
cd trail-mapper

# Install dependencies
bun install

# Start the dev server
bun run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

> A local server is required (rather than opening `index.html` directly) because ES module imports are blocked by browsers over the `file://` protocol.

## Project Structure

```
trail-mapper/
├── index.html      # App entry point (HTML + CSS)
├── server.ts       # Local dev server (Bun static file server)
├── js/
│   ├── main.js     # Event wiring, file handling, UI state
│   ├── map.js      # Leaflet map init, route rendering, legend
│   └── gpx.js      # GPX parsing via browser DOMParser + togeojson
├── package.json
├── tsconfig.json
└── README.md
```

## Exporting GPX from Strava

1. Log in to [Strava](https://www.strava.com)
2. Open the activity you want to export
3. Click the **three dots (...)** on the left sidebar
4. Select **Export GPX**

### Bulk export

1. Go to [Strava Settings](https://www.strava.com/settings/profile)
2. Scroll to **"Download or Delete Your Account"**
3. Click **"Get Started"** under Download Request
4. Strava will email you an archive containing all activities as GPX files

## Dependencies

- **[@tmcw/togeojson](https://github.com/tmcw/togeojson)** — GPX to GeoJSON conversion (loaded via CDN)
- **[Leaflet](https://leafletjs.com)** — Interactive maps (loaded via CDN)

## License

MIT
