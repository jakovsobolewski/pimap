# PiMap — The Last-Kilometre Protocol

Live at **https://pimap.app** · prototype, not an official City of Tallinn service.

City Resilience Hack 2026 · City of Tallinn × Pinge Electronics OÜ

The interface follows the tallinn.ee visual identity (Tallinn blue #0072CE, pale blue #CCE3F5, white surfaces, pill controls) and carries the Tallinn logo. The logo is a hand-drawn SVG approximation in `tallinn-logo.svg`; swap in the official asset before any public use.

**Map · Unlock · Lend.** Estonia has shelters, sirens and EE-ALARM, but no plan for the last
kilometre. This prototype turns every shared and private light vehicle in the city into a public
asset the moment a crisis is declared, and matches people who cannot ride with neighbours and
services. Mobility-impaired first.

## Two portals, one shared state

**Citizen portal** (`#citizen`) works like Google Maps: a full-screen map with a search bar, a
directions button and category chips (Shelters first, then hospitals, pharmacies, cool places,
drinking water, groceries, police, rescue stations and construction). Picking a chip lists the
nearest places; picking a place opens a card; Directions opens Walk / Bike / Drive / Pick-up.
Search covers shelters, places and construction sites locally and falls back to Nominatim address
search inside Tallinn. The menu holds mobility settings and the Pirent "Lend a vehicle" form.

**Municipality portal** (`#gov`) has subtabs in a second header row: Construction works, Overview,
Crisis operations, Fleet unlock, Pick-up dispatch, Neighbour listings and MDS log.

State is shared through `localStorage` and synced live between browser tabs.

## Contribute

The **Contribute** button (top right) lets residents pin an **issue** (road damage, broken street
light, accessibility barrier, litter, broken bench or playground) or an **idea** (trees and green
space, benches and shade, cycling, safer crossings, play and sport) on the map. Neighbours can
support and comment; the municipality sees everything under **Citizen contributions**, sets a
status (Seen, Planned, In progress, Done, Not planned) and replies publicly. During a storm alert
the same panel lets residents report fallen trees, fallen branches and trees at risk; routes avoid
them until the city marks them cleared.

## Everyday use

Without an alert, the directions button asks "Where to?" with the nearest pharmacy, grocery store,
hospital, shelter, water point and cool place; an "Around you" card shows nearby construction,
community issues and ideas, and your nearest shelter; routes steer around active construction and
blocked paths. The city edits construction sites (location, dates, +7 days, finished) and residents
see "Active now" and "Starting soon" with the last update time.

## Emergency protocols (Crisis operations)

| Protocol | Citizens are sent to | How the route is chosen |
| --- | --- | --- |
| War / air strike | Nearest public shelter | Fastest route; fleets unlock, neighbours lend, pick-ups for people who cannot walk |
| Flood | Nearest shelter outside flooded areas | The city marks flooded areas; the route is re-planned through detour waypoints until it avoids them, or the resident is told to go up and request a pick-up |
| Heatwave | Nearest cool indoor place (library, shopping centre) | Candidate routes are scored for shade from real building footprints and street trees (OpenStreetMap), using the sun's actual position; the shadiest route within ~45% extra length wins. Drinking water points on the route are highlighted, and residents can plan for 12:00–18:00 |
| Storm | Nearest shelter or indoor public place outside unsafe places | The city marks unsafe places; routes also minimise time under trees, by the shoreline and next to construction |

Routing uses the FOSSGIS OSRM servers (`routing.openstreetmap.de`), which have real foot, bike and car
profiles. Shade and exposure data come from the Overpass API per route.

## Languages

PiMap is available in English, Estonian, Finnish, Spanish and Ukrainian. The switch sits next to the
Tallinn logo and remembers the choice. `i18n.js` translates interface text as it is rendered (text,
placeholders, labels, popups, messages) from a phrase dictionary plus patterns for sentences with
numbers, times and distances, and formats dates and times for the chosen language. Place names,
addresses and what residents type are never translated.

## Contribute and construction

* **Contribute** (header button): residents pin an issue or an idea on the map; neighbours support and
  comment; the municipality sets a status and replies. During any alert residents can also send
  emergency reports (fallen trees, flooded streets, blocked ways, other dangers) that routes avoid at once.
  The Municipality portal lists everything under **Citizen contributions**, with an Emergency filter.
* **Construction works are street sections.** The city clicks where works start and end; the line is
  snapped to the street network. Routes only count as passing through works when they run along the
  section, not when they cross the street, and everyday routes detour around active sections.

> Prototype limitation: there is no server. Contributions, reports and works are stored in the
> browser (`localStorage`) and only travel between tabs of the same browser. A real deployment needs a
> small backend so residents and the city see each other's posts across devices.

## Run it

From this folder:

```bash
python3 -m http.server 8734
```

then open <http://localhost:8734/#citizen> and <http://localhost:8734/#gov>. Deployed with GitHub Pages (see `CNAME`). Any static host works; there is no backend.

## How the three layers behave

1. **Map from the state.** Declaring an alert simulates the EE-ALARM push. The resident's phone shows
   the nearest shelter (step-free shelters only for wheelchair users), distance, minutes at their own
   pace, and the four buttons. Shelters, the app shell, map tiles and any fetched routes are cached by
   a service worker, so the phone keeps working without signal.
2. **Unlock the operators.** The Rescue Board publishes an *Emergency Unlock Mandate* as an MDS Policy
   (`rate` rule with `rate_amount: 0` inside shelter geofences, time-boxed by `start_date`/`end_date`,
   plus rules that trips end at shelters and accessible vehicles are held for priority riders). Bolt,
   Tuul and Pinge "poll" the policy, apply it to the vehicles inside the geofences and acknowledge. The
   whole exchange is simulated in the browser and logged. Ending the alert revokes the policy.
3. **Lend from the citizens.** Neighbours pre-list spare vehicles as dormant Pirent listings. Nobody sees
   them until an alert is declared; then they become active, appear in Borrow, and the borrower gets the
   unlock instructions. Residents with a car can offer spare seats, which feeds Request a ride.

Ride requests are matched by priority (wheelchair, mobility aid, slow walkers, children, then everyone
else) to the nearest available neighbour or Pinge crew with enough seats and, when needed, an accessible
vehicle.

## What is mocked

* Shelters are the real Tallinn public shelters from the Päästeamet register (Maa- ja Ruumiamet geoportal, layer VARJEKOHT), 52 sites, data as of 23.09.2026. The register has no capacity or step-free access fields, so the app does not show them.
* Hospitals, pharmacies, police, rescue stations, groceries, drinking water, libraries and shopping centres are real OpenStreetMap data, fetched 25 Sep 2026 into `pois.js`.
* Flood and storm hazard zones shipped with the demo are illustrative examples, not official flood-risk or damage data.
* Fleet positions, neighbour listings, drivers and construction works are seed data, not live feeds.
* MDS calls never leave the browser; the log shows the requests a real integration would make.
* Routes come from the public OSRM demo server when online and fall back to straight-line estimates
  offline. Previously fetched routes are cached.
* "Devices reached" is an estimate from district population, not a real push count.
* All state lives in `localStorage`. **Reset demo** in the top bar reseeds everything.
