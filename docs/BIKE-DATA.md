# Bike data sources for PiMap

What is connected today, what you can connect next, and how each gives live bike data.
"Checked" means I could confirm it from public listings while building this; the build sandbox had no
access to most of these hosts, so test every endpoint from a normal machine before relying on it.

## Connected now (no keys, no backend)

| Need | Source | Endpoint | Notes |
| --- | --- | --- | --- |
| Cycle paths, lanes, parking, e-bike charging, repair stations | OpenStreetMap via Overpass | `POST https://overpass-api.de/api/interpreter` (mirrors: `overpass.kumi.systems`, `overpass.private.coffee`) | `bike.js`. Queried live in the visitor's browser, cached a week in IndexedDB, **Refresh data** button in Bike routes. Quality = what OSM mappers have drawn. |
| Bike routing | OSRM, FOSSGIS bike profile | `https://routing.openstreetmap.de/routed-bike/route/v1/driving/{lng,lat;lng,lat}` | Already used. Public demo server: fine for a prototype, not for production load. |
| Ride conditions | Open-Meteo | `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,precipitation,wind_speed_10m,wind_gusts_10m&wind_speed_unit=ms` | No key, CORS enabled, free for non-commercial use. Shown on the home card. |
| Address search | Nominatim | `https://nominatim.openstreetmap.org/search` | Already used. 1 request/second, identify your app. |

### Getting live bike routes on the map today

The map's cycle layer is already live: open the app, tap **Bike routes**. To add more route data without a backend:

* **Named long-distance routes (EuroVelo, national routes)** — add an Overpass query for relations:
  `relation["route"="bicycle"](59.33,24.50,59.53,25.02);out geom;` and draw them as a fourth line style.
* **Mountain-bike / recreational paths** — `way["highway"="path"]["mtb:scale"]` or `["bicycle"="yes"]`.
* **Surface and lighting** (for safer night routes) — `surface`, `lit`, `smoothness` tags on the same ways; add them to the `out geom tags` query and colour by quality.
* **Fresher than a week** — change `TTL` in `bike.js`, or call `LKP.BIKE.refresh()`. For high traffic, cache the Overpass result on your own server (a cron job writing `bikedata.json`, same shape the app already reads) so visitors don't hit public Overpass.

## Sources to connect next

| Need | Source | Status / how |
| --- | --- | --- |
| Official Tallinn cycle network, planned works | Tallinn GIS (ArcGIS REST) `https://gis.tallinn.ee/arcgis/rest/services` and the city open data portal (avaandmed.tallinn.ee) | Listed in public catalogues as open; I could not reach either host from the sandbox, so I could not confirm that a cycle-path layer exists. Ask the city's GIS team (Tallinn Geoportal page) for the layer name and licence. ArcGIS layers return GeoJSON with `.../query?where=1=1&f=geojson`. |
| Estonia-wide cycling routes, road works | Maa- ja Ruumiamet geoportal (WMS/WFS) and the national open data portal avaandmed.eesti.ee | Portal lists ~1,900 datasets and an API; a third-party listing says an API key is needed (unconfirmed). Search the catalogue for "jalgratta" / "rattatee". |
| Bike share availability | GBFS | **Checked: the MobilityData systems catalogue has no Estonian system.** So there is no public GBFS feed to plug in. Ask operators (Bolt, Tuul, bike-share providers) for a GBFS `gbfs.json`, or require it in their permits. GBFS needs no key by spec. |
| Operator ↔ city data | MDS (Mobility Data Specification) | Already simulated in `mds.js`. This is the municipality-side route: the city receives vehicle locations and trips and can republish a public GBFS from it. |
| Public transport next to bike trips | GTFS | Tallinn schedule feed is listed in the Mobility Database (feed mdb-3047, licence per peatus.ee terms). Needs a small server to parse. Realtime vehicle positions exist on the city open data portal; format unconfirmed. |
| Bike counters | Tallinn open data | One developer reports no open machine-readable counter feed in 2026-09 (unverified). Ask the city. |
| Better bike routing | BRouter (`brouter.de`), OpenRouteService (`cycling-regular`, `cycling-electric`, key needed), GraphHopper (`bike`, key needed), Valhalla (`bicycle` costing, self-hostable) | Swap `osrm()` in `app.js`. These can avoid cobbles, prefer lit paths and cap climbs, which OSRM's demo profile does not. |
| Street-level hazard photos | Mapillary API (key needed) | Optional: show photos along a route. |
| Resident-reported problems | PiMap Contribute | Already in the app; needs a small backend to share across devices (see README). |

## What still needs a backend

Everything above works from the browser except: shared resident reports across devices, caching
Overpass for traffic, parsing GTFS, and anything that needs a secret key (ORS, GraphHopper,
Mapillary, operator APIs). A tiny serverless function in front of those keeps keys out of the page.
