/* ============================================================
   The Last-Kilometre Protocol — City of Tallinn prototype
     Citizen portal      → Google-Maps-style map: search, category chips,
                           place cards and Walk / Bike / Drive / Pick-up
                           directions that follow the active emergency protocol
     Municipality portal → subtabs: construction works, overview, crisis
                           operations (protocol choice + hazard zones),
                           fleet unlock (MDS), pick-up dispatch, listings, log
   Shared state lives in localStorage and syncs between browser tabs.
   ============================================================ */
(function () {
  'use strict';
  const { SHELTERS, OPERATORS, MDS, VEHICLE_LABELS, DISTRICTS, WORK_TYPES, PROTOCOLS } = LKP;
  const POIS = LKP.POIS || [];
  const LS_KEY = 'lkp-shared-v5', UI_KEY = 'lkp-ui-v5', ROUTE_KEY = 'lkp-routes-v2';

  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const LOC = () => (window.LKP_LOCALE ? window.LKP_LOCALE() : 'en-GB');
  const timeStr = ts => new Date(ts).toLocaleTimeString(LOC(), { hour: '2-digit', minute: '2-digit', hour12: false });
  const uid = p => p + '-' + Math.random().toString(36).slice(2, 8);
  const todayISO = plusDays => new Date(Date.now() + (plusDays || 0) * 86400e3).toISOString().slice(0, 10);
  const fmtDate = iso => { const d = new Date(iso + 'T00:00:00'); return isNaN(d) ? iso : d.toLocaleDateString(LOC(), { day: 'numeric', month: 'short' }); };
  function workStatus(w) { const t = todayISO(0); if (w.end < t) return 'finished'; if (w.start > t) return 'upcoming'; return 'active'; }

  const POP = { 'All of Tallinn': 461000, 'Kesklinn': 65000, 'Põhja-Tallinn': 61000, 'Kristiine': 33000, 'Lasnamäe': 118000, 'Mustamäe': 66000, 'Nõmme': 40000, 'Haabersti': 47000, 'Pirita': 20000 };
  const NEEDS = {
    wheelchair:   { label: 'Wheelchair user',                          p: 100, accessible: true },
    mobility_aid: { label: 'Uses a mobility aid or cannot stand long',  p: 90,  accessible: true },
    slow:         { label: 'Walks slowly (elderly, injured, pregnant)', p: 70,  accessible: false },
    children:     { label: 'Small children or a pram',                 p: 50,  accessible: false },
    none:         { label: 'No special need',                          p: 10,  accessible: false },
  };
  const MOBILITY = { walks: 'I can walk', limited: 'I walk slowly or have limited mobility', wheelchair: 'I use a wheelchair or mobility aid' };
  const SPEED = { walks: 80, limited: 45, wheelchair: 55 };
  const RIDE_SPEED = { scooter: 300, bicycle: 250, ebike: 300, cargo: 220, etricycle: 200, mobility_aid: 100, wheelchair: 60, rollator: 50, car: 400, van: 400 };
  const LEND_TYPES = ['bicycle', 'ebike', 'cargo', 'scooter', 'etricycle', 'wheelchair', 'rollator'];
  const MODES = ['walk', 'bike', 'drive', 'pickup'];
  const MODE_LABEL = { walk: 'Walk', bike: 'Bike', drive: 'Drive', pickup: 'Pick-up' };
  const MODE_PROFILE = { walk: 'foot', bike: 'bike', drive: 'driving', pickup: 'driving' };
  /* Storm reports from citizens and city crews. radius = how far routes keep away. */
  const REPORT_TYPES = {
    fallen_tree: { label: 'Fallen tree', hint: 'Blocking a street or path', radius: 25, color: '#6D4C41', svg: '<path d="M3 20h18"/><path d="M4 17l10-6"/><path d="M14 11l2-5 4 4-6 1z"/><path d="M8 15l-1-3M11 13l1-3"/>' },
    branches: { label: 'Fallen branches', hint: 'Branches or debris on the ground', radius: 15, color: '#A1887F', svg: '<path d="M3 20l10-7"/><path d="M8 16.5l-1-4M12 14l3-5M13 13l5 1M17 9l2-2"/>' },
    tree: { label: 'Tree at risk', hint: 'Leaning, cracked or large tree that could fall', radius: 20, color: '#2E7D32', svg: '<path d="M12 22v-5"/><path d="M12 3l6 8h-3l4 6H5l4-6H6z"/>' },
    flooded: { label: 'Flooded street', hint: 'Water on the street or in an underpass', radius: 40, color: '#1565C0', svg: '<path d="M2 15c2 0 2-1.5 4-1.5S8 15 10 15s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 19c2 0 2-1.5 4-1.5S8 19 10 19s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M12 3v7M9 7l3 3 3-3"/>' },
    blocked: { label: 'Blocked way', hint: 'Debris, a fallen pole or a closed passage', radius: 20, color: '#455A64', svg: '<rect x="3" y="9" width="18" height="5" rx="1"/><path d="M7 9l-3 5M13 9l-3 5M19 9l-3 5M6 14v5M18 14v5"/>' },
    danger: { label: 'Other danger', hint: 'Loose roofing, broken glass, a downed power line', radius: 30, color: '#B71C1C', svg: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>' },
  };
  /* Which emergency report types residents can send, per protocol */
  const EMERGENCY_TYPES = { storm: ['fallen_tree', 'branches', 'tree', 'blocked', 'danger'], flood: ['flooded', 'blocked', 'danger', 'fallen_tree'], airstrike: ['blocked', 'danger', 'flooded'], heat: ['blocked', 'danger'] };
  const emergencyTypes = () => EMERGENCY_TYPES[(S.emergency && S.emergency.type) || 'storm'];
  /* Citizen contributions: issues and ideas for the city and for each other */
  const CONTRIB = {
    issue: { label: 'Issue', color: '#E8590C', svg: '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
      cats: { road: 'Road or pavement damage', light: 'Broken street light', access: 'Accessibility barrier', litter: 'Litter or dumping', furniture: 'Broken bench or playground', other: 'Other issue' } },
    idea: { label: 'Idea', color: '#D4A000', svg: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
      cats: { green: 'More trees or green space', bench: 'Benches or shade', bike: 'Cycling improvement', crossing: 'Safer crossing', play: 'Play or sport', other: 'Other idea' } },
  };
  const CSTATUS = { new: 'New', seen: 'Seen by the city', planned: 'Planned', progress: 'In progress', done: 'Done', declined: 'Not planned' };
  const DIRS = [[0, 'N'], [45, 'NE'], [90, 'E'], [135, 'SE'], [180, 'S'], [225, 'SW'], [270, 'W'], [315, 'NW']];
  const dirName = deg => (DIRS.find(d => d[0] === Number(deg)) || [0, 'N'])[1];
  const localDT = ms => new Date(ms - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const ago = ts => { const m = Math.round((Date.now() - ts) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; };
  const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400e3);

  /* Category chips (Google-Maps style). Shelters first. */
  const CATS = [
    { id: 'shelter',  label: 'Shelters',        color: '#0072CE', svg: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M12 8l4 7H8z"/>' },
    { id: 'reports',  label: 'Fallen trees',    color: '#6D4C41', svg: REPORT_TYPES.fallen_tree.svg },
    { id: 'hospital', label: 'Hospitals',       color: '#D2232A', svg: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>' },
    { id: 'pharmacy', label: 'Pharmacies',      color: '#1E8E3E', svg: '<path d="M10.5 20.5l10-10a4.95 4.95 0 10-7-7l-10 10a4.95 4.95 0 107 7z"/><path d="M8.5 8.5l7 7"/>' },
    { id: 'cool',     label: 'Cool places',     color: '#0A93B8', svg: '<path d="M12 2v20M4.9 6l14.2 12M4.9 18L19.1 6"/><path d="M9 3l3 2 3-2M9 21l3-2 3 2"/>' },
    { id: 'water',    label: 'Drinking water',  color: '#1A73E8', svg: '<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/>' },
    { id: 'grocery',  label: 'Groceries',       color: '#7A4FD6', svg: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11l2-8H6.5"/>' },
    { id: 'police',   label: 'Police',          color: '#23408E', svg: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>' },
    { id: 'rescue',   label: 'Rescue stations', color: '#E4572E', svg: '<path d="M12 3c2 3 5 5 5 9a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-6 1-8z"/>' },
    { id: 'community', label: 'Community',     color: '#7B3FA0', svg: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c.8-3.5 3.2-5 6-5s5.2 1.5 6 5M15 15.5c2.5 0 4.5 1.3 5.5 4.5"/>' },
    { id: 'works',    label: 'Construction',    color: '#F28C00', svg: '<path d="M3 20h18M6 20l4-14h4l4 14M8 13h8"/>' },
  ];
  const ADDRESS_CAT = { id: 'address', label: 'Address', color: '#5F6368', svg: '<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>' };
  const catById = id => CATS.find(c => c.id === id) || (id === 'contrib-issue' ? { id, label: 'Issue', color: CONTRIB.issue.color, svg: CONTRIB.issue.svg } : id === 'contrib-idea' ? { id, label: 'Idea', color: CONTRIB.idea.color, svg: CONTRIB.idea.svg } : ADDRESS_CAT);
  const svgOf = c => `<svg viewBox="0 0 24 24" aria-hidden="true">${c.svg}</svg>`;

  const IC = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    dir: '<svg viewBox="0 0 24 24" aria-hidden="true" class="dir-ic"><rect x="4.2" y="4.2" width="15.6" height="15.6" rx="2.4" transform="rotate(45 12 12)"/><path d="M9 14v-2.5a1.5 1.5 0 011.5-1.5H15M13 8l2 2-2 2"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
    bike: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="17" r="3.5"/><circle cx="18" cy="17" r="3.5"/><path d="M6 17l4-8h5l3 8M10 9l4 8M14 5h3"/></svg>',
    gps: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    pin: ADDRESS_CAT.svg.replace(/^/, '<svg viewBox="0 0 24 24" aria-hidden="true">') + '</svg>',
    walk: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="4" r="2"/><path d="M12 9l-3 4-3 1M12 9l3 2 2 3M9 13l1 3-2 6M10 16l3 3v3"/></svg>',
    drive: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13l2-5h14l2 5v5H3z"/><path d="M3 13h18M7 8V6M17 8V6"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>',
    pickup: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11V6a1.5 1.5 0 013 0v5M10 10V4a1.5 1.5 0 013 0v6M13 10V5a1.5 1.5 0 013 0v7M16 12V8a1.5 1.5 0 013 0v7c0 4-3 6-7 6s-6-2-8-5l-1.5-3a1.5 1.5 0 012.5-1.5L7 14"/></svg>',
  };
  const MODE_IC = { walk: IC.walk, bike: IC.bike, drive: IC.drive, pickup: IC.pickup };
  const PROTO_IC = {
    airstrike: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M12 8l4 7H8z"/></svg>',
    flood: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 16c2 0 2-1.5 4-1.5S8 16 10 16s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 20c2 0 2-1.5 4-1.5S8 20 10 20s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M5 11l7-7 7 7M8 11v3M16 11v3"/></svg>',
    heat: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    storm: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 16a5 5 0 01.5-10A6 6 0 0119 8a4 4 0 01-1 8"/><path d="M13 12l-3 5h4l-3 5"/></svg>',
  };

  const GOV_TABS = [
    ['works', 'Construction works'], ['contrib', 'Citizen contributions'], ['overview', 'Overview'], ['crisis', 'Crisis operations'],
    ['fleet', 'Fleet unlock'], ['dispatch', 'Pick-up dispatch'], ['listings', 'Neighbour listings'], ['log', 'MDS log'],
  ];

  /* ---------------- shared state (synced across tabs) ---------------- */
  function freshShared() {
    return {
      emergency: null,
      user: { lat: 59.4450, lng: 24.7350, mobility: 'walks' },
      fleet: LKP.seedFleet(), listings: LKP.seedListings(), volunteers: LKP.seedVolunteers(), works: LKP.seedWorks(), hazards: LKP.seedHazards(), reports: LKP.seedReports(), storms: [], contribs: LKP.seedContribs(),
      requests: [], mdsLog: [], acks: {},
      radius: 1000, autoUnlock: true, mandate: 'none',
      unlock: null, myRequestId: null, myVolunteerId: null,
    };
  }
  function freshUI() {
    return {
      portal: 'citizen', govTab: 'works',
      cview: 'map', cat: null, dest: null, query: '', searchResults: [], searchPlace: null, mode: 'walk',
      form: { protocol: 'airstrike', district: 'All of Tallinn', hours: 4, message: '' },
      lendDraft: { type: 'bicycle', label: '', accessible: false, unlock: '', contact: '', lat: null, lng: null },
      rideDraft: { need: 'none', people: 1, note: '' },
      seatDraft: { vehicle: 'car', seats: 3, accessible: false },
      callDraft: { name: '', need: 'slow', people: 1, lat: null, lng: null },
      workDraft: { editingId: null, name: '', type: 'roadworks', note: '', start: todayISO(0), end: todayISO(14), walk: true, bike: true, drive: true, lat: null, lng: null, pts: [], coords: [] },
      stormDraft: { name: '', wind: 20, gust: 30, from: 225, radiusKm: 8, start: localDT(Date.now()), hours: 12, lat: null, lng: null },
      reportDraft: { type: 'fallen_tree', note: '', lat: null, lng: null },
      contribDraft: { kind: 'issue', cat: 'road', title: '', note: '', lat: null, lng: null },
      commentDraft: '', replyDrafts: {}, contribFilter: 'all',
      worksAll: false,
      hazardDraft: { name: '', radius: 150, lat: null, lng: null },
      conflicts: [], routeInfo: null, sunHour: null,
    };
  }
  function loadShared() { try { const r = localStorage.getItem(LS_KEY); if (r) return Object.assign(freshShared(), JSON.parse(r)); } catch (e) { /* ignore */ } return freshShared(); }
  function loadUI() { try { const r = sessionStorage.getItem(UI_KEY); if (r) return Object.assign(freshUI(), JSON.parse(r)); } catch (e) { /* ignore */ } return freshUI(); }
  let S = loadShared(), U = loadUI();
  let writing = false;
  function save() { try { writing = true; localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } finally { setTimeout(() => { writing = false; }, 0); } }
  function saveUI() { try { sessionStorage.setItem(UI_KEY, JSON.stringify(U)); } catch (e) { /* ignore */ } }
  const hashPortal = (location.hash || '').replace('#', '');
  if (hashPortal === 'gov' || hashPortal === 'citizen') U.portal = hashPortal;

  /* ---------------- geometry ---------------- */
  const toRad = d => d * Math.PI / 180;
  function dist(a, b) {
    const R = 6371000, dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function bearing(a, b) {
    const y = Math.sin(toRad(b.lng - a.lng)) * Math.cos(toRad(b.lat));
    const x = Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) - Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lng - a.lng));
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }
  function offset(p, meters, bearingDeg) {
    const b = toRad(bearingDeg);
    return { lat: p.lat + (meters * Math.cos(b)) / 111320, lng: p.lng + (meters * Math.sin(b)) / (111320 * Math.cos(toRad(p.lat))) };
  }
  const ll = c => ({ lat: c[0], lng: c[1] });
  function densify(coords, step) {
    const out = [];
    for (let i = 1; i < coords.length; i++) {
      const a = coords[i - 1], b = coords[i], n = Math.max(1, Math.ceil(dist(ll(a), ll(b)) / step));
      for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    if (coords.length) out.push(coords[coords.length - 1]);
    return out;
  }
  /* Distance from a point to a polyline (metres, local flat projection) */
  function segDist(p, a, b) {
    const kx = 111320 * Math.cos(toRad(p.lat)), ky = 110540;
    const ax = (a[1] - p.lng) * kx, ay = (a[0] - p.lat) * ky, bx = (b[1] - p.lng) * kx, by = (b[0] - p.lat) * ky;
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    const t = L2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L2)) : 0, x = ax + t * dx, y = ay + t * dy;
    return Math.sqrt(x * x + y * y);
  }
  function lineDist(p, coords) { if (coords.length < 2) return dist(p, ll(coords[0])); let m = Infinity; for (let i = 1; i < coords.length; i++) m = Math.min(m, segDist(p, coords[i - 1], coords[i])); return m; }
  function lineLen(coords) { let s = 0; for (let i = 1; i < coords.length; i++) s += dist(ll(coords[i - 1]), ll(coords[i])); return s; }
  function lineMid(coords) {
    const half = lineLen(coords) / 2; let s = 0;
    for (let i = 1; i < coords.length; i++) { const d = dist(ll(coords[i - 1]), ll(coords[i])); if (s + d >= half) { const f = d ? (half - s) / d : 0; return { lat: coords[i - 1][0] + (coords[i][0] - coords[i - 1][0]) * f, lng: coords[i - 1][1] + (coords[i][1] - coords[i - 1][1]) * f }; } s += d; }
    return ll(coords[0]);
  }
  /* Construction works are street sections (polylines); older circle-shaped ones still work. */
  function workZone(w) {
    if (w.coords && w.coords.length > 1) { const mid = lineMid(w.coords); return { coords: w.coords, buffer: w.buffer || 12, mid, half: lineLen(w.coords) / 2, lat: mid.lat, lng: mid.lng }; }
    return { lat: w.lat, lng: w.lng, radius: w.radius || 60 };
  }
  const zoneDist = (p, z) => z.coords ? lineDist(p, z.coords) : dist(p, z);
  const zoneR = z => z.coords ? z.buffer : z.radius;
  /* A route "uses" a street section only if it runs along it for ~30 m; crossing the street is fine. */
  function crosses(coords, zone, pad = 10) {
    const pts = densify(coords, 10);
    if (!zone.coords) return pts.some(c => dist(ll(c), zone) <= zone.radius + pad);
    const lim = (zone.buffer || 12) + pad, mid = zone.mid || lineMid(zone.coords), reach = (zone.half || lineLen(zone.coords) / 2) + lim + 30;
    let run = 0;
    for (const c of pts) { const p = ll(c); if (dist(p, mid) > reach) { run = 0; continue; } if (lineDist(p, zone.coords) <= lim) { if (++run >= 3) return true; } else run = 0; }
    return false;
  }
  const fmtDist = m => m < 1000 ? Math.round(m / 10) * 10 + ' m' : (m / 1000).toFixed(1) + ' km';
  const walkMin = m => Math.max(1, Math.round(m * 1.25 / SPEED[S.user.mobility]));
  const rideMin = (m, type) => Math.max(1, Math.round(m * 1.25 / (RIDE_SPEED[type] || 250)));
  const needsAccessible = () => S.user.mobility === 'wheelchair';
  const inGeofence = p => SHELTERS.some(s => dist(p, s) <= S.radius);
  const proto = () => (S.emergency ? S.emergency.type || 'airstrike' : null);
  const P = () => PROTOCOLS[proto() || 'airstrike'];

  /* Sun position (NOAA-style approximation): azimuth clockwise from north, elevation in degrees */
  function sunPos(date, lat, lng) {
    const rad = Math.PI / 180, d = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
    const g = (357.529 + 0.98560028 * d) * rad, q = 280.459 + 0.98564736 * d;
    const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad, e = (23.439 - 0.00000036 * d) * rad;
    const RA = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L)), dec = Math.asin(Math.sin(e) * Math.sin(L));
    const GMST = ((18.697374558 + 24.06570982441908 * d) % 24 + 24) % 24;
    const H = (GMST * 15 + lng) * rad - RA, phi = lat * rad;
    const el = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
    const az = Math.atan2(-Math.sin(H), Math.tan(dec) * Math.cos(phi) - Math.sin(phi) * Math.cos(H));
    return { el: el / rad, az: (az / rad + 360) % 360 };
  }
  const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const compass = az => COMPASS[Math.round(az / 45) % 8];

  /* ---------------- places & destinations ---------------- */
  function placeOf(kind, id) {
    if (kind === 'shelter') { const s = SHELTERS.find(x => x.id === id); return s && { kind, id, cat: 'shelter', name: s.name, address: `${s.address}, ${s.district}`, lat: s.lat, lng: s.lng }; }
    if (kind === 'poi') { const p = POIS.find(x => x.id === id); return p && { kind, id, cat: p.cat, sub: p.sub, name: p.name, address: p.address, lat: p.lat, lng: p.lng, hours: p.hours, wheelchair: p.wheelchair }; }
    if (kind === 'work') { const w = S.works.find(x => x.id === id); return w && { kind, id, cat: 'works', name: w.name, address: `${WORK_TYPES[w.type] || w.type} · ${fmtDate(w.start)} – ${fmtDate(w.end)}`, lat: w.lat, lng: w.lng, work: w }; }
    if (kind === 'contrib') { const c = S.contribs.find(x => x.id === id); return c && { kind, id, cat: 'contrib-' + c.kind, name: c.title, address: CONTRIB[c.kind].cats[c.cat] || CONTRIB[c.kind].label, lat: c.lat, lng: c.lng, contrib: c }; }
    if (kind === 'report') { const r = S.reports.find(x => x.id === id), T = r && REPORT_TYPES[r.type]; return r && { kind, id, cat: 'reports', name: T.label, address: r.note || T.hint, lat: r.lat, lng: r.lng, report: r }; }
    if (kind === 'search') { const r = (U.searchResults || []).concat(U.searchPlace ? [U.searchPlace] : []).find(x => x.id === id); return r || null; }
    return null;
  }
  const insideHazard = (p, kind, pad = 50) => S.hazards.some(h => h.kind === kind && dist(p, h) <= h.radius + pad);
  function destCandidates() {
    const t = proto();
    const shelters = SHELTERS.map(s => placeOf('shelter', s.id));
    const cool = POIS.filter(p => p.cat === 'cool').map(p => placeOf('poi', p.id));
    if (t === 'heat') return cool;
    if (t === 'flood') return shelters.filter(p => !insideHazard(p, 'flood'));
    if (t === 'storm') return shelters.concat(cool).filter(p => !insideHazard(p, 'unsafe'));
    return shelters;
  }
  /* Reports: visible to everyone while not cleared. Seeded example reports only show during a storm alert. */
  function reportsShown() {
    const t = U.portal === 'gov' ? (proto() || U.form.protocol) : proto();
    return S.reports.filter(r => r.status !== 'cleared' && (t === 'storm' || !r.example));
  }
  function stormStatus(s) { const n = Date.now(); return s.endMs < n ? 'passed' : s.startMs > n ? 'upcoming' : 'active'; }
  function stormsShown() {
    const t = U.portal === 'gov' ? (proto() || (U.govTab === 'crisis' ? U.form.protocol : null)) : proto();
    return t === 'storm' ? S.storms.filter(s => stormStatus(s) !== 'passed') : [];
  }
  function stormGustAt(p) { return S.storms.filter(s => stormStatus(s) !== 'passed' && dist(p, s) <= s.radiusKm * 1000).reduce((m, s) => Math.max(m, Number(s.gust) || 0), 0); }
  /* Zones a route should go around, by situation:
     no alert → active construction affecting this mode + blocking fallen trees;
     flood → flooded areas; storm → unsafe places + all storm reports. */
  function avoidZones(modeKey) {
    const t = proto(), z = [];
    if (t === 'flood') S.hazards.filter(h => h.kind === 'flood').forEach(h => z.push(h));
    if (t === 'storm') S.hazards.filter(h => h.kind === 'unsafe').forEach(h => z.push(h));
    S.reports.filter(r => r.status !== 'cleared' && (t === 'storm' || !r.example) && (r.type !== 'tree' || t === 'storm')).forEach(r => { const T = REPORT_TYPES[r.type]; z.push({ id: r.id, name: T.label + (r.note ? ` (${r.note})` : ''), lat: r.lat, lng: r.lng, radius: T.radius }); });
    if (!t) S.works.filter(w => workStatus(w) === 'active' && w.affects[modeKey]).forEach(w => z.push(Object.assign({ id: w.id, name: w.name, work: true }, workZone(w))));
    return z;
  }
  function nearestDest() { return destCandidates().map(p => ({ p, d: dist(S.user, p) })).sort((a, b) => a.d - b.d)[0].p; }
  function target() {
    const p = (U.dest && placeOf(U.dest.kind, U.dest.id)) || nearestDest();
    return { s: p, d: dist(S.user, p) };
  }
  function nearby(cat, n) {
    let items;
    if (cat === 'shelter') items = SHELTERS.map(s => placeOf('shelter', s.id));
    else if (cat === 'works') items = S.works.filter(w => workStatus(w) !== 'finished').map(w => placeOf('work', w.id));
    else if (cat === 'reports') items = reportsShown().map(r => placeOf('report', r.id));
    else if (cat === 'community') items = S.contribs.filter(c => c.status !== 'declined').map(c => placeOf('contrib', c.id));
    else items = POIS.filter(p => p.cat === cat).map(p => placeOf('poi', p.id));
    return items.map(p => ({ p, d: dist(S.user, p) })).sort((a, b) => a.d - b.d).slice(0, n || 15);
  }
  function pickupEstimate() {
    const c = S.volunteers.filter(v => v.available && (!needsAccessible() || v.accessible)).map(v => ({ v, d: dist(v, S.user) })).sort((a, b) => a.d - b.d)[0];
    return c ? rideMin(c.d, c.v.vehicle) + rideMin(target().d, 'car') : null;
  }

  /* ---------------- routing ----------------
     FOSSGIS OSRM (routing.openstreetmap.de) has real foot, bike and car profiles.
     Straight-line estimate when offline. Routes are cached in localStorage. */
  const OSRM = { foot: 'routed-foot', bike: 'routed-bike', driving: 'routed-car' };
  let routeCache = {};
  try { routeCache = JSON.parse(localStorage.getItem(ROUTE_KEY) || '{}'); } catch (e) { routeCache = {}; }
  const straight = (a, b) => ({ coords: [[a.lat, a.lng], [b.lat, b.lng]], distance: dist(a, b) * 1.25, estimated: true });
  async function osrm(points, profile) {
    const key = profile + '|' + points.map(p => p.lat.toFixed(4) + ',' + p.lng.toFixed(4)).join(';');
    if (routeCache[key]) return routeCache[key];
    if (!navigator.onLine) return null;
    try {
      const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 9000);
      const url = `https://routing.openstreetmap.de/${OSRM[profile]}/route/v1/driving/${points.map(p => p.lng.toFixed(6) + ',' + p.lat.toFixed(6)).join(';')}?overview=full&geometries=geojson`;
      const res = await fetch(url, { signal: ctrl.signal }); clearTimeout(t);
      const j = await res.json(); if (!j.routes || !j.routes[0]) return null;
      const out = { coords: j.routes[0].geometry.coordinates.map(c => [+c[1].toFixed(6), +c[0].toFixed(6)]), distance: j.routes[0].distance };
      routeCache[key] = out;
      const keys = Object.keys(routeCache); if (keys.length > 120) delete routeCache[keys[0]];
      try { localStorage.setItem(ROUTE_KEY, JSON.stringify(routeCache)); } catch (e) { routeCache = {}; }
      return out;
    } catch (e) { return null; }
  }
  async function getRoute(from, to, profile) { return (await osrm([from, to], profile)) || straight(from, to); }

  /* ---- Environment features for shade and storm exposure (OpenStreetMap via Overpass) ---- */
  const featCache = {};
  const CELL = 0.0004;
  const cellKey = (lat, lng) => Math.floor(lat / CELL) + ':' + Math.floor(lng / CELL);
  function gridAdd(grid, lat, lng, v) { const k = cellKey(lat, lng); (grid[k] || (grid[k] = [])).push(v); }
  function gridNear(grid, p, meters) {
    const r = Math.ceil(meters / 22) + 1, bl = Math.floor(p.lat / CELL), bg = Math.floor(p.lng / CELL), out = [];
    for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) { const a = grid[(bl + i) + ':' + (bg + j)]; if (a) out.push.apply(out, a); }
    return out;
  }
  function inRing(p, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i], b = ring[j];
      if (((a[1] > p.lng) !== (b[1] > p.lng)) && (p.lat < (b[0] - a[0]) * (p.lng - a[1]) / (b[1] - a[1]) + a[0])) inside = !inside;
    }
    return inside;
  }
  function polyHit(polys, p) { return polys.some(pl => p.lat >= pl.s && p.lat <= pl.n && p.lng >= pl.w && p.lng <= pl.e && inRing(p, pl.ring)); }
  async function getFeatures(b) {
    const key = [b.s, b.w, b.n, b.e].map(v => v.toFixed(3)).join(',');
    if (featCache[key]) return featCache[key];
    if (!navigator.onLine) return null;
    const q = `[out:json][timeout:25];(way["building"](${key});node["natural"="tree"](${key});way["natural"~"^(wood|tree_row|scrub)$"](${key});way["landuse"="forest"](${key});way["leisure"="park"](${key});way["natural"="coastline"](${key}););out geom;`;
    try {
      const ctrl = new AbortController(), t = setTimeout(() => ctrl.abort(), 25000);
      const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctrl.signal });
      clearTimeout(t); const j = await res.json();
      const F = { bld: {}, trees: {}, coast: {}, woods: [], parks: [], counts: { buildings: 0, trees: 0 } };
      const poly = geom => { const ring = geom.map(g => [g.lat, g.lon]); const lats = ring.map(r => r[0]), lngs = ring.map(r => r[1]); return { ring, s: Math.min(...lats), n: Math.max(...lats), w: Math.min(...lngs), e: Math.max(...lngs) }; };
      for (const el of j.elements) {
        const tg = el.tags || {};
        if (el.type === 'node' && tg.natural === 'tree') { gridAdd(F.trees, el.lat, el.lon, { lat: el.lat, lng: el.lon }); F.counts.trees++; continue; }
        if (!el.geometry) continue;
        if (tg.building) {
          const h = parseFloat(tg.height) || (parseFloat(tg['building:levels']) ? parseFloat(tg['building:levels']) * 3 + 1 : (['house', 'detached', 'shed', 'garage', 'garages', 'hut', 'kiosk'].includes(tg.building) ? 6 : 13));
          densify(el.geometry.map(g => [g.lat, g.lon]), 6).forEach(c => gridAdd(F.bld, c[0], c[1], { lat: c[0], lng: c[1], h }));
          F.counts.buildings++;
        } else if (tg.natural === 'tree_row') densify(el.geometry.map(g => [g.lat, g.lon]), 8).forEach(c => { gridAdd(F.trees, c[0], c[1], { lat: c[0], lng: c[1] }); F.counts.trees++; });
        else if (tg.natural === 'coastline') densify(el.geometry.map(g => [g.lat, g.lon]), 20).forEach(c => gridAdd(F.coast, c[0], c[1], { lat: c[0], lng: c[1] }));
        else if (tg.natural === 'wood' || tg.natural === 'scrub' || tg.landuse === 'forest') F.woods.push(poly(el.geometry));
        else if (tg.leisure === 'park') F.parks.push(poly(el.geometry));
      }
      featCache[key] = F; return F;
    } catch (e) { return null; }
  }
  /* 1 = shaded, 0 = in the sun. A building vertex shades p when it lies toward the sun
     within the shadow length h / tan(elevation). Trees shade within their canopy. */
  function shadeAt(p, F, sun) {
    if (sun.el < 3) return 1;
    const tanEl = Math.tan(toRad(sun.el));
    for (const v of gridNear(F.bld, p, Math.min(90, 40 / tanEl))) {
      const d = dist(p, v); if (d < 1.5 || d > v.h / tanEl) continue;
      let diff = Math.abs(bearing(p, v) - sun.az); if (diff > 180) diff = 360 - diff;
      if (diff < 32) return 1;
    }
    if (gridNear(F.trees, p, 8).some(t => dist(p, t) <= 6)) return 1;
    if (polyHit(F.woods, p)) return 1;
    if (polyHit(F.parks, p)) return 0.5;
    return 0;
  }
  /* 1 = exposed in a storm: under or next to trees, in woods/parks, near the shoreline, inside active works */
  function riskAt(p, F) {
    const g = stormGustAt(p), tr = g >= 25 ? 18 : 12, cr = g >= 25 ? 200 : 120;
    if (gridNear(F.trees, p, tr + 2).some(t => dist(p, t) <= tr)) return 1;
    if (polyHit(F.woods, p)) return 1;
    if (gridNear(F.coast, p, cr + 10).some(c => dist(p, c) <= cr)) return 1;
    if (S.works.some(w => { if (workStatus(w) !== 'active') return false; const z = workZone(w); return zoneDist(p, z) <= zoneR(z); })) return 1;
    if (polyHit(F.parks, p)) return 0.7;
    return 0;
  }
  function profileRoute(coords, fn) {
    const pts = densify(coords, 10), vals = pts.map(c => fn(ll(c)));
    const ratio = vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length);
    const segs = []; let cur = null;
    pts.forEach((c, i) => { const cls = vals[i] >= 0.5 ? 1 : 0; if (!cur || cur.cls !== cls) { if (cur) cur.coords.push(c); cur = { cls, coords: [c] }; segs.push(cur); } else cur.coords.push(c); });
    return { ratio, segs };
  }
  function bboxOf(routes, pad) {
    let s = 90, n = -90, w = 180, e = -180;
    routes.forEach(r => r.coords.forEach(c => { s = Math.min(s, c[0]); n = Math.max(n, c[0]); w = Math.min(w, c[1]); e = Math.max(e, c[1]); }));
    return { s: s - pad, n: n + pad, w: w - pad * 2, e: e + pad * 2 };
  }

  /* Protocol-aware routing: avoid hazard zones (flood / storm), maximise shade (heat),
     minimise exposure (storm). Candidates come from detour waypoints around hazards and
     perpendicular offsets at the route midpoint; the best-scoring candidate wins. */
  async function smartRoute(from, to, profile, modeKey) {
    const t = proto(), base = await getRoute(from, to, profile);
    const info = { avoided: [], blocked: [], shade: null, baseShade: null, exposure: null, baseExposure: null, extra: 0, water: [], note: '', sun: null };
    const hz = avoidZones(modeKey);
    if (base.estimated) { if (t || hz.length) info.note = 'Offline: showing a straight-line estimate. Avoiding hazards and construction needs a connection.'; return { route: base, info, segs: null }; }
    if (!t && !hz.length) return { route: base, info, segs: null };
    const pr = t ? PROTOCOLS[t] : { routing: null };
    const hitsOf = r => hz.filter(h => crosses(r.coords, h));
    const baseHits = hitsOf(base);
    let cands = [base];
    if (baseHits.length) {
      /* Detour waypoints around each crossed zone (12 bearings, two distances). If every
         one-waypoint detour still clips a zone, add a second waypoint around what remains. */
      const mkVias = hits => {
        const vs = [];
        hits.forEach(h => {
          if (h.coords) {
            const a0 = ll(h.coords[0]), b0 = ll(h.coords[h.coords.length - 1]), m = h.mid || lineMid(h.coords), brg = bearing(a0, b0);
            [a0, m, b0].forEach(p => [h.buffer + 50, h.buffer + 140, h.buffer + 260].forEach(k => [90, 270].forEach(s => vs.push(offset(p, k, (brg + s) % 360)))));
            [[a0, (brg + 180) % 360], [b0, brg]].forEach(([p, br]) => [50, 140].forEach(k => vs.push(offset(p, k, br))));
          } else [1.45, 2.2, 3.2].forEach(k => { for (let b = 0; b < 360; b += 30) vs.push(offset(h, h.radius * k + 60, b)); });
        });
        return vs.filter(v => !hz.some(z => zoneDist(v, z) <= zoneR(z) + 25) && dist(v, from) > 80 && dist(v, to) > 80);
      };
      const byDetour = (x, y) => (dist(from, x) + dist(x, to)) - (dist(from, y) + dist(y, to));
      const side = v => Math.sign((to.lng - from.lng) * (v.lat - from.lat) - (to.lat - from.lat) * (v.lng - from.lng));
      const balanced = (vs, n) => { const L = vs.filter(v => side(v) > 0).sort(byDetour), R = vs.filter(v => side(v) <= 0).sort(byDetour), out = []; for (let i = 0; out.length < n && (i < L.length || i < R.length); i++) { if (L[i]) out.push(L[i]); if (R[i] && out.length < n) out.push(R[i]); } return out; };
      const vias = balanced(mkVias(baseHits), 8);
      const tries = (await Promise.all(vias.map(v => osrm([from, v, to], profile).then(r => r && Object.assign({ vias: [v] }, r))))).filter(Boolean);
      cands = cands.concat(tries);
      if (tries.length && !tries.some(r => !hitsOf(r).length)) {
        const best = tries.map(r => ({ r, h: hitsOf(r) })).sort((x, y) => x.h.length - y.h.length || x.r.distance - y.r.distance)[0];
        const v2 = balanced(mkVias(best.h), 4);
        const t2 = await Promise.all(v2.map(v => osrm([from].concat(best.r.vias.concat([v]).sort((x, y) => dist(from, x) - dist(from, y)), [to]), profile)));
        cands = cands.concat(t2.filter(Boolean));
      }
    }
    const scoresEnv = (pr.routing === 'shade' || pr.routing === 'safe') && (modeKey === 'walk' || modeKey === 'bike');
    if (scoresEnv) {
      const mid = ll(base.coords[Math.floor(base.coords.length / 2)]), brg = bearing(from, to);
      const spread = Math.min(320, Math.max(90, base.distance * 0.18));
      const vias = [spread * 0.5, spread, -spread * 0.5, -spread].map(m => offset(mid, Math.abs(m), (brg + (m > 0 ? 90 : -90) + 360) % 360));
      const tries = await Promise.all(vias.map(v => osrm([from, v, to], profile)));
      cands = cands.concat(tries.filter(Boolean));
    }
    let F = null;
    if (scoresEnv) { F = await getFeatures(bboxOf(cands, 0.0015)); if (!F) info.note = 'Street tree and building data could not be loaded, so this is the fastest route.'; }
    const when = new Date(); if (U.sunHour != null) when.setHours(U.sunHour, 0, 0, 0);
    const sun = sunPos(when, from.lat, from.lng); info.sun = sun; info.when = when.getTime();
    const scored = cands.map(r => {
      const hits = hitsOf(r); let score = r.distance / base.distance + hits.length * 10, shade = null, exposure = null, segs = null;
      if (F && pr.routing === 'shade') { const pf = profileRoute(r.coords, p => shadeAt(p, F, sun)); shade = pf.ratio; segs = pf.segs; score -= 1.1 * shade; }
      if (F && pr.routing === 'safe') { const pf = profileRoute(r.coords, p => riskAt(p, F)); exposure = pf.ratio; segs = pf.segs; score += 1.6 * exposure; }
      if (r !== base && r.distance > base.distance * (scoresEnv ? 1.45 : 2.5)) score += 5;
      return { r, hits, shade, exposure, segs, score };
    }).sort((a, b) => a.score - b.score);
    const best = scored[0], baseScored = scored.find(x => x.r === base);
    info.avoided = baseHits.filter(h => !best.hits.includes(h)).map(h => h.name);
    info.blocked = best.hits.map(h => h.name);
    info.shade = best.shade; info.baseShade = baseScored.shade;
    info.exposure = best.exposure; info.baseExposure = baseScored.exposure;
    info.extra = Math.max(0, best.r.distance - base.distance);
    if (pr.routing === 'shade') info.water = POIS.filter(p => p.cat === 'water' && densify(best.r.coords, 40).some(c => dist(ll(c), p) < 150)).map(p => p.id);
    return { route: best.r, info, segs: best.segs };
  }

  /* ---------------- map ---------------- */
  const map = L.map('map', { zoomControl: false }).setView(LKP.CITY_CENTER, 14);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  map.attributionControl.setPrefix('<b>PiMap prototype</b> · not an official City of Tallinn service · <a href="https://leafletjs.com">Leaflet</a>');
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  const layers = {};
  ['hazards', 'geofences', 'works', 'route', 'pois', 'fleet', 'listings', 'volunteers', 'requests', 'shelters', 'dest', 'user'].forEach(k => { layers[k] = L.layerGroup().addTo(map); });
  const icon = (cls, html, size) => L.divIcon({ className: 'mk ' + cls, html, iconSize: [size, size] });
  let clickMode = null;
  function setClickMode(mode, hint) {
    clickMode = mode; const h = $('#mapHint');
    if (mode) { h.textContent = hint; h.hidden = false; $('#map').style.cursor = 'crosshair'; } else { h.hidden = true; $('#map').style.cursor = ''; }
  }
  map.on('click', e => {
    const { lat, lng } = e.latlng;
    if (clickMode === 'user') { S.user.lat = lat; S.user.lng = lng; S.unlock = null; setClickMode(null); save(); renderAll(); refreshRoute(); }
    else if (clickMode === 'listing') { U.lendDraft.lat = lat; U.lendDraft.lng = lng; setClickMode(null); saveUI(); renderAll(); }
    else if (clickMode === 'call') { U.callDraft.lat = lat; U.callDraft.lng = lng; setClickMode(null); saveUI(); renderAll(); }
    else if (clickMode === 'work') { U.workDraft.pts = (U.workDraft.pts || []).concat([[+lat.toFixed(6), +lng.toFixed(6)]]); snapWorkDraft(); }
    else if (clickMode === 'storm') { U.stormDraft.lat = lat; U.stormDraft.lng = lng; setClickMode(null); saveUI(); renderAll(); }
    else if (clickMode === 'contrib') { U.contribDraft.lat = lat; U.contribDraft.lng = lng; setClickMode(null); saveUI(); renderAll(); }
    else if (clickMode === 'report') { U.reportDraft.lat = lat; U.reportDraft.lng = lng; setClickMode(null); saveUI(); renderAll(); }
    else if (clickMode === 'hazard') { U.hazardDraft.lat = lat; U.hazardDraft.lng = lng; setClickMode(null); saveUI(); renderAll(); }
  });
  function fitPad() {
    const m = window.innerWidth <= 860;
    if (U.portal === 'gov') return m ? { paddingTopLeft: [20, 20], paddingBottomRight: [20, Math.round(window.innerHeight * 0.5)] } : { paddingTopLeft: [460, 40], paddingBottomRight: [60, 40] };
    return m ? { paddingTopLeft: [24, 130], paddingBottomRight: [24, Math.round(window.innerHeight * 0.52)] } : { paddingTopLeft: [450, 150], paddingBottomRight: [70, 40] };
  }
  function openPlace(kind, id) {
    U.dest = { kind, id }; U.cview = 'place';
    const p = placeOf(kind, id);
    if (p && p.work && p.work.coords) map.fitBounds(L.latLngBounds(p.work.coords), Object.assign({ maxZoom: 17 }, fitPad()));
    else if (p) map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 16), { duration: 0.6 });
    saveUI(); renderCitizen(); drawMap();
  }
  function hazardKindShown() {
    if (U.portal === 'citizen') return proto() ? PROTOCOLS[proto()].hazard : null;
    const t = proto() || (U.govTab === 'crisis' ? U.form.protocol : null);
    return t ? PROTOCOLS[t].hazard : null;
  }

  function drawMap() {
    Object.entries(layers).forEach(([k, l]) => { if (k !== 'route') l.clearLayers(); });
    const em = S.emergency, gov = U.portal === 'gov', tg = target();
    const inDir = !gov && U.cview === 'directions';
    const hk = hazardKindShown();
    if (hk) S.hazards.filter(h => h.kind === hk).forEach(h => {
      const flood = h.kind === 'flood';
      L.circle([h.lat, h.lng], { radius: h.radius, color: flood ? '#1565C0' : '#B71C1C', weight: 2, dashArray: flood ? null : '4 4', fillColor: flood ? '#42A5F5' : '#E53935', fillOpacity: flood ? 0.35 : 0.22, className: flood ? 'hz-flood' : 'hz-unsafe' })
        .bindPopup(`<b>${esc(h.name)}</b><span class="muted">${flood ? 'Flooded area' : 'Unsafe place'}${h.example ? ' · example zone' : ''}</span>${flood ? 'Routes go around this area.' : 'Routes avoid this place.'}`)
        .addTo(layers.hazards);
    });
    stormsShown().forEach(st => {
      const s = stormStatus(st), to = (Number(st.from) + 180) % 360;
      L.circle([st.lat, st.lng], { radius: st.radiusKm * 1000, color: '#6A1B9A', weight: 2, dashArray: '10 8', fillColor: '#6A1B9A', fillOpacity: s === 'active' ? 0.06 : 0.03, interactive: false }).addTo(layers.hazards);
      L.marker([st.lat, st.lng], { icon: L.divIcon({ className: 'mk-wind', html: `<div class="wind-arrow" style="transform:rotate(${to}deg)"><svg viewBox="0 0 24 24"><path d="M12 21V3M12 3l-6 7M12 3l6 7"/></svg></div><div class="wind-lbl"><b>${esc(st.name)}</b>${s === 'upcoming' ? 'from ' + timeStr(st.startMs) + ' · ' : ''}gusts ${st.gust} m/s from ${dirName(st.from)}</div>`, iconSize: [170, 70], iconAnchor: [85, 35] }), interactive: false, zIndexOffset: -500 }).addTo(layers.hazards);
    });
    reportsShown().forEach(r => {
      const T = REPORT_TYPES[r.type];
      const m = L.marker([r.lat, r.lng], { icon: icon('mk-poi mk-report' + (r.status === 'reported' ? ' unconfirmed' : ''), `<span style="--c:${T.color}">${svgOf(T)}</span>`, 26), zIndexOffset: 400 });
      if (gov) m.bindPopup(`<b>${T.label}</b><span class="muted">${r.by === 'city' ? 'City crew' : 'Citizen report'} · ${ago(r.createdAt)} · ${r.status}</span>${esc(r.note || '')}`);
      else m.on('click', () => openPlace('report', r.id));
      m.addTo(layers.hazards);
    });
    const showContrib = gov ? U.govTab === 'contrib' : (U.cat === 'community' || U.cview === 'contribute' || (U.cview === 'place' && U.dest && U.dest.kind === 'contrib'));
    if (showContrib) S.contribs.filter(c => gov || c.status !== 'declined').forEach(c => {
      const K = CONTRIB[c.kind], done = c.status === 'done';
      const m = L.marker([c.lat, c.lng], { icon: icon('mk-poi mk-contrib' + (done ? ' done' : ''), `<span style="--c:${K.color}">${svgOf(K)}</span>${c.votes ? `<i class="vbadge">${c.votes}</i>` : ''}`, 26), zIndexOffset: 350 });
      if (gov) m.bindPopup(`<b>${esc(c.title)}</b><span class="muted">${K.label} · ${K.cats[c.cat]} · ${c.votes} support · ${CSTATUS[c.status]}</span>${esc(c.note || '')}`);
      else m.on('click', () => openPlace('contrib', c.id));
      m.addTo(layers.pois);
    });
    if (!gov && U.cview === 'contribute' && U.contribDraft.lat && U.contribDraft.kind !== 'tree') { const K = CONTRIB[U.contribDraft.kind]; L.marker([U.contribDraft.lat, U.contribDraft.lng], { icon: icon('mk-poi', `<span style="--c:${K.color}">${svgOf(K)}</span>`, 32), zIndexOffset: 950 }).addTo(layers.pois); }
    if (U.reportDraft.lat && ((gov && U.govTab === 'crisis') || (!gov && (U.cview === 'report' || (U.cview === 'contribute' && U.contribDraft.kind === 'tree'))))) L.marker([U.reportDraft.lat, U.reportDraft.lng], { icon: icon('mk-poi', `<span style="--c:${REPORT_TYPES[U.reportDraft.type].color}">${svgOf(REPORT_TYPES[U.reportDraft.type])}</span>`, 30), zIndexOffset: 950 }).addTo(layers.hazards);
    if (gov && U.stormDraft.lat && U.govTab === 'crisis') L.circle([U.stormDraft.lat, U.stormDraft.lng], { radius: (Number(U.stormDraft.radiusKm) || 8) * 1000, color: '#6A1B9A', weight: 2, dashArray: '4 8', fillOpacity: 0.03 }).addTo(layers.hazards);
    if (gov && U.hazardDraft.lat && U.govTab === 'crisis') L.circle([U.hazardDraft.lat, U.hazardDraft.lng], { radius: Number(U.hazardDraft.radius) || 150, color: '#555', weight: 2, dashArray: '4 6', fillOpacity: 0.08 }).addTo(layers.hazards);

    S.works.forEach(w => {
      const st = workStatus(w); if (st === 'finished') return;
      const color = st === 'active' ? '#F28C00' : '#9AA5B1', z = workZone(w);
      const html = `<b>${esc(w.name)}</b><span class="muted">${WORK_TYPES[w.type] || w.type} · ${fmtDate(w.start)} – ${fmtDate(w.end)} · ${st}${z.coords ? ` · ${Math.round(lineLen(z.coords))} m of street` : ''}</span>${esc(w.note)}<div class="pop-actions"><button class="btn btn-outline btn-sm" data-action="edit-work" data-id="${w.id}" type="button">Edit</button><button class="btn btn-grey btn-sm" data-action="extend-work" data-id="${w.id}" type="button">+7 days</button></div>`;
      const bind = l => { if (gov) l.bindPopup(html); else l.on('click', () => openPlace('work', w.id)); return l; };
      if (z.coords) {
        L.polyline(z.coords, { color: '#fff', weight: 14, opacity: 0.95, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(layers.works);
        L.polyline(z.coords, { color, weight: 9, opacity: 1, lineCap: 'butt', lineJoin: 'round', interactive: false }).addTo(layers.works);
        L.polyline(z.coords, { color: st === 'active' ? '#1F1F1F' : '#fff', weight: 9, opacity: 0.75, dashArray: '6 9', lineCap: 'butt', lineJoin: 'round', interactive: false }).addTo(layers.works);
        bind(L.polyline(z.coords, { color: '#000', weight: 24, opacity: 0.001 })).addTo(layers.works);
      } else L.circle([w.lat, w.lng], { radius: z.radius, color, weight: 2, dashArray: st === 'active' ? null : '6 6', fillColor: color, fillOpacity: st === 'active' ? 0.16 : 0.07, interactive: false }).addTo(layers.works);
      bind(L.marker([z.lat, z.lng], { icon: icon('mk-poi' + (st === 'active' ? '' : ' soon'), `<span style="--c:${color}">${svgOf(catById('works'))}</span>`, 22), zIndexOffset: 250 })).addTo(layers.works);
    });
    const wdr = U.workDraft;
    if (gov && U.govTab === 'works' && wdr.pts && wdr.pts.length) {
      if (wdr.coords && wdr.coords.length > 1) { L.polyline(wdr.coords, { color: '#fff', weight: 13, opacity: 0.9, interactive: false }).addTo(layers.works); L.polyline(wdr.coords, { color: '#F28C00', weight: 8, opacity: 0.9, dashArray: '2 10', lineCap: 'round', interactive: false }).addTo(layers.works); }
      wdr.pts.forEach((p, i) => L.marker(p, { icon: icon('mk-wpt', String(i + 1), 20), zIndexOffset: 950, interactive: false }).addTo(layers.works));
    }

    const showGeo = em && S.mandate === 'active' && (gov || (inDir && U.mode === 'bike'));
    if (showGeo) SHELTERS.forEach(s => L.circle([s.lat, s.lng], { radius: S.radius, color: '#0072CE', weight: 1, fillColor: '#0072CE', fillOpacity: 0.05, interactive: false }).addTo(layers.geofences));

    const shelterCat = catById('shelter');
    SHELTERS.forEach(s => {
      const isT = !gov && tg.s.kind === 'shelter' && tg.s.id === s.id && (U.cview === 'directions' || U.cview === 'place');
      const m = L.marker([s.lat, s.lng], { icon: icon('mk-poi mk-shelter-poi' + (isT ? ' target' : ''), `<span style="--c:${shelterCat.color}">${svgOf(shelterCat)}</span>`, isT ? 32 : 26), zIndexOffset: isT ? 800 : 200 });
      if (gov) m.bindPopup(`<b>${esc(s.name)}</b><span class="muted">Public shelter · ${esc(s.district)}</span>${esc(s.address)}`);
      else m.on('click', () => openPlace('shelter', s.id));
      m.addTo(layers.shelters);
    });

    if (!gov) {
      const showCats = new Set();
      if (U.cat && U.cat !== 'shelter' && U.cat !== 'works') showCats.add(U.cat);
      if (inDir && proto() === 'heat') showCats.add('water');
      if (proto() === 'heat' || proto() === 'storm') showCats.add('cool');
      POIS.filter(p => showCats.has(p.cat)).forEach(p => {
        const c = catById(p.cat), onRoute = p.cat === 'water' && U.routeInfo && (U.routeInfo.water || []).includes(p.id);
        if (p.cat === 'water' && inDir && !onRoute && U.cat !== 'water') return;
        L.marker([p.lat, p.lng], { icon: icon('mk-poi' + (onRoute ? ' hl' : ''), `<span style="--c:${c.color}">${svgOf(c)}</span>`, 24) })
          .on('click', () => openPlace('poi', p.id)).addTo(layers.pois);
      });
    }

    const showFleet = gov || (inDir && U.mode === 'bike');
    if (showFleet) {
      S.fleet.forEach(v => {
        const op = OPERATORS.find(o => o.id === v.operatorId);
        const cls = 'mk-fleet' + (v.unlocked && !v.claimedBy ? ' on' : '') + (v.accessible ? ' acc' : '');
        L.marker([v.lat, v.lng], { icon: icon(cls, op.letter, 18), opacity: v.claimedBy ? 0.4 : 1 })
          .bindPopup(`<b>${esc(VEHICLE_LABELS[v.type] || v.type)}</b><span class="muted">${op.name} · ${v.id} · battery ${v.battery}%</span>${v.claimedBy ? 'In use' : v.unlocked ? '€0 · Emergency Unlock Mandate' : `€${v.fare.toFixed(2)} unlock`}`)
          .addTo(layers.fleet);
      });
      S.listings.filter(l => l.status !== 'removed' && (gov || l.status === 'active')).forEach(l => {
        L.marker([l.lat, l.lng], { icon: icon('mk-listing ' + l.status + (l.accessible ? ' acc' : ''), 'L', 18) })
          .bindPopup(`<b>${esc(l.label)}</b><span class="muted">${esc(VEHICLE_LABELS[l.type] || l.type)} · listed by ${esc(l.owner)}</span>${l.status === 'dormant' ? 'Dormant — activates on declaration' : l.status === 'active' ? 'Active — free to borrow' : 'Claimed by a neighbour'}`)
          .addTo(layers.listings);
      });
    }
    if (em && (gov || (inDir && U.mode === 'pickup'))) S.volunteers.forEach(v => L.marker([v.lat, v.lng], { icon: icon('mk-vol' + (v.available ? '' : ' busy'), 'R', 18) })
      .bindPopup(`<b>${esc(v.name)}</b><span class="muted">${esc(VEHICLE_LABELS[v.vehicle] || v.vehicle)} · ${v.seats} seat${v.seats > 1 ? 's' : ''}${v.accessible ? ' · accessible' : ''}</span>${v.available ? 'Available for pick-up' : 'On a pick-up'}`)
      .addTo(layers.volunteers));
    if (em && gov) S.requests.forEach(r => L.marker([r.lat, r.lng], { icon: icon('mk-req' + (r.status === 'matched' ? ' matched' : ''), '!', 18) })
      .bindPopup(`<b>${esc(r.name)}</b><span class="muted">${NEEDS[r.need].label} · ${r.people} pers. · priority ${r.priority}</span>${r.status === 'matched' ? 'Matched' : 'Queued #' + r.position}`)
      .addTo(layers.requests));
    if (gov && U.callDraft.lat && U.govTab === 'dispatch') L.marker([U.callDraft.lat, U.callDraft.lng], { icon: icon('mk-req', '+', 22) }).addTo(layers.requests);
    if (!gov && U.lendDraft.lat && U.cview === 'lend') L.marker([U.lendDraft.lat, U.lendDraft.lng], { icon: icon('mk-listing', '+', 22) }).addTo(layers.listings);

    if (!gov && U.dest && (U.cview === 'place' || U.cview === 'directions') && tg.s.kind !== 'shelter') {
      L.marker([tg.s.lat, tg.s.lng], { icon: L.divIcon({ className: 'mk-pin', html: `<span style="--c:${catById(tg.s.cat).color}">${svgOf(catById(tg.s.cat))}</span>`, iconSize: [34, 44], iconAnchor: [17, 42] }), zIndexOffset: 900 }).addTo(layers.dest);
    }
    L.marker([S.user.lat, S.user.lng], { icon: icon('mk-user', '', 18), zIndexOffset: 1000 }).bindPopup('<b>You</b>').addTo(layers.user);
  }

  let routeToken = 0;
  async function refreshRoute() {
    const token = ++routeToken;
    layers.route.clearLayers();
    if (U.portal !== 'citizen' || U.cview !== 'directions') return;
    const tg = target().s, u = S.user, profile = MODE_PROFILE[U.mode];
    const modeKey = { walk: 'walk', bike: 'bike', drive: 'drive', pickup: 'drive' }[U.mode];
    U.routeInfo = { loading: true }; renderCitizen();
    const base = { color: '#0072CE', weight: 6, opacity: 0.95 }, dashed = { color: '#5F6368', weight: 4, dashArray: '2 9', opacity: 0.95, lineCap: 'round' };
    const drawn = [];
    const draw = (coords, st) => { if (token === routeToken) { L.polyline(coords, Object.assign({ lineCap: 'round', lineJoin: 'round' }, st)).addTo(layers.route); drawn.push(coords); } };
    const drawSmart = res => {
      const pr = proto() && PROTOCOLS[proto()];
      if (res.segs && pr) {
        const colors = pr.routing === 'shade' ? { 1: '#1B7F3B', 0: '#F28C00' } : { 1: '#D2232A', 0: '#0072CE' };
        L.polyline(res.route.coords, { color: '#fff', weight: 10, opacity: 0.9, lineCap: 'round' }).addTo(layers.route);
        res.segs.forEach(sg => draw(sg.coords, { color: colors[sg.cls], weight: 6, opacity: 0.95 }));
      } else {
        L.polyline(res.route.coords, { color: '#fff', weight: 10, opacity: 0.9, lineCap: 'round' }).addTo(layers.route);
        draw(res.route.coords, base);
      }
    };
    const fit = pts => { if (token === routeToken && pts.length) map.fitBounds(L.latLngBounds(pts), Object.assign({ maxZoom: 17 }, fitPad())); };
    let res, legs = [];
    if (U.mode === 'bike' && S.unlock && S.unlock.code) {
      const v = S.unlock.kind === 'fleet' ? S.fleet.find(x => x.id === S.unlock.id) : S.listings.find(x => x.id === S.unlock.id);
      if (!v) return;
      const walkLeg = await getRoute(u, v, 'foot'); legs.push(walkLeg);
      res = await smartRoute(v, tg, 'bike', 'bike');
    } else if (U.mode === 'pickup') {
      const req = S.requests.find(r => r.id === S.myRequestId);
      if (req && req.status === 'matched') { const vol = S.volunteers.find(v => v.id === req.volunteerId); legs.push(await getRoute(vol, u, 'driving')); }
      res = await smartRoute(u, tg, 'driving', 'drive');
    } else {
      res = await smartRoute(u, tg, profile, modeKey);
    }
    if (token !== routeToken) return;
    legs.forEach(l => draw(l.coords, dashed));
    drawSmart(res);
    fit(res.route.coords.concat(...legs.map(l => l.coords)));
    const all = drawn.flat ? drawn.flat() : [].concat(...drawn);
    const hits = S.works.filter(w => workStatus(w) === 'active' && w.affects[modeKey]).filter(w => crosses(all, workZone(w)));
    U.conflicts = hits.map(w => w.id);
    U.routeInfo = Object.assign({ distance: res.route.distance, estimated: !!res.route.estimated }, res.info);
    saveUI(); renderCitizen(); drawMap();
  }

  /* ---------------- protocol actions ---------------- */
  function addLog(entry) { S.mdsLog.unshift(Object.assign({ t: Date.now() }, entry)); if (S.mdsLog.length > 80) S.mdsLog.length = 80; save(); renderGov(); }
  function seedOtherRequests(now) {
    [
      { name: 'Elderly couple, Kalamaja', need: 'slow', people: 2, lat: 59.4462, lng: 24.7332 },
      { name: 'Wheelchair user, Vanalinn', need: 'wheelchair', people: 1, lat: 59.4385, lng: 24.7448 },
      { name: 'Parent with pram, Kesklinn', need: 'children', people: 3, lat: 59.4322, lng: 24.7488 },
      { name: 'Resident on crutches, Kristiine', need: 'mobility_aid', people: 1, lat: 59.4285, lng: 24.7270 },
    ].forEach((o, i) => S.requests.push({ id: uid('req'), name: o.name, need: o.need, people: o.people, note: '', priority: NEEDS[o.need].p, createdAt: now + i * 1000, status: 'queued', volunteerId: null, lat: o.lat, lng: o.lng, mine: false, source: 'app' }));
  }
  function matchRequests() {
    const pending = S.requests.filter(r => r.status === 'queued').sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt);
    for (const r of pending) {
      const needAcc = NEEDS[r.need].accessible;
      const c = S.volunteers.filter(v => v.available && v.seats >= r.people && (!needAcc || v.accessible)).map(v => ({ v, d: dist(v, r) })).sort((a, b) => a.d - b.d)[0];
      if (c) { c.v.available = false; r.status = 'matched'; r.volunteerId = c.v.id; r.eta = Math.max(2, Math.round(c.d * 1.25 / RIDE_SPEED[c.v.vehicle])); r.matchedAt = Date.now(); }
    }
    S.requests.filter(r => r.status === 'queued').sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt).forEach((r, i) => { r.position = i + 1; });
  }
  async function declare() {
    const now = Date.now(), f = U.form, pr = PROTOCOLS[f.protocol];
    const st = f.protocol === 'storm' && S.storms.filter(s => stormStatus(s) !== 'passed').sort((x, y) => y.gust - x.gust)[0];
    const autoMsg = st ? `${st.name}: gusts up to ${st.gust} m/s from the ${dirName(st.from)}. Get indoors now. Your route avoids trees, fallen branches, the shoreline and construction sites.` : pr.message;
    S.emergency = { policyId: MDS.uuid(), type: f.protocol, district: f.district, message: f.message || autoMsg, declaredAt: now, endsAt: now + Number(f.hours) * 3600e3, policy: null };
    S.listings.forEach(l => { if (l.status === 'dormant') l.status = 'active'; });
    S.requests = []; S.myRequestId = null; S.unlock = null; S.mandate = 'none';
    seedOtherRequests(now); matchRequests();
    toast(`EE-ALARM pushed · ${pr.label} · ${f.district} · ~${POP[f.district].toLocaleString('en')} devices (simulated)`);
    save(); renderAll(); refreshRoute();
    if (S.autoUnlock) await publishMandate();
  }
  async function publishMandate() {
    const em = S.emergency; if (!em || S.mandate === 'publishing') return;
    S.mandate = 'publishing';
    const geographies = MDS.buildGeographies(SHELTERS, S.radius, Date.now());
    const policy = MDS.buildPolicy(em, SHELTERS, OPERATORS, S.radius); em.policy = policy;
    S.acks = {}; OPERATORS.forEach(o => { S.acks[o.id] = { status: 'awaiting' }; });
    save(); renderAll();
    await MDS.publish({
      policy, geographies, operators: OPERATORS, log: addLog,
      applyFn: op => { let inG = 0, unl = 0, tot = 0; S.fleet.forEach(v => { if (v.operatorId !== op.id) return; tot++; if (inGeofence(v)) { inG++; v.unlocked = true; unl++; } else v.unlocked = false; }); return { inGeofence: inG, unlocked: unl, total: tot }; },
      onAck: (op, ack) => { if (!S.emergency) return; S.acks[op.id] = { status: 'applied', at: ack.applied_at, unlocked: ack.vehicles_zero_fare }; save(); renderAll(); },
    });
    if (S.emergency) { S.mandate = 'active'; save(); renderAll(); }
  }
  async function revokeMandate(silent) {
    const em = S.emergency; if (!em || !em.policy) return;
    await MDS.revoke({ policy: em.policy, operators: OPERATORS, log: addLog, onAck: (op, ack) => { S.acks[op.id] = { status: 'revoked', at: ack.applied_at }; renderGov(); } });
    S.fleet.forEach(v => { v.unlocked = false; v.claimedBy = null; });
    if (S.unlock && S.unlock.kind === 'fleet') S.unlock = null;
    S.mandate = 'revoked'; save(); renderAll(); refreshRoute();
    if (!silent) toast('Fleets locked again — normal pricing restored');
  }
  async function endEmergency(reason) {
    if (!S.emergency) return;
    if (S.mandate === 'active') await revokeMandate(true);
    S.fleet.forEach(v => { v.unlocked = false; v.claimedBy = null; });
    S.listings.forEach(l => { if (l.status !== 'removed') l.status = 'dormant'; });
    S.volunteers.forEach(v => { v.available = true; });
    S.requests = []; S.myRequestId = null; S.unlock = null; S.emergency = null; S.mandate = 'none';
    save(); renderAll(); refreshRoute();
    toast(reason || 'Alert ended — pricing restored, listings back to dormant');
  }
  function borrowOptions() {
    const u = S.user, acc = S.user.mobility !== 'walks';
    const fleet = S.fleet.filter(v => v.unlocked && !v.claimedBy).map(v => ({ kind: 'fleet', item: v, d: dist(u, v), accessible: v.accessible }));
    const lst = S.listings.filter(l => l.status === 'active').map(l => ({ kind: 'listing', item: l, d: dist(u, l), accessible: l.accessible }));
    return fleet.concat(lst).sort((a, b) => (acc && (Number(b.accessible) - Number(a.accessible))) || a.d - b.d).slice(0, 6);
  }
  async function unlock(kind, id) {
    if (S.unlock && S.unlock.pending) return;
    if (kind === 'fleet') {
      const v = S.fleet.find(x => x.id === id), op = OPERATORS.find(o => o.id === v.operatorId);
      S.unlock = { kind, id, pending: true }; renderCitizen();
      const res = await MDS.unlockVehicle({ operator: op, vehicle: v, policyId: S.emergency.policyId, log: addLog });
      v.claimedBy = 'me'; S.unlock = { kind, id, code: res.unlock_code, at: Date.now() };
    } else {
      const l = S.listings.find(x => x.id === id); l.status = 'claimed'; l.claimedBy = 'me';
      S.unlock = { kind, id, code: l.unlock || 'Ask the owner', at: Date.now() };
      addLog({ actor: 'pirent', dir: 'in', method: 'POST', url: `https://pirent.app/api/listings/${l.id}/claim`, status: 200, body: { listing_id: l.id, claimed_by: 'resident', alert_policy_id: S.emergency.policyId, owner_notified: true, timestamp: Date.now() } });
    }
    save(); renderAll(); refreshRoute();
  }
  function releaseUnlock() {
    if (!S.unlock) return;
    if (S.unlock.kind === 'fleet') { const v = S.fleet.find(x => x.id === S.unlock.id); if (v) v.claimedBy = null; }
    else { const l = S.listings.find(x => x.id === S.unlock.id); if (l) { l.status = 'active'; l.claimedBy = null; } }
    S.unlock = null; save(); renderAll(); refreshRoute();
  }
  function requestRide() {
    const d = U.rideDraft;
    const req = { id: uid('req'), name: 'You', need: d.need, people: Number(d.people) || 1, note: d.note, priority: NEEDS[d.need].p, createdAt: Date.now(), status: 'queued', volunteerId: null, lat: S.user.lat, lng: S.user.lng, mine: true, source: 'app' };
    S.requests.push(req); S.myRequestId = req.id; matchRequests(); save(); renderAll(); refreshRoute();
  }
  function cancelRequest(id) {
    const req = S.requests.find(r => r.id === id); if (!req) return;
    if (req.volunteerId) { const v = S.volunteers.find(x => x.id === req.volunteerId); if (v) v.available = true; }
    S.requests = S.requests.filter(r => r.id !== id); if (S.myRequestId === id) S.myRequestId = null;
    matchRequests(); save(); renderAll(); refreshRoute();
  }
  function offerSeats() {
    const d = U.seatDraft;
    if (S.myVolunteerId) S.volunteers = S.volunteers.filter(v => v.id !== S.myVolunteerId);
    const vol = { id: uid('vol'), name: 'You', vehicle: d.vehicle, seats: Number(d.seats) || 1, accessible: !!d.accessible, lat: S.user.lat, lng: S.user.lng, available: true, source: 'neighbour' };
    S.volunteers.push(vol); S.myVolunteerId = vol.id; matchRequests(); save(); renderAll();
    toast('Listed as a driver — you will be matched with a neighbour who needs a pick-up');
  }
  function withdrawSeats() {
    S.volunteers = S.volunteers.filter(v => v.id !== S.myVolunteerId);
    S.requests.forEach(r => { if (r.volunteerId === S.myVolunteerId) { r.status = 'queued'; r.volunteerId = null; } });
    S.myVolunteerId = null; matchRequests(); save(); renderAll();
  }
  function addListing() {
    const d = U.lendDraft;
    if (!d.label.trim()) { toast('Give the listing a short description'); return; }
    S.listings.push({ id: uid('l'), owner: 'You', type: d.type, label: d.label.trim(), lat: d.lat ?? S.user.lat, lng: d.lng ?? S.user.lng, accessible: !!d.accessible, unlock: d.unlock.trim() || 'Owner will be notified', contact: d.contact.trim(), status: S.emergency ? 'active' : 'dormant', createdAt: Date.now(), mine: true });
    U.lendDraft = freshUI().lendDraft; saveUI(); save(); renderAll();
    toast(S.emergency ? 'Listing is live — an alert is active' : 'Listed as dormant — invisible until an alert is declared');
  }
  function removeListing(id) { const l = S.listings.find(x => x.id === id); if (l) l.status = 'removed'; save(); renderAll(); }
  /* Snap the drawn waypoints to the street network (walking graph covers streets and pedestrian ways) */
  async function snapWorkDraft() {
    const d = U.workDraft, pts = d.pts || [];
    if (pts.length < 2) { d.coords = pts.slice(); saveUI(); renderGov(); drawMap(); return; }
    d.snapping = true; renderGov();
    const r = await osrm(pts.map(ll), 'foot');
    if (U.workDraft !== d) return;
    d.coords = r && r.coords.length > 1 ? r.coords : pts.slice(); d.snapping = false;
    const m = lineMid(d.coords); d.lat = m.lat; d.lng = m.lng;
    saveUI(); renderGov(); drawMap();
  }
  function editWork(id) {
    const w = S.works.find(x => x.id === id); if (!w) return;
    U.govTab = 'works';
    U.workDraft = { editingId: w.id, name: w.name, type: w.type, note: w.note || '', start: w.start, end: w.end, walk: !!w.affects.walk, bike: !!w.affects.bike, drive: !!w.affects.drive, lat: w.lat, lng: w.lng, pts: w.pts || (w.coords ? [w.coords[0], w.coords[w.coords.length - 1]] : [[w.lat, w.lng]]), coords: w.coords || [] };
    if (w.coords) map.fitBounds(L.latLngBounds(w.coords), Object.assign({ maxZoom: 17 }, fitPad()));
    map.closePopup(); saveUI(); renderGov(); drawMap(); $('#govPanel').scrollTop = 0;
  }
  function extendWork(id, days) {
    const w = S.works.find(x => x.id === id); if (!w) return;
    const d = new Date(w.end + 'T00:00:00'); d.setDate(d.getDate() + days); w.end = d.toISOString().slice(0, 10); w.updatedAt = Date.now();
    map.closePopup(); save(); renderAll(); refreshRoute(); toast(`${w.name}: now until ${fmtDate(w.end)}`);
  }
  function endWorkToday(id) {
    const w = S.works.find(x => x.id === id); if (!w) return;
    w.end = todayISO(-1) < w.start ? w.start : todayISO(-1); w.updatedAt = Date.now();
    save(); renderAll(); refreshRoute(); toast(`${w.name}: marked finished`);
  }
  function addStorm() {
    const d = U.stormDraft, startMs = new Date(d.start).getTime();
    if (!d.name.trim()) { toast('Name the storm'); return; }
    if (isNaN(startMs)) { toast('Set when the storm arrives'); return; }
    const c = d.lat ? { lat: d.lat, lng: d.lng } : { lat: LKP.CITY_CENTER[0], lng: LKP.CITY_CENTER[1] };
    S.storms.push({ id: uid('st'), name: d.name.trim(), wind: Number(d.wind) || 0, gust: Number(d.gust) || 0, from: Number(d.from), radiusKm: Math.max(1, Number(d.radiusKm) || 8), lat: c.lat, lng: c.lng, startMs, endMs: startMs + (Number(d.hours) || 12) * 3600e3, createdAt: Date.now() });
    U.stormDraft = freshUI().stormDraft; saveUI(); save(); renderAll(); refreshRoute();
    toast('Storm published to the citizen map');
  }
  function removeStorm(id) { S.storms = S.storms.filter(s => s.id !== id); save(); renderAll(); refreshRoute(); }
  function addReport(by) {
    const d = U.reportDraft, p = d.lat ? { lat: d.lat, lng: d.lng } : (by === 'city' ? null : { lat: S.user.lat, lng: S.user.lng });
    if (!p) { toast('Place the report on the map first'); return; }
    S.reports.unshift({ id: uid('r'), type: d.type, lat: p.lat, lng: p.lng, note: d.note.trim(), by, status: by === 'city' ? 'confirmed' : 'reported', createdAt: Date.now(), mine: by === 'citizen' });
    U.reportDraft = freshUI().reportDraft; saveUI(); save(); renderAll(); refreshRoute();
    toast(by === 'city' ? 'Report added — routes avoid it' : 'Thank you. The city and your neighbours can see it, and routes avoid it now.');
  }
  function setReportStatus(id, status) { const r = S.reports.find(x => x.id === id); if (!r) return; r.status = status; r.updatedAt = Date.now(); save(); renderAll(); refreshRoute(); }
  function removeReport(id) { S.reports = S.reports.filter(r => r.id !== id); save(); renderAll(); refreshRoute(); }
  function addContrib() {
    const d = U.contribDraft, p = d.lat ? { lat: d.lat, lng: d.lng } : { lat: S.user.lat, lng: S.user.lng };
    if (!d.title.trim()) { toast(d.kind === 'idea' ? 'Give your idea a short title' : 'Describe the issue in a few words'); return; }
    const c = { id: uid('c'), kind: d.kind, cat: d.cat, title: d.title.trim(), note: d.note.trim(), lat: p.lat, lng: p.lng, by: 'citizen', mine: true, status: 'new', votes: 1, votedByMe: true, comments: [], createdAt: Date.now() };
    S.contribs.unshift(c);
    U.contribDraft = Object.assign(freshUI().contribDraft, { kind: d.kind, cat: d.cat });
    saveUI(); save(); openPlace('contrib', c.id); renderAll();
    toast(d.kind === 'idea' ? 'Idea shared with the city and your neighbours' : 'Issue sent to the city. Neighbours can support it too.');
  }
  function toggleVote(id) { const c = S.contribs.find(x => x.id === id); if (!c) return; c.votedByMe = !c.votedByMe; c.votes = Math.max(0, (c.votes || 0) + (c.votedByMe ? 1 : -1)); save(); renderAll(); }
  function addComment(id, by, text) {
    const c = S.contribs.find(x => x.id === id); text = (text || '').trim(); if (!c || !text) return false;
    c.comments.push({ by, text, at: Date.now(), mine: by === 'citizen' });
    if (by === 'city' && c.status === 'new') c.status = 'seen';
    c.updatedAt = Date.now(); save(); return true;
  }
  function setContribStatus(id, status) { const c = S.contribs.find(x => x.id === id); if (!c) return; c.status = status; c.updatedAt = Date.now(); save(); renderAll(); }
  function removeContrib(id) { S.contribs = S.contribs.filter(c => c.id !== id); save(); renderAll(); }
  function addWork() {
    const d = U.workDraft;
    if (!d.name.trim()) { toast('Give the construction site a name'); return; }
    if (!d.coords || d.coords.length < 2) { toast('Draw the street section: click where the works start and where they end'); return; }
    if (!d.start || !d.end || d.end < d.start) { toast('Check the dates: the end must not be before the start'); return; }
    const mid = lineMid(d.coords);
    const rec = { name: d.name.trim(), type: d.type, note: d.note.trim(), coords: d.coords, pts: d.pts, buffer: 12, lat: mid.lat, lng: mid.lng, start: d.start, end: d.end, affects: { walk: !!d.walk, bike: !!d.bike, drive: !!d.drive }, updatedAt: Date.now() };
    const existing = d.editingId && S.works.find(w => w.id === d.editingId);
    if (existing) Object.assign(existing, rec); else S.works.push(Object.assign({ id: uid('w'), mine: true, createdAt: Date.now() }, rec));
    U.workDraft = freshUI().workDraft; setClickMode(null); saveUI(); save(); renderAll(); refreshRoute();
    toast(existing ? 'Changes published — citizens see the new location and dates' : 'Construction site published to the citizen map');
  }
  function removeWork(id) { S.works = S.works.filter(w => w.id !== id); save(); renderAll(); refreshRoute(); }
  function addHazard() {
    const d = U.hazardDraft, t = proto() || U.form.protocol, kind = PROTOCOLS[t].hazard;
    if (!kind) return;
    if (!d.name.trim()) { toast(kind === 'flood' ? 'Name the flooded area' : 'Name the unsafe place'); return; }
    if (!d.lat) { toast('Place it on the map first'); return; }
    S.hazards.push({ id: uid('h'), kind, name: d.name.trim(), lat: d.lat, lng: d.lng, radius: Math.max(30, Number(d.radius) || 150), example: false, createdAt: Date.now() });
    U.hazardDraft = freshUI().hazardDraft; saveUI(); save(); renderAll(); refreshRoute();
    toast(kind === 'flood' ? 'Flooded area published — citizen routes go around it' : 'Unsafe place published — citizen routes avoid it');
  }
  function removeHazard(id) { S.hazards = S.hazards.filter(h => h.id !== id); save(); renderAll(); refreshRoute(); }
  function addCallRequest() {
    const d = U.callDraft; if (!S.emergency) return;
    if (!d.name.trim()) { toast('Who is calling? Add a name or address'); return; }
    S.requests.push({ id: uid('req'), name: d.name.trim(), need: d.need, people: Number(d.people) || 1, note: '', priority: NEEDS[d.need].p, createdAt: Date.now(), status: 'queued', volunteerId: null, lat: d.lat ?? SHELTERS[1].lat, lng: d.lng ?? SHELTERS[1].lng, mine: false, source: 'call' });
    U.callDraft = freshUI().callDraft; matchRequests(); saveUI(); save(); renderAll(); toast('Request added to the dispatch queue');
  }

  /* ---------------- search ---------------- */
  function localSearch(q) {
    q = q.trim().toLowerCase(); if (q.length < 2) return [];
    const hit = s => (s || '').toLowerCase().includes(q), out = [];
    SHELTERS.forEach(s => { if (hit(s.name) || hit(s.address) || hit(s.district)) out.push(placeOf('shelter', s.id)); });
    S.works.forEach(w => { if (workStatus(w) !== 'finished' && (hit(w.name) || hit(w.note))) out.push(placeOf('work', w.id)); });
    POIS.forEach(p => { if (hit(p.name) || hit(p.address)) out.push(placeOf('poi', p.id)); });
    return out.map(p => ({ p, d: dist(S.user, p) })).sort((a, b) => a.d - b.d).slice(0, 8);
  }
  let geoToken = 0;
  async function geocode(q) {
    const token = ++geoToken;
    if (!navigator.onLine || q.trim().length < 3) return;
    U.searching = true; renderCitizen();
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&bounded=1&viewbox=24.50,59.52,24.96,59.35&accept-language=et,en&q=${encodeURIComponent(q)}`;
      const j = await fetch(url).then(r => r.json());
      if (token !== geoToken) return;
      U.searchResults = j.map(x => ({ kind: 'search', id: 'n' + x.place_id, cat: 'address', name: x.name || x.display_name.split(',')[0], address: x.display_name.split(',').slice(1, 4).join(',').trim(), lat: +x.lat, lng: +x.lon }));
    } catch (e) { U.searchResults = []; }
    U.searching = false; saveUI(); renderCitizen();
  }

  /* ---------------- rendering ---------------- */
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 4200); }

  function renderTop() {
    const em = S.emergency, pill = $('#statusPill');
    if (em) { pill.className = 'pill pill-alert'; pill.textContent = `${PROTOCOLS[em.type || 'airstrike'].label} · ${em.district} · until ${timeStr(em.endsAt)}`; } else { pill.className = 'pill'; pill.textContent = 'No alert'; }
    const net = $('#netPill'); net.textContent = 'Offline · cached'; net.hidden = navigator.onLine;
    const cb = $('#contributeBtn'); if (cb) { const n = S.contribs.filter(c => c.status === 'new').length + S.reports.filter(r => r.status === 'reported' && !r.example).length; cb.classList.toggle('active', (U.portal === 'citizen' && U.cview === 'contribute') || (U.portal === 'gov' && U.govTab === 'contrib')); cb.querySelector('.cb-n').textContent = U.portal === 'gov' && n ? n : ''; }
    document.querySelectorAll('.portal-tab').forEach(t => { const on = t.dataset.portal === U.portal; t.classList.toggle('active', on); t.setAttribute('aria-selected', on); });
    $('#app').className = 'portal-' + U.portal;
    document.body.dataset.portal = U.portal;
    document.title = (U.portal === 'gov' ? 'Municipality portal' : 'Citizen portal') + ' · PiMap';
    renderSubtabs();
  }
  function renderSubtabs() {
    const el = $('#subtabs');
    if (U.portal !== 'gov') { el.hidden = true; return; }
    el.hidden = false;
    const em = S.emergency, queued = S.requests.filter(r => r.status === 'queued').length, active = S.works.filter(w => workStatus(w) === 'active').length;
    const newC = S.contribs.filter(c => c.status === 'new').length + S.reports.filter(r => r.status === 'reported' && !r.example).length;
    const extra = { contrib: newC ? `<span class="count red">${newC}</span>` : '', works: `<span class="count">${active}</span>`, crisis: em ? '<span class="dot-red" aria-label="alert active"></span>' : '', dispatch: queued ? `<span class="count red">${queued}</span>` : '', fleet: S.mandate === 'active' ? '<span class="count">on</span>' : '' };
    el.innerHTML = GOV_TABS.map(([k, l]) => `<button class="subtab ${U.govTab === k ? 'active' : ''}" data-gtab="${k}" type="button" role="tab" aria-selected="${U.govTab === k}">${l}${extra[k] || ''}</button>`).join('');
  }

  /* ---- citizen ---- */
  function modeTime(mode, tg) {
    if (mode === U.mode && mode !== 'pickup' && U.routeInfo && U.routeInfo.distance && !U.routeInfo.loading) tg = Object.assign({}, tg, { d: U.routeInfo.distance / 1.25 });
    if (mode === 'walk') return walkMin(tg.d) + ' min';
    if (mode === 'bike') return rideMin(tg.d, 'bicycle') + ' min';
    if (mode === 'drive') return rideMin(tg.d, 'car') + ' min';
    const req = S.requests.find(r => r.id === S.myRequestId);
    if (req && req.status === 'matched') return '~' + (req.eta + rideMin(tg.d, 'car')) + ' min';
    const est = pickupEstimate(); return est ? '~' + est + ' min' : '—';
  }
  const phead = (title, back, sub) => `<div class="phead">${back ? `<button class="icon-btn" data-action="cview" data-view="${back}" type="button" aria-label="Back">${IC.back}</button>` : ''}<div class="ptitle"><b>${title}</b>${sub ? `<span>${sub}</span>` : ''}</div><button class="icon-btn" data-action="cview" data-view="map" type="button" aria-label="Close">${IC.close}</button></div>`;
  function placeRow(p, d) {
    const c = catById(p.cat);
    return `<button class="prow" data-action="place" data-kind="${p.kind}" data-id="${esc(p.id)}" type="button"><span class="picon" style="--c:${c.color}">${svgOf(c)}</span><span class="ptext"><b>${esc(p.name)}</b><span>${esc(p.address || c.label)}</span></span><span class="pdist">${fmtDist(d)}<small>${walkMin(d)} min walk</small></span></button>`;
  }
  function worksRow(w) {
    const st = workStatus(w), d = zoneDist(S.user, workZone(w)), c = catById('works');
    const when = st === 'active' ? `until ${fmtDate(w.end)}` : `from ${fmtDate(w.start)}`;
    const aff = ['walk', 'bike', 'drive'].filter(k => w.affects[k]).map(k => ({ walk: 'pedestrians', bike: 'cyclists', drive: 'cars' })[k]).join(', ');
    return `<button class="prow" data-action="place" data-kind="work" data-id="${w.id}" type="button"><span class="picon" style="--c:${st === 'active' ? c.color : '#9AA5B1'}">${svgOf(c)}</span><span class="ptext"><b>${esc(w.name)}</b><span>${WORK_TYPES[w.type] || w.type} · ${when}${aff ? ' · ' + aff : ''}</span></span><span class="pdist">${fmtDist(d)}<small>${st === 'active' ? daysBetween(todayISO(0), w.end) + ' d left' : 'in ' + daysBetween(todayISO(0), w.start) + ' d'}</small></span></button>`;
  }
  function worksListPanel() {
    const wd2 = w => zoneDist(S.user, workZone(w)), all = S.works.filter(w => workStatus(w) !== 'finished').filter(w => U.worksAll || wd2(w) <= 2000).sort((a, b) => wd2(a) - wd2(b));
    const act = all.filter(w => workStatus(w) === 'active'), up = all.filter(w => workStatus(w) === 'upcoming').sort((a, b) => a.start.localeCompare(b.start));
    const lastUpd = S.works.reduce((m, w) => Math.max(m, w.updatedAt || 0), 0);
    return phead('Construction', null, lastUpd ? `Updated by the city ${ago(lastUpd)}` : 'Updated by the city')
      + `<div class="seg blue" role="group" aria-label="Area"><button class="${U.worksAll ? '' : 'on'}" data-action="works-all" data-v="0" type="button">Within 2 km</button><button class="${U.worksAll ? 'on' : ''}" data-action="works-all" data-v="1" type="button">All of Tallinn</button></div>
      <div class="plabel">Active now · ${act.length}</div><div class="plist">${act.map(worksRow).join('') || '<div class="empty">No active construction here.</div>'}</div>
      <div class="plabel">Starting soon · ${up.length}</div><div class="plist">${up.map(worksRow).join('') || '<div class="empty">Nothing scheduled.</div>'}</div>
      <p class="src">Everyday routes steer around active sites that affect how you travel.</p>`;
  }
  function listPanel() {
    if (U.cat === 'works') return worksListPanel();
    if (U.cat === 'community') {
      const list = S.contribs.filter(c => c.status !== 'declined').sort((a, b) => dist(S.user, a) - dist(S.user, b)).slice(0, 20);
      return phead('Community', null, 'Issues and ideas from residents') + `<button class="btn-y btn-full" data-action="open-contribute" type="button" style="margin:6px 0 4px">+ Contribute</button><div class="plist">${list.map(contribRow).join('') || '<div class="empty">Nothing yet. Be the first.</div>'}</div>`;
    }
    const c = catById(U.cat), items = nearby(U.cat, 15);
    const src = U.cat === 'shelter' ? `Official public shelters · Päästeamet register, ${LKP.SHELTER_SOURCE.date}` : U.cat === 'works' ? 'Registered by the municipality' : '© OpenStreetMap contributors';
    return phead(`${c.label} near you`, null, `${items.length} closest`) + `<div class="plist">${items.map(({ p, d }) => placeRow(p, d)).join('') || '<div class="empty">Nothing found nearby.</div>'}</div><p class="src">${src}</p>`;
  }
  function searchPanel() {
    const q = U.query.trim(), ql = q.toLowerCase();
    const cats = q ? CATS.filter(c => c.label.toLowerCase().includes(ql)) : [];
    const local = localSearch(q), remote = (U.searchResults || []).map(p => ({ p, d: dist(S.user, p) }));
    const rows = cats.map(c => `<button class="prow" data-action="cat" data-cat="${c.id}" type="button"><span class="picon" style="--c:${c.color}">${svgOf(c)}</span><span class="ptext"><b>${c.label}</b><span>Show on map</span></span></button>`).join('')
      + local.map(({ p, d }) => placeRow(p, d)).join('')
      + (remote.length ? `<div class="plabel">Addresses</div>${remote.map(({ p, d }) => placeRow(p, d)).join('')}` : '');
    return `<div class="plist">${rows || `<div class="empty">${U.searching ? 'Searching addresses…' : q.length < 2 ? 'Type a place, shelter or address.' : 'No places found. Press Enter to search addresses.'}</div>`}</div>${!remote.length && q.length >= 3 && !U.searching ? '<button class="linkbtn" data-action="search-go" type="button">Search addresses in Tallinn</button>' : ''}`;
  }
  function placePanel() {
    const p = U.dest && placeOf(U.dest.kind, U.dest.id); if (!p) return '';
    const c = catById(p.cat), d = dist(S.user, p);
    let extra = '';
    if (p.kind === 'shelter') extra = `<p class="muted">Public shelter, marked with the civil defence sign (blue triangle on orange). Päästeamet register, ${LKP.SHELTER_SOURCE.date}.</p>`;
    if (p.kind === 'poi') extra = `${p.hours ? `<div class="kv"><span>Opening hours</span><b>${esc(p.hours)}</b></div>` : ''}${p.wheelchair ? `<div class="kv"><span>Wheelchair access</span><b>${esc(p.wheelchair)}</b></div>` : ''}${p.cat === 'cool' ? `<p class="muted">${p.sub === 'library' ? 'Public library' : 'Shopping centre'}: an indoor place to cool down during a heatwave or wait out a storm.</p>` : ''}<p class="src">© OpenStreetMap contributors</p>`;
    if (p.kind === 'report') { const r = p.report; extra = `<div class="kv"><span>Status</span><b>${r.status === 'reported' ? 'Reported, not yet confirmed' : r.status === 'confirmed' ? 'Confirmed by the city' : 'Cleared'}</b></div><div class="kv"><span>Reported by</span><b>${r.by === 'city' ? 'City crew' : r.mine ? 'You' : 'A neighbour'} · ${ago(r.createdAt)}</b></div><p class="muted">Routes keep ${REPORT_TYPES[r.type].radius} m away until the city clears it.</p>`; }
    if (p.kind === 'work') { const w = p.work, st = workStatus(w); extra = `<div class="kv"><span>Status</span><b>${st === 'active' ? `Active · ${daysBetween(todayISO(0), w.end)} days left` : st === 'upcoming' ? `Starts in ${daysBetween(todayISO(0), w.start)} days` : 'Finished'}</b></div><div class="kv"><span>Dates</span><b>${fmtDate(w.start)} – ${fmtDate(w.end)}</b></div>${w.coords ? `<div class="kv"><span>Street section</span><b>${Math.round(lineLen(w.coords))} m</b></div>` : ''}<div class="kv"><span>Last updated</span><b>${w.updatedAt ? new Date(w.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'} · Tallinna Linnavalitsus</b></div><div class="kv"><span>Affects</span><b>${['walk', 'bike', 'drive'].filter(k => w.affects[k]).map(k => ({ walk: 'Pedestrians', bike: 'Cyclists', drive: 'Cars' })[k]).join(', ') || '—'}</b></div>${w.note ? `<p>${esc(w.note)}</p>` : ''}<p class="src">Registered by the municipality</p>`; }
    if (p.kind === 'search') extra = `<p class="src">Address search © OpenStreetMap contributors (Nominatim)</p>`;
    const back = U.cat ? 'list' : (U.query ? 'search' : null);
    if (p.kind === 'contrib') return phead(p.contrib.kind === 'idea' ? 'Idea' : 'Issue', U.cat === 'community' ? 'list' : 'contribute') + contribDetail(p);
    if (p.kind === 'report') return phead('Storm report', back) + `<div class="place"><h3>${esc(p.name)}</h3><p class="addr">${esc(p.address)}</p><p class="muted">${fmtDist(d)} away</p>${extra}</div>`;
    return phead(c.label, back) + `<div class="place"><h3>${esc(p.name)}</h3><p class="addr">${esc(p.address)}</p><p class="muted">${fmtDist(d)} away · ${walkMin(d)} min walk</p>
      <div class="row">${p.kind !== 'work' ? `<button class="btn-y" data-action="directions" type="button">${IC.dir} Directions</button>` : ''}${p.kind !== 'shelter' ? `<button class="btn-y-outline" data-action="directions" data-nearest="1" type="button">Nearest ${S.emergency ? P().destLabel : 'shelter'}</button>` : ''}</div>${extra}</div>`;
  }
  function protoBox() {
    const t = proto(); if (!t) return '';
    const pr = PROTOCOLS[t], ri = U.routeInfo || {};
    if (ri.loading) return `<div class="proto-box ${t}"><div class="pb-head">${PROTO_IC[t]}<b>${pr.label}</b></div><p class="loading">${pr.routing === 'shade' ? 'Finding the shadiest route…' : pr.routing === 'safe' ? 'Checking trees, shoreline and unsafe places…' : pr.hazard ? 'Routing around flooded areas…' : 'Finding your route…'}</p></div>`;
    let body = '';
    if (pr.hazard) {
      if (ri.avoided && ri.avoided.length) body += `<p class="ok">Avoids ${ri.avoided.length} ${pr.hazard === 'flood' ? 'flooded area' : 'unsafe place'}${ri.avoided.length > 1 ? 's' : ''}: ${esc(ri.avoided.join(', '))}${ri.extra > 20 ? ` (+${fmtDist(ri.extra)})` : ''}.</p>`;
      if (ri.blocked && ri.blocked.length) body += `<p class="bad">No safe way around ${esc(ri.blocked.join(', '))}. ${pr.hazard === 'flood' ? 'Do not enter the water. Go to an upper floor and request a pick-up.' : 'Wait indoors if you can, or request a pick-up.'}</p>`;
      if (!(ri.avoided || []).length && !(ri.blocked || []).length) body += `<p class="ok">Your route does not cross any ${pr.hazard === 'flood' ? 'flooded area' : 'marked unsafe place'}.</p>`;
    }
    if (pr.routing === 'shade' && ri.shade != null) {
      const pct = Math.round(ri.shade * 100), basePct = Math.round((ri.baseShade || 0) * 100);
      body += `<div class="meter"><span style="width:${pct}%"></span></div><p><b>${pct}% of the route is in shade</b>${pct > basePct + 2 ? `, versus ${basePct}% on the fastest route` : ''}. Green is shade from buildings and trees, orange is direct sun.</p>`;
      if (ri.sun) body += `<p class="muted">Sun from the ${compass(ri.sun.az)}, ${Math.round(ri.sun.el)}° above the horizon at ${timeStr(ri.when || Date.now())}.${ri.sun.el < 3 ? ' The sun is down, so the whole route is shaded.' : ri.sun.el < 20 ? ' Low sun casts long shadows.' : ''}</p>`;
      body += `<div class="seg" role="group" aria-label="Plan shade for"><span>Shade at</span>${[[null, 'Now'], [12, '12:00'], [14, '14:00'], [16, '16:00'], [18, '18:00']].map(([h, l]) => `<button class="${U.sunHour === h ? 'on' : ''}" data-action="sunhour" data-h="${h == null ? '' : h}" type="button">${l}</button>`).join('')}</div>`;
      body += `<p class="muted">${(ri.water || []).length ? `${ri.water.length} drinking water point${ri.water.length > 1 ? 's' : ''} on the way, marked on the map.` : 'No public drinking water on this route. Carry water.'}</p>`;
    }
    if (t === 'storm') {
      const near = S.storms.filter(s => stormStatus(s) !== 'passed').sort((a, b) => dist(S.user, a) - dist(S.user, b))[0];
      if (near) body = `<p><b>${esc(near.name)}</b>: wind ${near.wind} m/s, gusts up to ${near.gust} m/s from the ${dirName(near.from)}, ${stormStatus(near) === 'active' ? 'until ' + timeStr(near.endMs) : 'from ' + timeStr(near.startMs)}.${near.gust >= 25 ? ' Routes keep extra distance from trees and the shoreline.' : ''}</p>` + body;
      const nRep = reportsShown().length;
      body += `<p class="muted">${nRep} fallen tree${nRep === 1 ? '' : 's'} and branch reports on the map. <button class="linkbtn inline" data-action="open-contribute" data-k="tree" type="button">Report one</button></p>`;
    }
    if (pr.routing === 'safe' && ri.exposure != null) {
      const pct = Math.round(ri.exposure * 100), basePct = Math.round((ri.baseExposure || 0) * 100);
      body += `<div class="meter risk"><span style="width:${pct}%"></span></div><p><b>${pct}% of the route is exposed</b>${basePct > pct + 2 ? `, down from ${basePct}% on the fastest route` : ''}. Red marks stretches under trees, by the shoreline or next to construction.</p>`;
    }
    if (ri.note) body += `<p class="muted">${esc(ri.note)}</p>`;
    if (t !== 'storm') body += `<p class="muted">See flooding, a blocked way or another danger? <button class="linkbtn inline" data-action="open-contribute" data-k="tree" type="button">Report it</button></p>`;
    return `<div class="proto-box ${t}"><div class="pb-head">${PROTO_IC[t]}<b>${pr.label}</b></div>${body}<ul class="tips">${pr.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
  }
  function directionsPanel() {
    const tg = target(), c = catById(tg.s.cat);
    const modes = `<div class="modes" role="tablist" aria-label="How to get there">${MODES.map(m => `<button class="mode ${U.mode === m ? 'active' : ''}" role="tab" aria-selected="${U.mode === m}" data-action="mode" data-mode="${m}" type="button">${MODE_IC[m]}<span class="time">${modeTime(m, tg)}</span><span class="lbl">${MODE_LABEL[m]}</span></button>`).join('')}</div>`;
    return `<div class="dir-head">
        <button class="icon-btn" data-action="close-dir" type="button" aria-label="Close directions">${IC.back}</button>
        <div class="dir-route"><div class="dir-row"><span class="rdot you"></span><span>Your location</span></div><div class="dir-line"></div><div class="dir-row"><span class="rdot to" style="--c:${c.color}"></span><b>${esc(tg.s.name)}</b></div></div>
      </div>${U.dest ? '' : `<p class="dir-note">Nearest ${S.emergency ? P().destLabel : 'public shelter'} · ${esc(tg.s.address)}</p>`}${modes}${protoBox()}${everydayBox()}${modeSheet(tg)}`;
  }
  function everydayBox() {
    if (proto()) return '';
    const ri = U.routeInfo || {};
    if (ri.loading) return '<div class="info-box"><p class="loading">Checking construction and blocked paths…</p></div>';
    if (!(ri.avoided || []).length) return '';
    return `<div class="info-box"><p class="ok"><b>Avoids ${ri.avoided.length === 1 ? 'a blocked stretch' : ri.avoided.length + ' blocked stretches'}:</b> ${esc(ri.avoided.join(', '))}${ri.extra > 20 ? ` (+${fmtDist(ri.extra)})` : ''}.</p></div>`;
  }
  function worksWarning() {
    const hits = S.works.filter(w => U.conflicts.includes(w.id));
    if (!hits.length) return '';
    return `<div class="warn work"><b>Construction on this route</b>${hits.map(w => `<div>${esc(w.name)} · ${WORK_TYPES[w.type] || w.type} until ${fmtDate(w.end)}${w.note ? ' — ' + esc(w.note) : ''}</div>`).join('')}</div>`;
  }
  function modeSheet(tg) {
    const s = tg.s, d = (U.routeInfo && U.routeInfo.distance) ? U.routeInfo.distance / 1.25 : tg.d, em = S.emergency, mob = S.user.mobility;
    const ww = worksWarning(), isShelter = s.cat === 'shelter';
    if (U.mode === 'walk') {
      const wm = walkMin(d), long = wm > 20 || mob !== 'walks';
      return `<div class="sheet"><div class="big-time">${wm} min<small>${fmtDist(d * 1.25)} · at your pace</small></div>
        ${ww}<p>${isShelter ? 'Look for the civil defence sign: a blue triangle on an orange background.' : 'Walking route on the map.'} Route and destination are stored on this device and work without signal.</p>
        ${long ? `<div class="warn">This is a long way at your pace${mob === 'wheelchair' ? ' on a mobility aid' : ''}. Bike or pick-up gets you there faster.<div class="row"><button class="btn-y-outline" data-action="mode" data-mode="bike" type="button">Bike</button><button class="btn-y-outline" data-action="mode" data-mode="pickup" type="button">Request pick-up</button></div></div>` : ''}</div>`;
    }
    if (U.mode === 'drive') {
      const mine = S.volunteers.find(v => v.id === S.myVolunteerId), carried = mine && S.requests.find(r => r.volunteerId === mine.id), sd = U.seatDraft;
      return `<div class="sheet"><div class="big-time">${rideMin(d, 'car')} min<small>${fmtDist(d * 1.25)} · by car</small></div>
        ${ww}<p>Park at least 50 m from the entrance and keep access lanes clear.${proto() === 'flood' ? ' Never drive into water: 30 cm can float a car.' : ''}</p>
        ${!em ? '<p class="muted">During an alert you can offer spare seats here and be matched with a neighbour who cannot walk.</p>'
          : mine ? `<div class="matched"><b>You are listed as a driver</b>${esc(VEHICLE_LABELS[mine.vehicle])} · ${mine.seats} spare seat${mine.seats > 1 ? 's' : ''}${mine.accessible ? ' · accessible' : ''}
              ${carried ? `<div style="margin-top:6px">Pick up <b>${esc(carried.name)}</b>${NEEDS[carried.need].label} · ${carried.people} pers. · ${fmtDist(dist(mine, carried))} away</div>` : '<div class="small" style="margin-top:6px">No one nearby needs a lift yet. We will ping you.</div>'}
              <div class="row" style="margin-top:8px"><button class="btn-y-outline" data-action="withdraw-seats" type="button">Withdraw</button></div></div>`
          : `<div class="warn">Have spare seats? Neighbours who cannot walk are waiting.</div>
            <div class="grid2"><div class="field"><label>Vehicle</label><select data-draft="seatDraft.vehicle">${['car', 'van', 'cargo', 'etricycle'].map(v => `<option value="${v}" ${sd.vehicle === v ? 'selected' : ''}>${VEHICLE_LABELS[v]}</option>`).join('')}</select></div>
            <div class="field"><label>Spare seats</label><input type="number" min="1" max="8" value="${sd.seats}" data-draft="seatDraft.seats"></div></div>
            <label class="check"><input type="checkbox" ${sd.accessible ? 'checked' : ''} data-draft="seatDraft.accessible"> Can take a wheelchair or mobility aid</label>
            <button class="btn-y btn-full" data-action="offer-seats" type="button">Offer my seats</button>`}</div>`;
    }
    if (U.mode === 'bike') {
      const un = S.unlock;
      if (un && un.pending) return `<div class="sheet"><h4>Unlocking…</h4><p>Sending the unlock event under the Emergency Unlock Mandate.</p></div>`;
      if (un && un.code) {
        const isF = un.kind === 'fleet', item = isF ? S.fleet.find(x => x.id === un.id) : S.listings.find(x => x.id === un.id), op = isF ? OPERATORS.find(o => o.id === item.operatorId) : null;
        return `<div class="sheet"><div class="big-time">${walkMin(dist(S.user, item)) + rideMin(dist(item, s), item.type)} min<small>${fmtDist(dist(S.user, item))} to the vehicle, then ride</small></div>
          <div class="matched"><b>${esc(isF ? VEHICLE_LABELS[item.type] : item.label)}</b>${isF ? `${op.name} · ${item.id} · fare €0 under the mandate` : `Listed by ${esc(item.owner)} · ${esc(item.contact)}`}<div style="margin-top:8px">${isF ? 'Unlock code' : 'How to get it'}</div><div class="code">${esc(un.code)}</div></div>
          <p style="margin-top:10px">End your trip at your destination.</p><button class="btn-y-outline" data-action="release" type="button">Release and choose another</button></div>`;
      }
      const opts = em ? borrowOptions() : [];
      return `<div class="sheet"><div class="big-time">${rideMin(d, 'bicycle')} min<small>${fmtDist(d * 1.25)} · your own bike or scooter</small></div>
        ${ww}${proto() === 'storm' ? '<div class="warn">Strong wind: riding is not recommended. Walk if you can.</div>' : ''}
        <p>No bike? ${em ? (S.mandate === 'active' ? 'Shared vehicles near shelters are free under the Emergency Unlock Mandate, and neighbours’ listings are active.' : 'Neighbours’ listings are active. Shared fleets unlock when the city publishes the mandate.') : 'During an alert shared vehicles unlock for free and neighbours’ spare bikes appear here.'}</p>
        ${em ? (opts.length ? `<h4>Free near you</h4>${opts.map(o => { const it = o.item, isF = o.kind === 'fleet'; return `<div class="opt"><div><b>${esc(isF ? VEHICLE_LABELS[it.type] : it.label)}</b>${o.accessible ? ' <span class="tag tag-y">accessible</span>' : ''}<span class="meta">${isF ? `${OPERATORS.find(x => x.id === it.operatorId).name} · battery ${it.battery}% · €0` : `${VEHICLE_LABELS[it.type] || it.type} · ${esc(it.owner)}, neighbour`} · ${fmtDist(o.d)} away</span></div><button class="btn-y" data-action="unlock" data-kind="${o.kind}" data-id="${it.id}" type="button">${isF ? 'Unlock' : 'Borrow'}</button></div>`; }).join('')}` : '<p class="muted">Nothing free within reach right now. Try pick-up.</p>') : ''}</div>`;
    }
    const req = S.requests.find(r => r.id === S.myRequestId), rd = U.rideDraft;
    if (!em) return `<div class="sheet"><div class="big-time">—<small>pick-up runs during an alert</small></div><p>When an alert is declared, neighbours with spare seats and Pinge crews pick up residents who cannot get there on their own. People who cannot walk go first.</p></div>`;
    if (req && req.status === 'matched') {
      const v = S.volunteers.find(x => x.id === req.volunteerId);
      return `<div class="sheet"><div class="big-time">~${req.eta} min<small>until pick-up</small></div>
        <div class="matched"><b>${esc(v.name)} is coming</b>${esc(VEHICLE_LABELS[v.vehicle])} · ${v.seats} seats${v.accessible ? ' · accessible' : ''} · ${v.source === 'pinge' ? 'Pinge crew' : 'neighbour'}<div style="margin-top:6px">${fmtDist(dist(v, S.user))} away · then ${rideMin(d, 'car')} min to ${esc(s.name)}</div></div>
        <p style="margin-top:10px">Wait at your door. The driver sees your need (${NEEDS[req.need].label.toLowerCase()}) and party of ${req.people}.</p>
        <button class="btn-y-outline" data-action="cancel-ride" data-id="${req.id}" type="button">Cancel request</button></div>`;
    }
    if (req) return `<div class="sheet"><div class="big-time">Queued<small>position ${req.position}</small></div>
      <p>Priority ${req.priority}/100 (${NEEDS[req.need].label.toLowerCase()}). All nearby drivers are busy; the next free neighbour or Pinge crew is dispatched to you.</p>
      <button class="btn-y-outline" data-action="cancel-ride" data-id="${req.id}" type="button">Cancel request</button></div>`;
    const est = pickupEstimate();
    return `<div class="sheet"><div class="big-time">${est ? '~' + est + ' min' : '—'}<small>${est ? 'estimated door to destination' : 'no free driver right now'}</small></div>
      ${ww}<p>Matched to the nearest neighbour or Pinge crew with room. People who cannot walk go first.</p>
      <div class="field"><label>Your need</label><select data-draft="rideDraft.need">${Object.entries(NEEDS).map(([k, v]) => `<option value="${k}" ${rd.need === k ? 'selected' : ''}>${v.label}</option>`).join('')}</select></div>
      <div class="grid2"><div class="field"><label>People</label><input type="number" min="1" max="8" value="${rd.people}" data-draft="rideDraft.people"></div>
      <div class="field"><label>Note for the driver</label><input type="text" placeholder="3rd floor, no lift" value="${esc(rd.note)}" data-draft="rideDraft.note"></div></div>
      <button class="btn-y btn-full" data-action="request-ride" type="button">Request pick-up</button></div>`;
  }
  function menuPanel() {
    return phead('Menu') + `<div class="menu">
      <button class="mitem" data-action="cview" data-view="settings" type="button">${IC.user}<span><b>About you</b><small>${MOBILITY[S.user.mobility]}</small></span></button>
      <button class="mitem" data-action="cview" data-view="lend" type="button">${IC.bike}<span><b>Lend a vehicle</b><small>Pre-list a spare bike or mobility aid for emergencies</small></span></button>
      <button class="mitem" data-action="open-contribute" type="button">${svgOf(catById('community'))}<span><b>Contribute</b><small>Report an issue or share an idea with the city${proto() === 'storm' ? ', or report a fallen tree' : ''}</small></span></button>
      <button class="mitem" data-action="cview" data-view="ready" type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"/></svg><span><b>Be ready</b><small>Home supplies and what to do in each emergency</small></span></button>
      <button class="mitem" data-action="geolocate" type="button">${IC.gps}<span><b>Use my location</b><small>From your device's GPS</small></span></button>
      <button class="mitem" data-action="pick-user" type="button">${IC.pin}<span><b>Set my location on the map</b><small>Demo: simulate a resident somewhere else</small></span></button>
    </div><p class="src">Shelters: Päästeamet public shelter register (${LKP.SHELTER_SOURCE.date}). Places and routing: © OpenStreetMap contributors. Construction and hazard zones: the municipality.</p>`;
  }
  function settingsPanel() {
    const u = S.user;
    return phead('About you', 'menu') + `<div class="sheet flat">
      <div class="field"><label>Mobility</label><select data-action="mobility">${Object.entries(MOBILITY).map(([k, v]) => `<option value="${k}" ${u.mobility === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      <p class="muted">${needsAccessible() ? 'Accessible vehicles are offered first and your pick-up requests get top priority. The public shelter register does not record step-free access yet.' : 'Walking times use your pace, and pick-ups are prioritised for people who cannot walk.'}</p>
      <div class="row between"><span class="small">Location ${u.lat.toFixed(4)}, ${u.lng.toFixed(4)}</span><span class="row"><button class="btn-dark" data-action="geolocate" type="button">Use GPS</button><button class="btn-dark" data-action="pick-user" type="button">Pick on map</button></span></div></div>`;
  }
  function lendPanel() {
    const d = U.lendDraft, em = S.emergency, mine = S.listings.filter(l => l.mine && l.status !== 'removed');
    const badge = l => l.status === 'dormant' ? '<span class="tag tag-dark">dormant</span>' : l.status === 'active' ? '<span class="tag tag-y">active</span>' : '<span class="tag tag-dark">claimed</span>';
    return phead('Lend a vehicle', 'menu', 'Pirent dormant listing') + `<div class="sheet flat">
      <p>List a spare bike, scooter or mobility aid once. It stays invisible until an alert is declared; then neighbours see it under Bike with your instructions.</p>
      <div class="field"><label>What is it?</label><select data-draft="lendDraft.type">${LEND_TYPES.map(t => `<option value="${t}" ${d.type === t ? 'selected' : ''}>${VEHICLE_LABELS[t]}</option>`).join('')}</select></div>
      <div class="field"><label>Short description</label><input type="text" placeholder="e.g. Red city bike, kids' seat" value="${esc(d.label)}" data-draft="lendDraft.label"></div>
      <div class="field"><label>How does a neighbour get it?</label><input type="text" placeholder="e.g. Combination lock — code sent on activation" value="${esc(d.unlock)}" data-draft="lendDraft.unlock"></div>
      <div class="field"><label>Where</label><input type="text" placeholder="e.g. Yard of Soo 12" value="${esc(d.contact)}" data-draft="lendDraft.contact"></div>
      <label class="check"><input type="checkbox" ${d.accessible ? 'checked' : ''} data-draft="lendDraft.accessible"> Suitable for someone who cannot walk</label>
      <div class="row between" style="margin-bottom:10px"><span class="small">Pin: ${d.lat ? d.lat.toFixed(4) + ', ' + d.lng.toFixed(4) : 'your location'}</span><span class="row"><button class="btn-dark" data-action="pick-listing" type="button">Pick on map</button>${d.lat ? '<button class="btn-dark" data-action="clear-pin" type="button">Clear</button>' : ''}</span></div>
      <button class="btn-y btn-full" data-action="add-listing" type="button">${em ? 'List now (alert active)' : 'Pre-list as dormant'}</button>
      ${mine.length ? `<h4 style="margin-top:14px">Your listings</h4>${mine.map(l => `<div class="lst"><div><b>${esc(l.label)}</b><span class="meta">${VEHICLE_LABELS[l.type]} · ${esc(l.unlock)}</span></div><span class="row">${badge(l)}<button class="btn-dark" data-action="remove-listing" data-id="${l.id}" type="button">Remove</button></span></div>`).join('')}` : ''}</div>`;
  }
  function contribRow(c) {
    const K = CONTRIB[c.kind], d = dist(S.user, c);
    return `<button class="prow" data-action="place" data-kind="contrib" data-id="${c.id}" type="button"><span class="picon" style="--c:${K.color}">${svgOf(K)}</span><span class="ptext"><b>${esc(c.title)}</b><span>${K.cats[c.cat]} · ${CSTATUS[c.status]}${c.comments.length ? ` · ${c.comments.length} comment${c.comments.length > 1 ? 's' : ''}` : ''}</span></span><span class="pdist">▲ ${c.votes}<small>${fmtDist(d)}</small></span></button>`;
  }
  function contributePanel() {
    const d = U.contribDraft, em = S.emergency, storm = proto() === 'storm';
    if (em && !emergencyTypes().includes(U.reportDraft.type)) U.reportDraft.type = emergencyTypes()[0];
    const kinds = (em ? [['tree', storm ? 'Fallen tree' : 'Emergency report']] : []).concat([['issue', 'Report an issue'], ['idea', 'Share an idea']]);
    const tabs = `<div class="ktabs" role="tablist">${kinds.map(([k, l]) => `<button class="ktab ${d.kind === k ? 'on' : ''} ${k}" data-action="contrib-kind" data-k="${k}" type="button" role="tab" aria-selected="${d.kind === k}">${svgOf(k === 'tree' ? (storm ? REPORT_TYPES.fallen_tree : REPORT_TYPES.danger) : CONTRIB[k])}<span>${l}</span></button>`).join('')}</div>`;
    const near = S.contribs.filter(c => c.status !== 'declined' && dist(S.user, c) <= 1500).sort((a, b) => b.votes - a.votes).slice(0, 5);
    let form;
    if (d.kind === 'tree') {
      const r = U.reportDraft;
      form = `<div class="rtypes" role="radiogroup" aria-label="What did you see?">${emergencyTypes().map(k => [k, REPORT_TYPES[k]]).map(([k, t]) => `<button class="rtype ${r.type === k ? 'on' : ''}" data-action="report-type" data-t="${k}" type="button" role="radio" aria-checked="${r.type === k}"><span class="picon" style="--c:${t.color}">${svgOf(t)}</span><b>${t.label}</b><small>${t.hint}</small></button>`).join('')}</div>
        <div class="field"><label>Details (optional)</label><input type="text" placeholder="e.g. Birch across the pavement by the tram stop" value="${esc(r.note)}" data-draft="reportDraft.note"></div>
        <div class="row between" style="margin-bottom:10px"><span class="small">${r.lat ? 'Pinned on the map' : 'At your current location'}</span><button class="btn-dark" data-action="pick-report" type="button">${r.lat ? 'Move pin' : 'Pick on map'}</button></div>
        <button class="btn-y btn-full" data-action="submit-report" type="button">Send emergency report</button>
        <p class="muted" style="margin-top:8px">Routes for everyone avoid it straight away, and the city sees it under Citizen contributions.</p>`;
    } else {
      const K = CONTRIB[d.kind];
      form = `<div class="ccats">${Object.entries(K.cats).map(([k, l]) => `<button class="ccat ${d.cat === k ? 'on' : ''}" data-action="contrib-cat" data-c="${k}" type="button" style="--c:${K.color}">${l}</button>`).join('')}</div>
        <div class="field"><label>${d.kind === 'idea' ? 'Your idea' : 'What is wrong?'}</label><input type="text" maxlength="90" placeholder="${d.kind === 'idea' ? 'e.g. Bike racks by the Balti jaam market' : 'e.g. Deep pothole on the cycle path'}" value="${esc(d.title)}" data-draft="contribDraft.title"></div>
        <div class="field"><label>Details (optional)</label><textarea rows="2" placeholder="${d.kind === 'idea' ? 'Why would it help, and who?' : 'Where exactly, and since when?'}" data-draft="contribDraft.note">${esc(d.note)}</textarea></div>
        <div class="row between" style="margin-bottom:10px"><span class="small">${d.lat ? 'Pinned on the map' : 'At your current location'}</span><button class="btn-dark" data-action="pick-contrib" type="button">${d.lat ? 'Move pin' : 'Pick on map'}</button></div>
        <button class="btn-y btn-full" data-action="add-contrib" type="button">${d.kind === 'idea' ? 'Share idea' : 'Send to the city'}</button>
        <p class="muted" style="margin-top:8px">Visible to the city and your neighbours. Neighbours can support it and comment; the city updates its status.</p>`;
    }
    return phead('Contribute', null, em ? `${PROTOCOLS[em.type].label} alert: your reports help everyone route safely` : 'Improve the city with the municipality and your neighbours')
      + `<div class="sheet flat">${tabs}${form}</div>`
      + (near.length ? `<div class="plabel">Near you · most supported</div><div class="plist">${near.map(contribRow).join('')}</div>` : '');
  }
  function contribDetail(p) {
    const c = p.contrib, K = CONTRIB[c.kind], d = dist(S.user, c);
    const who = c.by === 'city' ? 'Tallinna Linnavalitsus' : c.mine ? 'You' : 'A neighbour';
    return `<div class="place"><div class="ctag" style="--c:${K.color}">${svgOf(K)}${K.label} · ${K.cats[c.cat]}</div><h3>${esc(c.title)}</h3>${c.note ? `<p class="addr">${esc(c.note)}</p>` : ''}
      <p class="muted">${who} · ${ago(c.createdAt)} · ${fmtDist(d)} away</p>
      <div class="cstatus s-${c.status}">${CSTATUS[c.status]}</div>
      <div class="row" style="margin:12px 0"><button class="btn-vote ${c.votedByMe ? 'on' : ''}" data-action="vote" data-id="${c.id}" type="button" aria-pressed="${!!c.votedByMe}">▲ ${c.votedByMe ? 'Supported' : 'Support'} · ${c.votes}</button><button class="btn-y-outline" data-action="directions" type="button">Directions</button></div>
      <div class="plabel">Comments · ${c.comments.length}</div>
      <div class="comments">${c.comments.map(m => `<div class="cmt ${m.by === 'city' ? 'city' : ''}"><b>${m.by === 'city' ? 'Tallinna Linnavalitsus' : m.mine ? 'You' : 'Neighbour'}</b><span>${ago(m.at)}</span><p>${esc(m.text)}</p></div>`).join('') || '<p class="muted">No comments yet.</p>'}</div>
      <div class="cform"><input type="text" placeholder="Add a comment" value="${esc(U.commentDraft)}" data-draft-plain="commentDraft" aria-label="Add a comment"><button class="btn-y" data-action="comment" data-id="${c.id}" type="button">Post</button></div></div>`;
  }
  function reportPanel() {
    const d = U.reportDraft, mine = S.reports.filter(r => r.mine);
    return phead('Report a fallen tree', null, 'Seen by the city and your neighbours') + `<div class="sheet flat">
      <div class="rtypes" role="radiogroup" aria-label="What did you see?">${Object.entries(REPORT_TYPES).map(([k, r]) => `<button class="rtype ${d.type === k ? 'on' : ''}" data-action="report-type" data-t="${k}" type="button" role="radio" aria-checked="${d.type === k}"><span class="picon" style="--c:${r.color}">${svgOf(r)}</span><b>${r.label}</b><small>${r.hint}</small></button>`).join('')}</div>
      <div class="field"><label>Details (optional)</label><input type="text" placeholder="e.g. Birch across the pavement by the tram stop" value="${esc(d.note)}" data-draft="reportDraft.note"></div>
      <div class="row between" style="margin-bottom:10px"><span class="small">${d.lat ? 'Pinned on the map' : 'At your current location'}</span><button class="btn-dark" data-action="pick-report" type="button">${d.lat ? 'Move pin' : 'Pick on map'}</button></div>
      <button class="btn-y btn-full" data-action="submit-report" type="button">Send report</button>
      <p class="muted" style="margin-top:8px">Routes for everyone avoid it straight away. The city confirms it and marks it cleared when it is removed.</p>
      ${mine.length ? `<h4>Your reports</h4>${mine.map(r => `<div class="lst"><div><b>${REPORT_TYPES[r.type].label}</b><span class="meta">${esc(r.note || '')}${r.note ? ' · ' : ''}${ago(r.createdAt)}</span></div><span class="tag ${r.status === 'cleared' ? 'tag-dark' : 'tag-y'}">${r.status}</span></div>`).join('')}` : ''}</div>`;
  }
  function wheretoPanel() {
    const picks = [['pharmacy', 'pharmacy'], ['grocery', 'grocery store'], ['hospital', 'hospital'], ['shelter', 'public shelter'], ['water', 'drinking water'], ['cool', 'library or shopping centre']]
      .map(([cat, noun]) => { const n = nearby(cat, 1)[0]; return n && { cat, noun, p: n.p, d: n.d }; }).filter(Boolean);
    return phead('Where to?', null, 'Search above, or pick one of these') + `<div class="plist">${picks.map(q => { const c = catById(q.cat); return `<button class="prow" data-action="go" data-kind="${q.p.kind}" data-id="${esc(q.p.id)}" type="button"><span class="picon" style="--c:${c.color}">${svgOf(c)}</span><span class="ptext"><b>Nearest ${q.noun}</b><span>${esc(q.p.name)}</span></span><span class="pdist">${fmtDist(q.d)}<small>${walkMin(q.d)} min walk</small></span></button>`; }).join('')}</div>`;
  }
  function readyPanel() {
    return phead('Be ready', 'menu', 'What to do before and during an emergency') + `<div class="sheet flat">
      <p>Päästeamet advises every household to keep supplies for at least a week.</p>
      <ul class="tips big"><li>Drinking water: about 3 litres per person per day</li><li>Food that keeps and needs no cooking</li><li>Prescription medicines and a first-aid kit</li><li>Torch, spare batteries, power bank and a battery radio</li><li>Some cash and copies of documents</li></ul>
      ${Object.entries(PROTOCOLS).map(([k, p]) => `<div class="proto-box ${k}" style="margin-top:10px"><div class="pb-head">${PROTO_IC[k]}<b>${p.label}</b></div><ul class="tips">${p.tips.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}
      <p class="src">Your nearest public shelter is always one tap away: the Shelters chip or the directions button during an alert.</p></div>`;
  }
  function homeCard() {
    if (S.emergency || U.cview !== 'map' || U.portal !== 'citizen') return '';
    const wd2 = w => zoneDist(S.user, workZone(w)), act = S.works.filter(w => workStatus(w) === 'active' && wd2(w) <= 2000).sort((a, b) => wd2(a) - wd2(b));
    const sh = nearby('shelter', 1)[0], reps = reportsShown();
    return `<div class="home-card" role="region" aria-label="Around you">
      <div class="hc-title">Around you</div>
      <button class="hc-row" data-action="cat" data-cat="works" type="button"><span class="picon" style="--c:#F28C00">${svgOf(catById('works'))}</span><span class="ptext"><b>${act.length ? `${act.length} construction site${act.length > 1 ? 's' : ''} within 2 km` : 'No construction within 2 km'}</b><span>${act.length ? `${esc(act[0].name)} · until ${fmtDate(act[0].end)}` : 'Tap to see works across Tallinn'}</span></span></button>
      ${reps.length ? `<button class="hc-row" data-action="cat" data-cat="reports" type="button"><span class="picon" style="--c:#6D4C41">${svgOf(REPORT_TYPES.fallen_tree)}</span><span class="ptext"><b>${reps.length} hazard report${reps.length > 1 ? 's' : ''}</b><span>Routes go around them until cleared</span></span></button>` : ''}
      ${(() => { const n = S.contribs.filter(c => c.status !== 'declined' && c.status !== 'done' && dist(S.user, c) <= 1500); return `<button class="hc-row" data-action="cat" data-cat="community" type="button"><span class="picon" style="--c:#7B3FA0">${svgOf(catById('community'))}</span><span class="ptext"><b>${n.length} issues and ideas near you</b><span>Support them or add your own</span></span></button>`; })()}
      <button class="hc-row" data-action="place" data-kind="shelter" data-id="${sh.p.id}" type="button"><span class="picon" style="--c:#0072CE">${svgOf(catById('shelter'))}</span><span class="ptext"><b>Your nearest shelter</b><span>${esc(sh.p.name)} · ${walkMin(sh.d)} min walk</span></span></button>
      <button class="hc-row" data-action="cview" data-view="ready" type="button"><span class="picon" style="--c:#1E8E3E"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"/></svg></span><span class="ptext"><b>Be ready</b><span>Home supplies and what to do in each emergency</span></span></button>
    </div>`;
  }
  function renderCitizen() {
    const em = S.emergency;
    $('#homeCard').innerHTML = homeCard();
    const fabLbl = proto() === 'storm' ? 'Report fallen tree' : proto() === 'flood' ? 'Report flooding' : 'Report a hazard', fabT = proto() === 'storm' ? REPORT_TYPES.fallen_tree : proto() === 'flood' ? REPORT_TYPES.flooded : REPORT_TYPES.danger;
    $('#fab').innerHTML = (S.emergency && !['report', 'contribute'].includes(U.cview)) ? `<button class="fab ${proto()}" data-action="open-contribute" data-k="tree" type="button">${svgOf(fabT)}<span>${fabLbl}</span></button>` : '';
    $('#chips').innerHTML = CATS.filter(c => c.id !== 'reports' || reportsShown().length).map(c => `<button class="chip ${U.cat === c.id ? 'active' : ''}" data-action="cat" data-cat="${c.id}" type="button" role="tab" aria-selected="${U.cat === c.id}" style="--c:${c.color}">${svgOf(c)}<span>${c.label}</span></button>`).join('');
    const pr = em && PROTOCOLS[em.type || 'airstrike'];
    $('#alertBanner').innerHTML = em ? `<div class="alert-banner ${em.type}" role="alert">${PROTO_IC[em.type || 'airstrike']}<div class="ab-text"><b>EE-ALARM · ${pr.label}</b><span>${esc(em.message)}</span></div><button class="btn-alert" data-action="directions" data-nearest="1" type="button">Go to nearest ${pr.destLabel}</button></div>` : '';
    const panel = $('#cpanel');
    const html = U.cview === 'list' && U.cat ? listPanel() : U.cview === 'search' ? searchPanel() : U.cview === 'place' ? placePanel() : U.cview === 'directions' ? directionsPanel()
      : U.cview === 'menu' ? menuPanel() : U.cview === 'settings' ? settingsPanel() : U.cview === 'lend' ? lendPanel()
      : U.cview === 'contribute' ? contributePanel() : U.cview === 'report' ? reportPanel() : U.cview === 'whereto' ? wheretoPanel() : U.cview === 'ready' ? readyPanel() : '';
    panel.hidden = !html; panel.innerHTML = html; document.body.classList.toggle('panel-open', !!html);
    $('#searchClear').hidden = !U.query;
    document.body.classList.toggle('has-alert', !!em);
    const cbtn = $('#contributeBtn'); if (cbtn && U.portal === 'citizen') cbtn.classList.toggle('active', U.cview === 'contribute');
    const bh = $('#alertBanner').offsetHeight; if (bh) document.documentElement.style.setProperty('--banner-h', (bh + 10) + 'px');
  }

  /* ---- municipality ---- */
  const card = (eyebrow, title, body) => `<div class="card">${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}${title ? `<h2>${title}</h2>` : ''}${body}</div>`;
  function tabWorks() {
    const wd = U.workDraft, works = S.works.slice().sort((x, y) => x.start.localeCompare(y.start)), byStatus = st => works.filter(w => workStatus(w) === st);
    const wbadge = w => { const st = workStatus(w); return st === 'active' ? '<span class="badge badge-orange">active</span>' : st === 'upcoming' ? '<span class="badge badge-grey">upcoming</span>' : '<span class="badge badge-outline">finished</span>'; };
    const editing = wd.editingId && S.works.find(w => w.id === wd.editingId), drawing = clickMode === 'work';
    return card('Tallinna Linnavalitsus', editing ? 'Edit construction works' : 'Add construction works', `<p>${editing ? 'Change the location, dates or affected modes. Citizens see the update straight away.' : 'Register a site with its dates. Citizens see it on the map, and everyday routes steer around it for the modes it affects.'}</p>
        <div class="field"><label>Name</label><input type="text" placeholder="e.g. Telliskivi street reconstruction" value="${esc(wd.name)}" data-draft="workDraft.name"></div>
        <div class="field"><label>Type</label><select data-draft="workDraft.type">${Object.entries(WORK_TYPES).map(([k, v]) => `<option value="${k}" ${wd.type === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
        <div class="draw-box ${drawing ? 'on' : ''}"><div><b>Street section</b><span>${wd.snapping ? 'Snapping to the streets…' : (wd.coords || []).length > 1 ? `${Math.round(lineLen(wd.coords))} m of street · ${wd.pts.length} points` : (wd.pts || []).length === 1 ? 'Now click where the works end' : 'Click where the works start and where they end; the line follows the streets'}</span></div>
          <div class="row">${drawing ? '<button class="btn btn-green btn-sm" data-action="work-done" type="button">Done</button>' : `<button class="btn btn-outline btn-sm" data-action="pick-work" type="button">${(wd.pts || []).length ? 'Add points' : 'Draw on map'}</button>`}${(wd.pts || []).length ? '<button class="btn btn-grey btn-sm" data-action="work-undo" type="button">Undo point</button><button class="btn btn-grey btn-sm" data-action="work-clear" type="button">Clear</button>' : ''}</div></div>
        <div class="grid2"><div class="field"><label>Start date</label><input type="date" value="${wd.start}" data-draft="workDraft.start"></div>
          <div class="field"><label>End date</label><input type="date" value="${wd.end}" data-draft="workDraft.end"></div></div>
        <div class="field"><label>Note for residents</label><input type="text" placeholder="e.g. Pavement closed, use the other side" value="${esc(wd.note)}" data-draft="workDraft.note"></div>
        <div class="row" style="margin-bottom:10px"><label class="check" style="margin:0"><input type="checkbox" ${wd.walk ? 'checked' : ''} data-draft="workDraft.walk"> Pedestrians</label><label class="check" style="margin:0"><input type="checkbox" ${wd.bike ? 'checked' : ''} data-draft="workDraft.bike"> Cyclists</label><label class="check" style="margin:0"><input type="checkbox" ${wd.drive ? 'checked' : ''} data-draft="workDraft.drive"> Cars</label></div>
        <div class="row"><button class="btn btn-green" style="flex:1" data-action="add-work" type="button">${editing ? 'Save changes' : 'Publish construction works'}</button>${editing ? '<button class="btn btn-grey" data-action="cancel-edit" type="button">Cancel</button>' : ''}</div>`)
      + card(null, null, `<div class="row between"><h2 style="margin:0">Registered works</h2><span class="muted">${byStatus('active').length} active · ${byStatus('upcoming').length} upcoming</span></div>
        ${works.length ? works.map(w => `<div class="wrow ${wd.editingId === w.id ? 'editing' : ''}"><div class="wtop"><div><b>${esc(w.name)}</b><span class="meta">${WORK_TYPES[w.type] || w.type} · ${fmtDate(w.start)} – ${fmtDate(w.end)} · ${w.coords ? Math.round(lineLen(w.coords)) + ' m of street' : (w.radius || 0) + ' m radius'} · ${['walk', 'bike', 'drive'].filter(k => w.affects[k]).join(', ') || 'no modes'}${w.updatedAt ? ` · updated ${ago(w.updatedAt)}` : ''}</span></div>${wbadge(w)}</div>
          <div class="wact"><button class="btn btn-outline btn-sm" data-action="edit-work" data-id="${w.id}" type="button">Edit</button>${workStatus(w) !== 'finished' ? `<button class="btn btn-grey btn-sm" data-action="extend-work" data-id="${w.id}" type="button">+7 days</button><button class="btn btn-grey btn-sm" data-action="end-work" data-id="${w.id}" type="button">Finished</button>` : ''}<button class="btn btn-grey btn-sm" data-action="remove-work" data-id="${w.id}" type="button">Remove</button></div></div>`).join('') : '<div class="empty">No construction works registered.</div>'}
        <p class="muted" style="margin-top:8px">Tip: click a site on the map to edit it. Finished works stay listed but leave the map automatically.</p>`);
  }
  function tabOverview() {
    const em = S.emergency, works = S.works, act = works.filter(w => workStatus(w) === 'active'), up = works.filter(w => workStatus(w) === 'upcoming');
    const unlocked = S.fleet.filter(v => v.unlocked).length, active = S.listings.filter(l => l.status === 'active' || l.status === 'claimed').length;
    const acked = OPERATORS.filter(o => S.acks[o.id] && S.acks[o.id].status === 'applied').length, matched = S.requests.filter(r => r.status === 'matched').length;
    return card('City works · live', null, `<div class="stats"><div class="stat"><b>${act.length}</b><span>construction sites active</span></div><div class="stat"><b>${up.length}</b><span>starting soon</span></div><div class="stat"><b>${SHELTERS.filter(sh => act.some(w => zoneDist(sh, workZone(w)) <= 300)).length}</b><span>shelters near works</span></div></div>`)
      + card('Crisis status · Päästeamet', em ? `${PROTOCOLS[em.type].label} alert active` : 'Standby', `<div class="stats">
          <div class="stat"><b>${SHELTERS.length}</b><span>public shelters (register)</span></div>
          <div class="stat"><b>${em ? (POP[em.district] / 1000).toFixed(0) + 'k' : '—'}</b><span>devices pushed (sim.)</span></div>
          <div class="stat"><b>${S.mandate === 'active' ? acked : 0}/${OPERATORS.length}</b><span>operators applied</span></div>
          <div class="stat"><b>${unlocked}</b><span>vehicles at €0</span></div>
          <div class="stat"><b>${active}</b><span>listings active</span></div>
          <div class="stat"><b>${matched}/${S.requests.length}</b><span>pick-ups matched</span></div></div>
        <div class="steps" style="margin-top:12px">
          <div class="step ${em ? '' : 'pending'}"><div class="num">1</div><div><b>Map</b><span>${em ? `EE-ALARM pushed with the ${PROTOCOLS[em.type].destLabel} route and four ways to get there.` : 'Waiting for declaration.'}</span></div></div>
          <div class="step ${S.mandate === 'active' ? '' : 'pending'}"><div class="num">2</div><div><b>Unlock</b><span>${S.mandate === 'active' ? `${unlocked} vehicles free in ${S.radius} m zones` : S.mandate === 'publishing' ? 'Publishing…' : 'Fleets locked.'}</span></div></div>
          <div class="step ${em ? '' : 'pending'}"><div class="num">3</div><div><b>Lend</b><span>${em ? `${active} neighbour listings live.` : `${S.listings.filter(l => l.status === 'dormant').length} dormant listings waiting.`}</span></div></div></div>`)
      + card('Data sources', null, `<div class="lst"><div><b>Public shelters</b><span class="meta">Päästeamet register via Maa- ja Ruumiamet, ${LKP.SHELTER_SOURCE.date}</span></div><span class="badge badge-green">${SHELTERS.length}</span></div>
          <div class="lst"><div><b>Hospitals, pharmacies, cool places, water</b><span class="meta">OpenStreetMap, fetched 25 Sep 2026</span></div><span class="badge badge-grey">${POIS.length}</span></div>
          <div class="lst"><div><b>Hazard zones</b><span class="meta">Drawn by the city during an alert; seeded ones are examples</span></div><span class="badge badge-grey">${S.hazards.length}</span></div>
          <div class="lst"><div><b>Fallen tree reports</b><span class="meta">From citizens and city crews</span></div><span class="badge badge-grey">${S.reports.filter(r => r.status !== 'cleared').length} open</span></div>
          <div class="lst"><div><b>Citizen contributions</b><span class="meta">Issues and ideas pinned by residents</span></div><span class="badge badge-grey">${S.contribs.length}</span></div>
          <div class="lst"><div><b>Storms</b><span class="meta">Added by the city under the storm protocol</span></div><span class="badge badge-grey">${S.storms.length}</span></div>`);
  }
  function hazardEditor(kind) {
    const hd = U.hazardDraft, list = S.hazards.filter(h => h.kind === kind), flood = kind === 'flood';
    return card(flood ? 'Flood protocol' : 'Storm protocol', flood ? 'Flooded areas' : 'Unsafe places', `<p>${flood ? 'Mark streets under water. Citizen routes are recalculated around them, and shelters inside them are skipped.' : 'Mark fallen trees, flying debris or closed streets. Citizen routes avoid them, as well as trees, the shoreline and construction sites.'}</p>
      ${list.length ? list.map(h => `<div class="lst"><div><b>${esc(h.name)}</b><span class="meta">${h.radius} m radius${h.example ? ' · example zone' : ''}</span></div><button class="btn btn-grey btn-sm" data-action="remove-hazard" data-id="${h.id}" type="button">Remove</button></div>`).join('') : `<div class="empty">No ${flood ? 'flooded areas' : 'unsafe places'} marked.</div>`}
      <div class="sub-form">
        <div class="grid2"><div class="field"><label>Name</label><input type="text" placeholder="${flood ? 'e.g. Pirita tee underpass' : 'e.g. Fallen tree, Kadriorg'}" value="${esc(hd.name)}" data-draft="hazardDraft.name"></div>
        <div class="field"><label>Radius (m)</label><input type="number" min="30" max="1500" step="10" value="${hd.radius}" data-draft="hazardDraft.radius"></div></div>
        <div class="row between" style="margin-bottom:10px"><span class="small">${hd.lat ? `Pinned at ${hd.lat.toFixed(4)}, ${hd.lng.toFixed(4)}` : 'Not placed yet'}</span><button class="btn btn-outline btn-sm" data-action="pick-hazard" type="button">${hd.lat ? 'Move on map' : 'Place on map'}</button></div>
        <button class="btn btn-green btn-block" data-action="add-hazard" type="button">Add ${flood ? 'flooded area' : 'unsafe place'}</button></div>`);
  }
  function stormEditor() {
    const d = U.stormDraft, list = S.storms.slice().sort((a, b) => a.startMs - b.startMs);
    const sb = s => { const st = stormStatus(s); return st === 'active' ? '<span class="badge badge-purple">active</span>' : st === 'upcoming' ? '<span class="badge badge-grey">upcoming</span>' : '<span class="badge badge-outline">passed</span>'; };
    return card('Storm protocol', 'Storms', `<p>Add the storm the city is tracking. Citizens see its area and wind, and gusts of 25 m/s or more make routes keep further from trees and the shoreline.</p>
      ${list.length ? list.map(s => `<div class="lst"><div><b>${esc(s.name)}</b><span class="meta">Wind ${s.wind} m/s · gusts ${s.gust} m/s from ${dirName(s.from)} · ${s.radiusKm} km · ${timeStr(s.startMs)}–${timeStr(s.endMs)}</span></div><span class="row">${sb(s)}<button class="btn btn-grey btn-sm" data-action="remove-storm" data-id="${s.id}" type="button">Remove</button></span></div>`).join('') : '<div class="empty">No storm added yet.</div>'}
      <div class="sub-form">
        <div class="field"><label>Storm name</label><input type="text" placeholder="e.g. Storm Ingrid" value="${esc(d.name)}" data-draft="stormDraft.name"></div>
        <div class="grid3"><div class="field"><label>Wind (m/s)</label><input type="number" min="5" max="60" value="${d.wind}" data-draft="stormDraft.wind"></div>
          <div class="field"><label>Gusts (m/s)</label><input type="number" min="5" max="70" value="${d.gust}" data-draft="stormDraft.gust"></div>
          <div class="field"><label>Wind from</label><select data-draft="stormDraft.from">${DIRS.map(([deg, n]) => `<option value="${deg}" ${Number(d.from) === deg ? 'selected' : ''}>${n}</option>`).join('')}</select></div></div>
        <div class="grid3"><div class="field"><label>Arrives</label><input type="datetime-local" value="${d.start}" data-draft="stormDraft.start"></div>
          <div class="field"><label>Lasts (h)</label><input type="number" min="1" max="72" value="${d.hours}" data-draft="stormDraft.hours"></div>
          <div class="field"><label>Area (km)</label><input type="number" min="1" max="60" value="${d.radiusKm}" data-draft="stormDraft.radiusKm"></div></div>
        <div class="row between" style="margin-bottom:10px"><span class="small">${d.lat ? `Centred at ${d.lat.toFixed(3)}, ${d.lng.toFixed(3)}` : 'Centred on Tallinn'}</span><button class="btn btn-outline btn-sm" data-action="pick-storm" type="button">Set centre on map</button></div>
        <button class="btn btn-purple btn-block" data-action="add-storm" type="button">Add storm</button></div>`);
  }
  function reportsManager() {
    const d = U.reportDraft, list = S.reports.slice().sort((a, b) => b.createdAt - a.createdAt), open = list.filter(r => r.status !== 'cleared');
    const rb = r => r.status === 'reported' ? '<span class="badge badge-orange">new</span>' : r.status === 'confirmed' ? '<span class="badge badge-green">confirmed</span>' : '<span class="badge badge-outline">cleared</span>';
    return card('Storm protocol', 'Fallen trees and branches', `<p>Reported by citizens in the app and by city crews. Routes avoid every report that is not cleared.</p>
      <p class="muted">${open.filter(r => r.status === 'reported').length} new · ${open.filter(r => r.status === 'confirmed').length} confirmed · ${list.length - open.length} cleared</p>
      ${list.map(r => { const T = REPORT_TYPES[r.type]; return `<div class="wrow"><div class="wtop"><div class="rhead"><span class="picon sm" style="--c:${T.color}">${svgOf(T)}</span><div><b>${T.label}</b><span class="meta">${esc(r.note || T.hint)} · ${r.by === 'city' ? 'city crew' : 'citizen'} · ${ago(r.createdAt)}${r.example ? ' · example' : ''}</span></div></div>${rb(r)}</div>
        <div class="wact">${r.status === 'reported' ? `<button class="btn btn-outline btn-sm" data-action="report-status" data-id="${r.id}" data-s="confirmed" type="button">Confirm</button>` : ''}${r.status !== 'cleared' ? `<button class="btn btn-grey btn-sm" data-action="report-status" data-id="${r.id}" data-s="cleared" type="button">Mark cleared</button>` : `<button class="btn btn-grey btn-sm" data-action="report-status" data-id="${r.id}" data-s="confirmed" type="button">Reopen</button>`}<button class="btn btn-grey btn-sm" data-action="remove-report" data-id="${r.id}" type="button">Remove</button></div></div>`; }).join('') || '<div class="empty">No reports yet.</div>'}
      <div class="sub-form">
        <div class="grid2"><div class="field"><label>Type</label><select data-draft="reportDraft.type">${Object.entries(REPORT_TYPES).map(([k, r]) => `<option value="${k}" ${d.type === k ? 'selected' : ''}>${r.label}</option>`).join('')}</select></div>
        <div class="field"><label>Details</label><input type="text" placeholder="e.g. Lime tree down on Kadrioru tee" value="${esc(d.note)}" data-draft="reportDraft.note"></div></div>
        <div class="row between" style="margin-bottom:10px"><span class="small">${d.lat ? `Pinned at ${d.lat.toFixed(4)}, ${d.lng.toFixed(4)}` : 'Not placed yet'}</span><button class="btn btn-outline btn-sm" data-action="pick-report" type="button">Place on map</button></div>
        <button class="btn btn-green btn-block" data-action="city-report" type="button">Add city report</button></div>`);
  }
  function tabCrisis() {
    const em = S.emergency, f = U.form, t = em ? em.type : f.protocol, pr = PROTOCOLS[t];
    const remaining = em ? Math.max(0, em.endsAt - Date.now()) : 0, remStr = `${Math.floor(remaining / 3600e3)}h ${String(Math.floor((remaining % 3600e3) / 60e3)).padStart(2, '0')}m`;
    const picker = `<div class="protos" role="radiogroup" aria-label="Emergency protocol">${Object.entries(PROTOCOLS).map(([k, p]) => `<button class="proto ${t === k ? 'active' : ''} ${k}" data-action="protocol" data-p="${k}" type="button" role="radio" aria-checked="${t === k}" ${em ? 'disabled' : ''}>${PROTO_IC[k]}<b>${p.label}</b><span>${p.summary}</span></button>`).join('')}</div>`;
    const main = em
      ? card('Crisis operations · Päästeamet', `${pr.label} alert`, `<div class="status-box live"><div class="muted">Active · ${esc(em.district)}</div><div class="big-time">${remStr} left</div><div class="muted">Declared ${timeStr(em.declaredAt)} · ends ${timeStr(em.endsAt)}</div></div>
          <p>${esc(em.message)}</p>${picker}<p class="muted">Citizens are routed to the nearest ${pr.destLabel}. End the alert to switch protocol.</p>
          <button class="btn btn-green btn-block" data-action="end" type="button">End alert</button>`)
      : card('Crisis operations · Päästeamet', 'Choose the protocol', `<p>Each protocol changes where citizens are sent and how their route is chosen.</p>${picker}
          <div class="grid2"><div class="field"><label>District</label><select data-draft="form.district">${DISTRICTS.map(d => `<option ${f.district === d ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
          <div class="field"><label>Time-box</label><select data-draft="form.hours">${[1, 2, 4, 6, 12, 24].map(h => `<option value="${h}" ${Number(f.hours) === h ? 'selected' : ''}>${h} hour${h > 1 ? 's' : ''}</option>`).join('')}</select></div></div>
          <div class="field"><label>Message pushed to phones</label><textarea data-draft="form.message" placeholder="${esc(pr.message)}">${esc(f.message)}</textarea></div>
          <label class="check"><input type="checkbox" ${S.autoUnlock ? 'checked' : ''} data-action="auto-unlock"> Unlock shared fleets on declaration${t === 'storm' ? ' (not advised in strong wind)' : ''}</label>
          <button class="btn btn-alert btn-block" data-action="declare" type="button">${PROTO_IC[t]} Declare ${pr.label.toLowerCase()} alert</button>`);
    return main + (t === 'storm' ? stormEditor() + reportsManager() : '') + (pr.hazard ? hazardEditor(pr.hazard) : '');
  }
  function tabFleet() {
    const em = S.emergency, acked = OPERATORS.filter(o => S.acks[o.id] && S.acks[o.id].status === 'applied').length, policy = em && em.policy ? em.policy.policies[0] : null;
    return card('Layer 2 · Unlock the operators', 'Fleet unlock (MDS)', `<p>Publishes an Emergency Unlock Mandate as an MDS Policy: zero fare near shelters, time-boxed to the alert, revoked automatically.</p>
        ${proto() === 'storm' ? '<div class="warn">Storm protocol: riding in strong wind is dangerous. Unlock only if the wind has eased.</div>' : ''}
        <div class="field"><label>Geofence radius around each shelter: <b>${S.radius} m</b></label><div class="range"><input type="range" min="400" max="2500" step="100" value="${S.radius}" data-action="radius" ${S.mandate === 'active' || S.mandate === 'publishing' ? 'disabled' : ''}></div></div>
        <div class="row">${S.mandate === 'active' ? `<button class="btn btn-outline" data-action="revoke" type="button">Lock fleets</button><button class="btn btn-green" data-action="publish" type="button">Re-publish</button>`
          : S.mandate === 'publishing' ? `<button class="btn btn-green" disabled type="button">Publishing… ${acked}/${OPERATORS.length}</button>`
          : `<button class="btn btn-green btn-block" data-action="publish" type="button" ${em ? '' : 'disabled'}>Unlock fleets</button>`}</div>
        ${!em ? '<p class="muted" style="margin-top:8px">Declare an alert first, under Crisis operations.</p>' : ''}
        <div class="ops">${OPERATORS.map(o => {
          const fleet = S.fleet.filter(v => v.operatorId === o.id), inG = fleet.filter(inGeofence).length, unl = fleet.filter(v => v.unlocked).length, a = S.acks[o.id];
          const badge = !a || S.mandate === 'none' ? '<span class="badge badge-grey">locked · normal pricing</span>' : a.status === 'awaiting' ? '<span class="badge badge-outline">awaiting…</span>' : a.status === 'applied' ? `<span class="badge badge-green">applied ${timeStr(a.at)} · ${unl} at €0</span>` : `<span class="badge badge-grey">revoked ${timeStr(a.at)}</span>`;
          return `<div class="op"><div class="op-head"><span class="letter">${o.letter}</span>${o.name}</div><dl><div><dt>Fleet</dt><dd>${fleet.length}</dd></div><div><dt>In geofence</dt><dd>${inG}</dd></div><div><dt>Types</dt><dd>${o.vehicleTypes.map(t => VEHICLE_LABELS[t] || t).join(', ')}</dd></div></dl><div class="ack">${badge}</div></div>`;
        }).join('')}</div>
        <details><summary>Policy object (MDS Policy ${MDS.VERSION})</summary>${policy ? `<pre class="json">${esc(JSON.stringify(em.policy, null, 2))}</pre>` : '<p class="muted" style="margin-top:8px">Built when the mandate is published: a <b>rate</b> rule with rate_amount 0 inside shelter geographies, a <b>count</b> rule so trips end at shelters, a <b>user</b> rule holding accessible vehicles for priority riders, and a ban on rebalancing out of geofences.</p>'}</details>`);
  }
  function tabDispatch() {
    const em = S.emergency, cd = U.callDraft;
    const queue = S.requests.slice().sort((a, b) => (a.status === b.status ? 0 : a.status === 'queued' ? -1 : 1) || b.priority - a.priority || a.createdAt - b.createdAt);
    return card('Organise · pick-up dispatch', null, `<div class="row between"><h2 style="margin:0">Priority queue</h2>${em ? '<button class="btn btn-outline btn-sm" data-action="rematch" type="button">Run matching</button>' : ''}</div>
        ${queue.length ? `<table class="tbl"><thead><tr><th>Pri.</th><th>Who</th><th>Need</th><th>Status</th><th></th></tr></thead><tbody>${queue.map(r => { const v = r.volunteerId && S.volunteers.find(x => x.id === r.volunteerId); return `<tr class="${r.mine ? 'mine' : ''}"><td><b>${r.priority}</b></td><td>${esc(r.name)}<br><span class="muted">${r.people} pers.${r.source === 'call' ? ' · phone' : ''}</span></td><td>${NEEDS[r.need].label}</td><td>${r.status === 'matched' ? `<span class="badge badge-green">matched</span><br><span class="muted">${esc(v ? v.name : '')} · ${r.eta} min</span>` : `<span class="badge badge-grey">queued #${r.position}</span>`}</td><td><button class="btn btn-grey btn-sm" data-action="cancel-ride" data-id="${r.id}" type="button" title="Resolve / remove">✓</button></td></tr>`; }).join('')}</tbody></table>` : '<div class="empty">No pick-up requests. They appear the moment an alert is declared.</div>'}
        <p class="muted" style="margin-top:8px">Drivers free: ${S.volunteers.filter(v => v.available).length} of ${S.volunteers.length} (${S.volunteers.filter(v => v.source === 'pinge').length} Pinge crews, ${S.volunteers.filter(v => v.source !== 'pinge').length} neighbours).</p>`)
      + (em ? card(null, 'Add a request from a phone call', `<div class="grid2"><div class="field"><label>Caller</label><input type="text" placeholder="Name or address" value="${esc(cd.name)}" data-draft="callDraft.name"></div><div class="field"><label>People</label><input type="number" min="1" max="8" value="${cd.people}" data-draft="callDraft.people"></div></div>
          <div class="field"><label>Need</label><select data-draft="callDraft.need">${Object.entries(NEEDS).map(([k, v]) => `<option value="${k}" ${cd.need === k ? 'selected' : ''}>${v.label}</option>`).join('')}</select></div>
          <div class="row between" style="margin-bottom:10px"><span class="small">Pin: ${cd.lat ? cd.lat.toFixed(4) + ', ' + cd.lng.toFixed(4) : 'not set'}</span><button class="btn btn-outline btn-sm" data-action="pick-call" type="button">Place on map</button></div>
          <button class="btn btn-green btn-block" data-action="add-call" type="button">Add to queue</button>`) : '');
  }
  function tabListings() {
    const all = S.listings.filter(l => l.status !== 'removed'), count = st => all.filter(l => l.status === st).length;
    const lbadge = l => l.status === 'dormant' ? '<span class="badge badge-grey">dormant</span>' : l.status === 'active' ? '<span class="badge badge-green">active</span>' : '<span class="badge badge-outline">claimed</span>';
    return card('Layer 3 · Lend from the citizens', 'Neighbour listings', `<p class="muted">${count('dormant')} dormant · ${count('active')} active · ${count('claimed')} claimed</p>
      ${all.map(l => `<div class="lst"><div><b>${esc(l.label)}</b><span class="meta">${VEHICLE_LABELS[l.type]} · ${esc(l.owner)} · ${esc(l.contact)}</span></div>${lbadge(l)}</div>`).join('')}
      <p class="muted" style="margin-top:8px">Shared with the Rescue Board only while an alert is active; owners are notified on every claim.</p>`);
  }
  function tabLog() {
    return card(null, null, `<div class="row between"><h2 style="margin:0">MDS exchange log</h2><span class="muted">${S.mdsLog.length} calls</span></div>
      ${S.mdsLog.length ? `<div class="log">${S.mdsLog.map(e => `<div class="log-e"><span class="a ${e.actor === 'agency' ? '' : 'prov'}">${e.actor === 'agency' ? 'Rescue Board' : (OPERATORS.find(o => o.id === e.actor) || { name: e.actor }).name}</span><span class="m">${e.method}</span> ${esc(e.url)}<span class="st">${e.status} · ${timeStr(e.t)}</span><details><summary>body</summary><pre>${esc(JSON.stringify(e.body, null, 1))}</pre></details></div>`).join('')}</div>` : '<div class="empty">No calls yet. Unlock the fleets to publish the mandate.</div>'}`);
  }
  function emergencyReportsCard() {
    const stormOn = (proto() || U.form.protocol) === 'storm', list = S.reports.slice().filter(r => !r.example || (stormOn && r.status !== 'cleared')).sort((x, y) => (x.status === 'reported' ? 0 : 1) - (y.status === 'reported' ? 0 : 1) || y.createdAt - x.createdAt);
    const rb = r => r.status === 'reported' ? '<span class="badge badge-orange">new</span>' : r.status === 'confirmed' ? '<span class="badge badge-green">confirmed</span>' : '<span class="badge badge-outline">cleared</span>';
    return list.map(r => { const T = REPORT_TYPES[r.type]; return `<div class="wrow"><div class="wtop"><div class="rhead"><span class="picon sm" style="--c:${T.color}">${svgOf(T)}</span><div><b>${T.label}</b><span class="meta">${esc(r.note || T.hint)} · ${r.by === 'city' ? 'city crew' : 'resident'} · ${ago(r.createdAt)}${r.example ? ' · example' : ''}</span></div></div>${rb(r)}</div>
      <div class="wact">${r.status === 'reported' ? `<button class="btn btn-outline btn-sm" data-action="report-status" data-id="${r.id}" data-s="confirmed" type="button">Confirm</button>` : ''}${r.status !== 'cleared' ? `<button class="btn btn-grey btn-sm" data-action="report-status" data-id="${r.id}" data-s="cleared" type="button">Mark cleared</button>` : `<button class="btn btn-grey btn-sm" data-action="report-status" data-id="${r.id}" data-s="confirmed" type="button">Reopen</button>`}<button class="btn btn-grey btn-sm" data-action="show-on-map" data-lat="${r.lat}" data-lng="${r.lng}" type="button">Show</button><button class="btn btn-grey btn-sm" data-action="remove-report" data-id="${r.id}" type="button">Remove</button></div></div>`; }).join('') || '<div class="empty">No emergency reports.</div>';
  }
  function tabContrib() {
    const f = U.contribFilter, list = S.contribs.filter(c => f === 'all' || c.kind === f).sort((a, b) => (a.status === 'new' ? 0 : 1) - (b.status === 'new' ? 0 : 1) || b.votes - a.votes);
    const cnt = k => S.contribs.filter(c => c.kind === k).length, newN = S.contribs.filter(c => c.status === 'new').length;
    return card('Tallinna Linnavalitsus', 'Citizen contributions', `<p>Issues and ideas residents pinned on the map. Set a status and reply; residents see both.</p>
      <div class="seg blue" role="group" aria-label="Filter">${[['all', `All · ${S.contribs.length}`], ['issue', `Issues · ${cnt('issue')}`], ['idea', `Ideas · ${cnt('idea')}`], ['emergency', `Emergency · ${S.reports.filter(r => r.status !== 'cleared' && !r.example).length}`]].map(([k, l]) => `<button class="${f === k ? 'on' : ''}" data-action="contrib-filter" data-f="${k}" type="button">${l}</button>`).join('')}</div>
      ${f === 'emergency' ? `<p class="muted">Fallen trees, flooded streets, blocked ways and other dangers residents reported during alerts. Routes avoid everything not cleared.</p>${emergencyReportsCard()}` : `<p class="muted">${newN} new · sorted by new first, then most supported</p>`}
      ${list.map(c => { const K = CONTRIB[c.kind]; return `<div class="wrow"><div class="wtop"><div class="rhead"><span class="picon sm" style="--c:${K.color}">${svgOf(K)}</span><div><b>${esc(c.title)}</b><span class="meta">${K.cats[c.cat]} · ▲ ${c.votes} · ${c.comments.length} comment${c.comments.length === 1 ? '' : 's'} · ${c.by === 'city' ? 'city' : 'resident'} · ${ago(c.createdAt)}${c.example ? ' · example' : ''}</span></div></div>
          <select class="status-sel" data-action="contrib-status" data-id="${c.id}" aria-label="Status">${Object.entries(CSTATUS).map(([k, l]) => `<option value="${k}" ${c.status === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        ${c.note ? `<p class="small" style="margin:6px 0 0">${esc(c.note)}</p>` : ''}
        ${c.comments.filter(m => m.by === 'city').slice(-1).map(m => `<div class="cmt city small-cmt"><b>City reply</b><span>${ago(m.at)}</span><p>${esc(m.text)}</p></div>`).join('')}
        ${c.kind === 'issue' && c.status !== 'done' ? `<div class="wact"><button class="btn btn-outline btn-sm" data-action="plan-work" data-id="${c.id}" type="button">Plan as construction works</button><button class="btn btn-grey btn-sm" data-action="show-on-map" data-lat="${c.lat}" data-lng="${c.lng}" type="button">Show</button></div>` : `<div class="wact"><button class="btn btn-grey btn-sm" data-action="show-on-map" data-lat="${c.lat}" data-lng="${c.lng}" type="button">Show</button></div>`}<div class="cform"><input type="text" placeholder="Reply publicly as the city" value="${esc((U.replyDrafts || {})[c.id] || '')}" data-reply="${c.id}" aria-label="Reply"><button class="btn btn-green btn-sm" data-action="city-reply" data-id="${c.id}" type="button">Reply</button><button class="btn btn-grey btn-sm" data-action="remove-contrib" data-id="${c.id}" type="button">Remove</button></div></div>`; }).join('') || (f === 'emergency' ? '' : '<div class="empty">No contributions yet.</div>')}`);
  }
  const GOV_RENDER = { contrib: tabContrib, works: tabWorks, overview: tabOverview, crisis: tabCrisis, fleet: tabFleet, dispatch: tabDispatch, listings: tabListings, log: tabLog };
  function renderGov() {
    const el = $('#govPanel'); const y = el.scrollTop;
    el.innerHTML = (GOV_RENDER[U.govTab] || tabWorks)() + '<div class="col-foot">Tallinna Linnavalitsus · prototype with Pinge Electronics OÜ · City Resilience Hack 2026</div>';
    el.scrollTop = y; renderSubtabs();
  }

  let lastEm = !!S.emergency;
  function checkAlertTransition() {
    const now = !!S.emergency;
    if (now && !lastEm && U.portal === 'citizen') { U.dest = null; U.cview = 'directions'; U.mode = S.user.mobility === 'walks' ? 'walk' : 'pickup'; setTimeout(refreshRoute, 0); }
    if (!now && lastEm) { U.routeInfo = null; }
    lastEm = now;
  }
  function renderAll() { checkAlertTransition(); renderTop(); renderCitizen(); renderGov(); drawMap(); saveUI(); }

  /* ---------------- events ---------------- */
  const header = document.querySelector('.topbar');
  const syncHeader = () => { document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'); map.invalidateSize(); };
  if (window.ResizeObserver) new ResizeObserver(syncHeader).observe(header); else window.addEventListener('resize', syncHeader);

  document.querySelector('.portals').addEventListener('click', e => {
    const t = e.target.closest('.portal-tab'); if (!t) return;
    U.portal = t.dataset.portal; setClickMode(null); history.replaceState(null, '', '#' + U.portal); saveUI(); renderAll(); refreshRoute();
  });
  $('#contributeBtn').addEventListener('click', () => {
    if (U.portal === 'gov') { U.govTab = 'contrib'; saveUI(); renderGov(); drawMap(); renderTop(); $('#govPanel').scrollTop = 0; return; }
    U.cview = 'contribute'; U.cat = null; U.dest = null; layers.route.clearLayers();
    if (U.contribDraft.kind === 'tree' && !S.emergency) U.contribDraft.kind = 'issue';
    if (S.emergency) U.contribDraft.kind = 'tree';
    saveUI(); renderCitizen(); renderTop(); drawMap();
  });
  $('#subtabs').addEventListener('click', e => {
    const t = e.target.closest('[data-gtab]'); if (!t) return;
    U.govTab = t.dataset.gtab; setClickMode(null); saveUI(); renderGov(); drawMap(); renderTop(); $('#govPanel').scrollTop = 0;
  });
  const search = $('#searchInput');
  search.value = U.query || '';
  let searchTimer = null;
  search.addEventListener('input', () => {
    U.query = search.value; U.searchResults = []; geoToken++; U.searching = false;
    U.cview = U.query ? 'search' : (U.cat ? 'list' : 'map');
    renderCitizen(); saveUI();
    clearTimeout(searchTimer);
    if (U.query.trim().length >= 3 && localSearch(U.query).length === 0) searchTimer = setTimeout(() => geocode(U.query), 700);
  });
  search.addEventListener('focus', () => { if (U.query) { U.cview = 'search'; renderCitizen(); } });
  search.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); geocode(U.query); }
    if (e.key === 'Escape') { search.value = ''; U.query = ''; U.cview = U.cat ? 'list' : 'map'; renderCitizen(); }
  });

  const root = $('#app');
  root.addEventListener('input', e => {
    if (e.target.dataset.draftPlain) { U[e.target.dataset.draftPlain] = e.target.value; saveUI(); return; }
    if (e.target.dataset.reply) { U.replyDrafts = U.replyDrafts || {}; U.replyDrafts[e.target.dataset.reply] = e.target.value; saveUI(); return; }
    const path = e.target.dataset.draft; if (!path) return;
    const [obj, key] = path.split('.'); U[obj][key] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; saveUI();
    if (obj === 'workDraft' && key === 'radius' && U.workDraft.lat) drawMap();
    if (obj === 'hazardDraft' && key === 'radius' && U.hazardDraft.lat) drawMap();
    if (obj === 'stormDraft' && key === 'radiusKm' && U.stormDraft.lat) drawMap();
    if (obj === 'reportDraft' && key === 'type') drawMap();
  });
  root.addEventListener('change', e => {
    const a = e.target.dataset.action;
    if (a === 'mobility') { S.user.mobility = e.target.value; S.unlock = null; save(); renderAll(); }
    if (a === 'radius') { S.radius = Number(e.target.value); save(); renderAll(); }
    if (a === 'auto-unlock') { S.autoUnlock = e.target.checked; save(); }
    if (a === 'contrib-status') setContribStatus(e.target.dataset.id, e.target.value);
  });
  root.addEventListener('click', async e => {
    const b = e.target.closest('[data-action]'); if (!b || ['SELECT', 'INPUT', 'TEXTAREA'].includes(b.tagName)) return;
    switch (b.dataset.action) {
      case 'cat': {
        const c = b.dataset.cat;
        if (U.cat === c && U.cview === 'list') { U.cat = null; U.cview = 'map'; }
        else {
          U.cat = c; U.cview = 'list'; U.query = ''; search.value = '';
          const items = nearby(c, 6); if (items.length) map.fitBounds(L.latLngBounds(items.map(x => [x.p.lat, x.p.lng]).concat([[S.user.lat, S.user.lng]])), Object.assign({ maxZoom: 16 }, fitPad()));
        }
        layers.route.clearLayers(); saveUI(); renderCitizen(); drawMap(); break;
      }
      case 'sunhour': U.sunHour = b.dataset.h === '' ? null : Number(b.dataset.h); saveUI(); refreshRoute(); break;
      case 'chips-more': $('#chips').scrollBy({ left: 260, behavior: 'smooth' }); break;
      case 'place': { if (b.dataset.kind === 'search') U.searchPlace = (U.searchResults || []).find(x => x.id === b.dataset.id) || U.searchPlace; openPlace(b.dataset.kind, b.dataset.id); break; }
      case 'dir-button':
        if (!S.emergency && U.cview !== 'place') { U.dest = null; U.cview = 'whereto'; saveUI(); renderCitizen(); drawMap(); search.focus(); break; }
        if (U.cview !== 'place') U.dest = null;
        U.cview = 'directions'; saveUI(); renderCitizen(); drawMap(); refreshRoute(); break;
      case 'go': U.dest = { kind: b.dataset.kind, id: b.dataset.id }; U.cview = 'directions'; saveUI(); renderCitizen(); drawMap(); refreshRoute(); break;
      case 'open-contribute':
        U.cview = 'contribute'; U.cat = null; U.dest = null; layers.route.clearLayers();
        if (b.dataset.k) U.contribDraft.kind = b.dataset.k;
        if (U.contribDraft.kind === 'tree' && !S.emergency) U.contribDraft.kind = 'issue';
        saveUI(); renderCitizen(); renderTop(); drawMap(); break;
      case 'contrib-kind': { const k = b.dataset.k; U.contribDraft.kind = k; if (k !== 'tree') U.contribDraft.cat = Object.keys(CONTRIB[k].cats)[0]; saveUI(); renderCitizen(); drawMap(); break; }
      case 'contrib-cat': U.contribDraft.cat = b.dataset.c; saveUI(); renderCitizen(); break;
      case 'pick-contrib': setClickMode('contrib', 'Click the map where it is'); break;
      case 'add-contrib': addContrib(); break;
      case 'vote': toggleVote(b.dataset.id); break;
      case 'comment': if (addComment(b.dataset.id, 'citizen', U.commentDraft)) { U.commentDraft = ''; saveUI(); renderCitizen(); } break;
      case 'city-reply': { const t = (U.replyDrafts || {})[b.dataset.id]; if (addComment(b.dataset.id, 'city', t)) { U.replyDrafts[b.dataset.id] = ''; saveUI(); renderAll(); toast('Reply published'); } break; }
      case 'remove-contrib': removeContrib(b.dataset.id); break;
      case 'contrib-filter': U.contribFilter = b.dataset.f; saveUI(); renderGov(); break;
      case 'works-all': U.worksAll = b.dataset.v === '1'; saveUI(); renderCitizen(); break;
      case 'report-type': U.reportDraft.type = b.dataset.t; saveUI(); renderCitizen(); drawMap(); break;
      case 'pick-report': setClickMode('report', 'Click the map where the tree or branches are'); break;
      case 'submit-report': addReport('citizen'); U.cview = U.cview === 'contribute' ? 'contribute' : 'map'; saveUI(); renderCitizen(); break;
      case 'city-report': addReport('city'); break;
      case 'report-status': setReportStatus(b.dataset.id, b.dataset.s); break;
      case 'remove-report': removeReport(b.dataset.id); break;
      case 'pick-storm': setClickMode('storm', 'Click the map at the centre of the storm'); break;
      case 'add-storm': addStorm(); break;
      case 'remove-storm': removeStorm(b.dataset.id); break;
      case 'edit-work': editWork(b.dataset.id); break;
      case 'extend-work': extendWork(b.dataset.id, 7); break;
      case 'end-work': endWorkToday(b.dataset.id); break;
      case 'cancel-edit': U.workDraft = freshUI().workDraft; saveUI(); renderGov(); drawMap(); break;
      case 'directions':
        if (b.dataset.nearest) U.dest = null;
        else if (!U.dest && U.cview !== 'place') U.dest = null;
        U.cview = 'directions'; saveUI(); renderCitizen(); drawMap(); refreshRoute(); break;
      case 'close-dir': U.cview = U.dest ? 'place' : (U.cat ? 'list' : 'map'); U.routeInfo = null; layers.route.clearLayers(); saveUI(); renderCitizen(); drawMap(); break;
      case 'cview': {
        const v = b.dataset.view; U.cview = v;
        if (v === 'map') { U.cat = null; U.dest = null; U.routeInfo = null; layers.route.clearLayers(); }
        if (v === 'list' || v === 'search') U.dest = null;
        saveUI(); renderCitizen(); drawMap(); break;
      }
      case 'search-go': geocode(U.query); break;
      case 'search-clear': search.value = ''; U.query = ''; U.searchResults = []; U.cview = U.cat ? 'list' : 'map'; saveUI(); renderCitizen(); search.focus(); break;
      case 'mode': U.mode = b.dataset.mode; U.cview = 'directions'; saveUI(); renderCitizen(); drawMap(); refreshRoute(); break;
      case 'unlock': await unlock(b.dataset.kind, b.dataset.id); break;
      case 'release': releaseUnlock(); break;
      case 'request-ride': requestRide(); break;
      case 'cancel-ride': cancelRequest(b.dataset.id); break;
      case 'offer-seats': offerSeats(); break;
      case 'withdraw-seats': withdrawSeats(); break;
      case 'pick-user': setClickMode('user', 'Click the map where you are'); break;
      case 'geolocate':
        if (!navigator.geolocation) { toast('Geolocation not available'); break; }
        navigator.geolocation.getCurrentPosition(p => { S.user.lat = p.coords.latitude; S.user.lng = p.coords.longitude; S.unlock = null; save(); renderAll(); map.setView([S.user.lat, S.user.lng], 15); refreshRoute(); }, () => toast('Could not read your location'));
        break;
      case 'protocol': U.form.protocol = b.dataset.p; U.form.message = ''; S.autoUnlock = PROTOCOLS[b.dataset.p].autoUnlock; U.hazardDraft = freshUI().hazardDraft; save(); saveUI(); renderGov(); drawMap(); break;
      case 'declare': await declare(); break;
      case 'end': await endEmergency(); break;
      case 'publish': await publishMandate(); break;
      case 'revoke': await revokeMandate(); break;
      case 'rematch': matchRequests(); save(); renderAll(); refreshRoute(); break;
      case 'pick-listing': setClickMode('listing', 'Click the map where the vehicle is kept'); break;
      case 'clear-pin': U.lendDraft.lat = null; U.lendDraft.lng = null; saveUI(); renderAll(); break;
      case 'add-listing': addListing(); break;
      case 'remove-listing': removeListing(b.dataset.id); break;
      case 'pick-call': setClickMode('call', 'Click the map where the caller is'); break;
      case 'add-call': addCallRequest(); break;
      case 'pick-work': setClickMode('work', 'Click where the works start, then where they end. Add clicks to follow a longer stretch.'); renderGov(); break;
      case 'work-done': setClickMode(null); renderGov(); break;
      case 'work-undo': U.workDraft.pts = (U.workDraft.pts || []).slice(0, -1); snapWorkDraft(); break;
      case 'work-clear': U.workDraft.pts = []; U.workDraft.coords = []; U.workDraft.lat = null; U.workDraft.lng = null; saveUI(); renderGov(); drawMap(); break;
      case 'plan-work': {
        const c = S.contribs.find(x => x.id === b.dataset.id); if (!c) break;
        U.workDraft = Object.assign(freshUI().workDraft, { name: c.title, note: 'Planned after residents reported it in PiMap' });
        if (c.status === 'new' || c.status === 'seen') { c.status = 'planned'; c.updatedAt = Date.now(); save(); }
        U.govTab = 'works'; map.flyTo([c.lat, c.lng], 17, { duration: 0.6 });
        setClickMode('work', 'Click where the works start, then where they end.'); saveUI(); renderGov(); renderTop(); drawMap(); $('#govPanel').scrollTop = 0; break;
      }
      case 'show-on-map': map.flyTo([Number(b.dataset.lat), Number(b.dataset.lng)], 17, { duration: 0.6 }); break;
      case 'add-work': addWork(); break;
      case 'remove-work': removeWork(b.dataset.id); break;
      case 'pick-hazard': setClickMode('hazard', 'Click the map at the centre of the area'); break;
      case 'add-hazard': addHazard(); break;
      case 'remove-hazard': removeHazard(b.dataset.id); break;
      default: break;
    }
  });
  $('#resetBtn').addEventListener('click', () => {
    if (!confirm((window.LKP_T || (s => s))('Reset the demo? This clears the alert, listings, works, hazard zones and requests on this device.'))) return;
    localStorage.removeItem(LS_KEY); sessionStorage.removeItem(UI_KEY);
    const portal = U.portal; S = freshShared(); U = freshUI(); U.portal = portal; lastEm = false; search.value = ''; save();
    layers.route.clearLayers(); renderAll(); map.setView(LKP.CITY_CENTER, 14); toast('Demo reset');
  });
  window.addEventListener('storage', e => {
    if (e.key === LS_KEY && !writing) {
      const prev = S.emergency && S.emergency.policyId; S = loadShared(); renderAll();
      if (U.cview === 'directions' || (S.emergency && S.emergency.policyId) !== prev) refreshRoute();
    }
  });
  window.addEventListener('lkp:open', e => { const d = e.detail || {}; if (!d.kind || !d.id) return; U.portal = 'citizen'; U.cat = null; saveUI(); renderAll(); openPlace(d.kind, d.id); });
  window.addEventListener('lkp:lang', () => { renderAll(); if (U.cview === 'directions') renderCitizen(); });
  window.addEventListener('online', renderTop); window.addEventListener('offline', renderTop);
  window.addEventListener('hashchange', () => { const h = location.hash.replace('#', ''); if ((h === 'gov' || h === 'citizen') && h !== U.portal) { U.portal = h; setClickMode(null); saveUI(); renderAll(); refreshRoute(); } });
  setInterval(() => { if (S.emergency && Date.now() > S.emergency.endsAt) endEmergency('Time-box elapsed — alert ended automatically'); else if (S.emergency && U.portal === 'gov') { renderGov(); renderTop(); } }, 30000);
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').then(reg => reg.update().catch(() => {})).catch(() => {});
    let reloaded = false;   // a newer version took over: reload once so the page and scripts match it
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!hadController || reloaded) return; reloaded = true; location.reload(); });
  }

  /* ---------------- boot ---------------- */
  syncHeader();
  renderAll();
  if (S.emergency && S.mandate === 'publishing') { S.mandate = 'none'; publishMandate(); }
  map.setView([S.user.lat, S.user.lng], 15);
  refreshRoute();
})();
