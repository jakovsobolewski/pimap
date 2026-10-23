/* Cycling data for Tallinn from OpenStreetMap (© OpenStreetMap contributors, ODbL):
   bicycle parking, e-bike charging, repair stations and cycle paths / lanes.
   Loaded in the browser through the Overpass API and kept in IndexedDB for a week, so the map keeps
   working offline. If Overpass cannot be reached and nothing is cached, an optional bikedata.json
   (same shape: {v, t, points, ways}) next to index.html is used. */
window.LKP = window.LKP || {};
(function () {
  'use strict';
  const BBOX = '59.33,24.50,59.53,25.02';
  const MIRRORS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
  const DB = 'pimap-bike', STORE = 'kv', KEY = 'data', VERSION = 2, TTL = 7 * 864e5;
  const ROADS = 'primary|secondary|tertiary|unclassified|residential|living_street|service|trunk|primary_link|secondary_link|tertiary_link';
  const LANE_VALUES = '^(track|opposite_track|lane|opposite_lane|share_busway|opposite_share_busway)$';

  const Q_POINTS = `[out:json][timeout:90];(
    nwr["amenity"="bicycle_parking"](${BBOX});
    nwr["amenity"="bicycle_repair_station"](${BBOX});
    nwr["amenity"="charging_station"]["bicycle"="yes"](${BBOX});
  );out center tags;`;
  const Q_WAYS = `[out:json][timeout:120];(
    way["highway"="cycleway"](${BBOX});
    way["highway"~"^(path|footway|pedestrian|track|bridleway)$"]["bicycle"="designated"](${BBOX});
    way["highway"~"^(${ROADS})$"]["cycleway"~"${LANE_VALUES}"](${BBOX});
    way["highway"~"^(${ROADS})$"]["cycleway:left"~"${LANE_VALUES}"](${BBOX});
    way["highway"~"^(${ROADS})$"]["cycleway:right"~"${LANE_VALUES}"](${BBOX});
    way["highway"~"^(${ROADS})$"]["cycleway:both"~"${LANE_VALUES}"](${BBOX});
  );out geom tags;`;

  /* ---------- storage ---------- */
  const idb = () => new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('no indexedDB'));
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  const idbGet = () => idb().then(db => new Promise(res => { const q = db.transaction(STORE).objectStore(STORE).get(KEY); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); })).catch(() => null);
  const idbPut = v => idb().then(db => new Promise(res => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(v, KEY); tx.oncomplete = () => res(true); tx.onerror = () => res(false); })).catch(() => false);

  /* ---------- Overpass → compact records ---------- */
  const r5 = n => Math.round(n * 1e5) / 1e5;
  const yes = v => v === 'yes' || v === 'true';
  const TYPES = { stands: 'Stands', wall_loops: 'Wall loops', rack: 'Rack', shed: 'Shed', lockers: 'Lockers', building: 'Building', two_tier: 'Two-tier rack', safe_loops: 'Safe loops', anchors: 'Anchors', handlebar_holder: 'Handlebar holder', wide_stands: 'Wide stands', bollard: 'Bollard', ground_slots: 'Ground slots' };
  function toPoint(e) {
    const t = e.tags || {}, lat = e.lat != null ? e.lat : e.center && e.center.lat, lng = e.lon != null ? e.lon : e.center && e.center.lon;
    if (lat == null || lng == null) return null;
    const id = 'b' + e.type[0] + e.id, info = [];
    const addr = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ');
    const add = (k, v) => { if (v) info.push([k, String(v)]); };
    let cat, name;
    if (t.amenity === 'bicycle_parking') {
      cat = 'bikepark'; name = t.name || 'Bike parking';
      add('Type', TYPES[t.bicycle_parking] || '');
      add('Spaces', t.capacity);
      if (t.covered) add('Covered', yes(t.covered) ? 'Yes' : t.covered === 'no' ? 'No' : '');
      if (t.access && t.access !== 'yes') add('Access', t.access === 'customers' ? 'Customers only' : t.access === 'private' ? 'Private' : t.access);
      if (t.fee) add('Fee', yes(t.fee) ? 'Yes' : t.fee === 'no' ? 'Free' : t.fee);
      if (t.surveillance) add('Surveillance', yes(t.surveillance) ? 'Yes' : '');
    } else if (t.amenity === 'bicycle_repair_station') {
      cat = 'bikerepair'; name = t.name || 'Bike repair station';
      if (t.service) add('Services', t.service.split(';').map(s => s.trim().replace(/^./, c => c.toUpperCase())).join(', '));
      if (t.compressed_air) add('Air pump', yes(t.compressed_air) ? 'Yes' : '');
      if (t['service:bicycle:pump']) add('Air pump', yes(t['service:bicycle:pump']) ? 'Yes' : '');
    } else {
      cat = 'bikecharge'; name = t.name || t.operator || t.brand || 'Bike charging station';
      add('Operator', t.operator && t.operator !== name ? t.operator : '');
      add('Spaces', t.capacity);
      const sockets = Object.keys(t).filter(k => /^socket:/.test(k) && !/:(output|current|voltage)$/.test(k)).map(k => k.slice(7).replace(/_/g, ' '));
      add('Sockets', sockets.join(', '));
      if (t.fee) add('Fee', yes(t.fee) ? 'Yes' : t.fee === 'no' ? 'Free' : t.fee);
      if (t.access && t.access !== 'yes') add('Access', t.access === 'customers' ? 'Customers only' : t.access === 'private' ? 'Private' : t.access);
    }
    return { id, cat, name, address: addr, lat: r5(lat), lng: r5(lng), hours: t.opening_hours || '', wheelchair: '', info };
  }
  function wayClass(t) {
    if (t.highway === 'cycleway' || t.bicycle === 'designated' && /^(path|footway|pedestrian|track|bridleway)$/.test(t.highway || '')) return 'path';
    const v = [t.cycleway, t['cycleway:left'], t['cycleway:right'], t['cycleway:both']].filter(Boolean).join(' ');
    return /track/.test(v) ? 'track' : 'lane';
  }
  function toWay(e) {
    if (!e.geometry || e.geometry.length < 2) return null;
    const g = []; let last = '';
    e.geometry.forEach(p => { if (!p) return; const c = [r5(p.lat), r5(p.lon)], k = c.join(','); if (k !== last) { g.push(c); last = k; } });
    return g.length > 1 ? { c: wayClass(e.tags || {}), g } : null;
  }
  async function overpass(query) {
    let err;
    for (const url of MIRRORS) {
      try {
        const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 100000);
        const res = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(query), headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, signal: ctl.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const j = await res.json();
        if (!j || !Array.isArray(j.elements)) throw new Error('bad response');
        return j.elements;
      } catch (e) { err = e; }
    }
    throw err || new Error('Overpass unavailable');
  }
  async function download() {
    const [pts, ways] = await Promise.all([overpass(Q_POINTS), overpass(Q_WAYS)]);
    return { v: VERSION, t: Date.now(), points: pts.map(toPoint).filter(Boolean), ways: ways.map(toWay).filter(Boolean) };
  }

  /* ---------- state + hooks ---------- */
  const B = LKP.BIKE = { status: 'loading', points: [], ways: [], t: 0 };
  const emit = () => document.dispatchEvent(new CustomEvent('pimap:bike', { detail: B.status }));
  function apply(d, status) {
    B.points = d.points; B.ways = d.ways; B.t = d.t; B.status = status; B.index = null;
    const POIS = LKP.POIS = LKP.POIS || [];
    for (let i = POIS.length - 1; i >= 0; i--) if (/^bike(park|charge|repair)$/.test(POIS[i].cat)) POIS.splice(i, 1);
    d.points.forEach(p => POIS.push(p));
    emit();
  }
  const valid = d => d && d.v === VERSION && Array.isArray(d.points) && Array.isArray(d.ways);
  async function snapshot() {
    try { const r = await fetch('bikedata.json', { cache: 'no-cache' }); if (!r.ok) return null; const d = await r.json(); return valid(d) ? d : null; } catch (e) { return null; }
  }
  async function init() {
    const cached = await idbGet(), fresh = valid(cached) && Date.now() - cached.t < TTL;
    if (valid(cached)) apply(cached, 'ready');
    if (fresh) return;
    try {
      const d = await download();
      if (!d.points.length && !d.ways.length) throw new Error('empty');
      apply(d, 'ready'); idbPut(d);
    } catch (e) {
      if (valid(cached)) return;
      const snap = await snapshot();
      if (snap) apply(snap, 'ready'); else { B.status = 'error'; emit(); }
    }
  }
  B.retry = () => { B.status = 'loading'; emit(); init(); };

  /* ---------- how much of a route is on cycle infrastructure ----------
     Cycle ways are sampled every ~12 m into a coarse grid; route points count when a sample of that kind lies within 22 m. */
  const CELL_LAT = 0.0004, CELL_LNG = 0.0008, RANK = { path: 3, track: 2, lane: 1 };
  const mLat = 111320, mLng = lat => 111320 * Math.cos(lat * Math.PI / 180);
  function buildIndex() {
    const grid = new Map();
    B.ways.forEach(w => {
      for (let i = 1; i < w.g.length; i++) {
        const a = w.g[i - 1], b = w.g[i], n = Math.max(1, Math.ceil(Math.hypot((b[0] - a[0]) * mLat, (b[1] - a[1]) * mLng(a[0])) / 12));
        for (let k = 0; k <= n; k++) {
          const lat = a[0] + (b[0] - a[0]) * k / n, lng = a[1] + (b[1] - a[1]) * k / n, key = Math.floor(lat / CELL_LAT) + ':' + Math.floor(lng / CELL_LNG);
          let cell = grid.get(key); if (!cell) grid.set(key, cell = []);
          cell.push(lat, lng, RANK[w.c]);
        }
      }
    });
    return grid;
  }
  B.coverage = function (coords) {
    if (!B.ways.length || !coords || coords.length < 2) return null;
    const grid = B.index || (B.index = buildIndex()), count = { path: 0, track: 0, lane: 0, none: 0 }, names = ['', 'lane', 'track', 'path'];
    const samples = [];
    for (let i = 1; i < coords.length; i++) {
      const a = coords[i - 1], b = coords[i], n = Math.max(1, Math.ceil(Math.hypot((b[0] - a[0]) * mLat, (b[1] - a[1]) * mLng(a[0])) / 20));
      for (let k = 0; k < n; k++) samples.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    samples.push(coords[coords.length - 1]);
    samples.forEach(([lat, lng]) => {
      const ci = Math.floor(lat / CELL_LAT), cj = Math.floor(lng / CELL_LNG), ml = mLng(lat); let best = 0;
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
        const cell = grid.get((ci + di) + ':' + (cj + dj)); if (!cell) continue;
        for (let q = 0; q < cell.length; q += 3) if (cell[q + 2] > best && Math.hypot((cell[q] - lat) * mLat, (cell[q + 1] - lng) * ml) <= 22) best = cell[q + 2];
      }
      count[names[best] || 'none']++;
    });
    const total = samples.length;
    return { path: count.path / total, track: count.track / total, lane: count.lane / total, any: (total - count.none) / total };
  };

  init();
})();
