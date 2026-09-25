/* ============================================================
   The Last-Kilometre Protocol — demo data (Tallinn)
   Coordinates are approximate, capacities are placeholders.
   Everything here is seed data for the hackathon prototype.
   ============================================================ */
window.LKP = window.LKP || {};

LKP.CITY_CENTER = [59.437, 24.7536];

LKP.DISTRICTS = [
  'All of Tallinn', 'Kesklinn', 'Põhja-Tallinn', 'Kristiine',
  'Lasnamäe', 'Mustamäe', 'Nõmme', 'Haabersti', 'Pirita'
];

/* Public shelters (avalikud varjumiskohad) in Tallinn — official data.
   Source: Päästeamet open data via the Maa- ja Ruumiamet geoportal
   (xgis.maaamet.ee, app "paasteamet_varjumiskohad", WMS layer VARJEKOHT),
   linked from https://www.rescue.ee/en/instruction/public-shelters
   Data as of 23.09.2026. 52 shelters with OV = Tallinn.
   The public dataset has no capacity or step-free access fields, so both are null (unknown). */
LKP.SHELTER_SOURCE = { name: 'Päästeamet · avalikud varjumiskohad', date: '23.09.2026', url: 'https://www.rescue.ee/en/instruction/public-shelters' };
LKP.SHELTERS = [
  { id: 's1', sourceId: "PÕ30306", name: "Balti Jaama Turg", address: "Kopli tn 1", district: "Põhja-Tallinn", lat: 59.441175, lng: 24.735096, capacity: null, accessible: null },
  { id: 's2', sourceId: "PÕ41281", name: "Balti jaama jalakäiate tunnel", address: "Toompuiestee T2", district: "Kesklinn", lat: 59.440042, lng: 24.739100, capacity: null, accessible: null },
  { id: 's3', sourceId: "123456", name: "Coop maja", address: "Maakri tn 30", district: "Kesklinn", lat: 59.432914, lng: 24.759180, capacity: null, accessible: null },
  { id: 's4', sourceId: "PÕ56860", name: "Eakate päevakeskus", address: "Ehitajate tee 82", district: "Mustamäe", lat: 59.407438, lng: 24.672878, capacity: null, accessible: null },
  { id: 's5', sourceId: "PÕ67096", name: "Filtri tee jalakäijate tunnel", address: "Järvevana tee T2", district: "Kesklinn", lat: 59.421026, lng: 24.772150, capacity: null, accessible: null },
  { id: 's6', sourceId: "PÕ44698", name: "Haabersti LOV", address: "Ehitajate tee 109a/1", district: "Haabersti", lat: 59.413620, lng: 24.656458, capacity: null, accessible: null },
  { id: 's7', sourceId: "PÕ963", name: "Kaarli pst jalakäijate tunnel", address: "Vabaduse väljak 9 // Kaarli puiestee T2", district: "Kesklinn", lat: 59.432704, lng: 24.743358, capacity: null, accessible: null },
  { id: 's8', sourceId: "PÕ45248", name: "Kadrioru pargi Oranzerii", address: "L. Koidula tn 34a", district: "Kesklinn", lat: 59.436548, lng: 24.786412, capacity: null, accessible: null },
  { id: 's9', sourceId: "PÕ32789", name: "Kakumäe Selver", address: "Rannamõisa tee 6", district: "Haabersti", lat: 59.428269, lng: 24.626290, capacity: null, accessible: null },
  { id: 's10', sourceId: "PÕ30495", name: "Kaubamaja jalakäiate tunnel", address: "Ants Laikmaa tänav", district: "Kesklinn", lat: 59.435577, lng: 24.757584, capacity: null, accessible: null },
  { id: 's11', sourceId: "PÕ54183", name: "Keskkonnaagentuuri kelder", address: "Kirsi tn 1 // Mustamäe tee 33", district: "Kristiine", lat: 59.423757, lng: 24.700712, capacity: null, accessible: null },
  { id: 's12', sourceId: "PÕ39358", name: "Kesklinna sotsiaalkeskus", address: "Juhkentali tn 2 // Liivalaia tn 32", district: "Kesklinn", lat: 59.429079, lng: 24.756374, capacity: null, accessible: null },
  { id: 's13', sourceId: "PÕ95771", name: "Kristiine lo valitsus", address: "Metalli tn 5", district: "Kristiine", lat: 59.427746, lng: 24.707694, capacity: null, accessible: null },
  { id: 's14', sourceId: "PÕ70216", name: "Kultuurikatel", address: "Kursi tn 3", district: "Põhja-Tallinn", lat: 59.444685, lng: 24.750897, capacity: null, accessible: null },
  { id: 's15', sourceId: "PÕ48530", name: "Kultuurikeskus Kaja/ Mustame LOV", address: "E. Vilde tee 118", district: "Mustamäe", lat: 59.404122, lng: 24.666278, capacity: null, accessible: null },
  { id: 's16', sourceId: "PÕ81100", name: "Kunstigalerii kelder", address: "Müürivahe tn 28 // Pärnu mnt 6", district: "Kesklinn", lat: 59.435595, lng: 24.749031, capacity: null, accessible: null },
  { id: 's17', sourceId: "PÕ56747", name: "Lasnamäe spordikompleks", address: "Pae tn 1", district: "Lasnamäe", lat: 59.426285, lng: 24.799033, capacity: null, accessible: null },
  { id: 's18', sourceId: "PÕ15527", name: "Liivalaia jalakäiate tunnel", address: "Liivalaia tänav T1", district: "Kesklinn", lat: 59.427685, lng: 24.745890, capacity: null, accessible: null },
  { id: 's19', sourceId: "PÕ81111", name: "Lindakivi kultuurikeskus", address: "J. Koorti tn 22", district: "Lasnamäe", lat: 59.440815, lng: 24.831599, capacity: null, accessible: null },
  { id: 's20', sourceId: "PÕ987", name: "Loomaaia tunnel", address: "Ehitajate tee T20", district: "Haabersti", lat: 59.422857, lng: 24.647667, capacity: null, accessible: null },
  { id: 's21', sourceId: "PÕ54192", name: "Lotomaja", address: "Hallivanamehe tn 4", district: "Kesklinn", lat: 59.409206, lng: 24.734235, capacity: null, accessible: null },
  { id: 's22', sourceId: "PÕ13450", name: "Mahla tn jalakäijate tunnel", address: "Männiku tee T1", district: "Nõmme", lat: 59.388782, lng: 24.719701, capacity: null, accessible: null },
  { id: 's23', sourceId: "PÕ37185", name: "Margareeta aed Bunker", address: "Pikk tn 72", district: "Kesklinn", lat: 59.442815, lng: 24.749836, capacity: null, accessible: null },
  { id: 's24', sourceId: "PÕ37530", name: "Margareeta aed Citysec", address: "Pikk tn 72 // Margareeta aed", district: "Kesklinn", lat: 59.442341, lng: 24.750438, capacity: null, accessible: null },
  { id: 's25', sourceId: "PÕ22421", name: "Mustakivi jalakäijate tunnel", address: "Mahtra tn 31 // Laagna tee T8", district: "Lasnamäe", lat: 59.442999, lng: 24.874301, capacity: null, accessible: null },
  { id: 's26', sourceId: "PÕ54193", name: "Mustika keskus", address: "Karjavälja tn 4", district: "Mustamäe", lat: 59.410777, lng: 24.684336, capacity: null, accessible: null },
  { id: 's27', sourceId: "PÕ54365", name: "Nõmme lo valitsus", address: "Valdeku tn 13", district: "Nõmme", lat: 59.384179, lng: 24.691923, capacity: null, accessible: null },
  { id: 's28', sourceId: "PÕ22219", name: "Pirita Majandus-gümnaasium", address: "Metsavahi tee 19", district: "Pirita", lat: 59.470172, lng: 24.841677, capacity: null, accessible: null },
  { id: 's29', sourceId: "PÕ82493", name: "Pirita lo valitsus", address: "Kloostri tee 6", district: "Pirita", lat: 59.465861, lng: 24.833582, capacity: null, accessible: null },
  { id: 's30', sourceId: "PÕ97982", name: "Pääsküla Noortekeskus", address: "Rännaku pst 1", district: "Nõmme", lat: 59.369037, lng: 24.642537, capacity: null, accessible: null },
  { id: 's31', sourceId: "PÕ33432", name: "Põhja Spordihoone", address: "Kopli tn 98 // Uus-Maleva tn 10", district: "Põhja-Tallinn", lat: 59.456418, lng: 24.685657, capacity: null, accessible: null },
  { id: 's32', sourceId: "PÕ2149", name: "Põhja-Tallinna Tegevuskeskus", address: "Sõle tn 61a", district: "Põhja-Tallinn", lat: 59.449923, lng: 24.696327, capacity: null, accessible: null },
  { id: 's33', sourceId: "PÕ98501", name: "RKAS büroohoone maa-aluneparkla", address: "Lasnamäe tn 2", district: "Lasnamäe", lat: 59.427161, lng: 24.782047, capacity: null, accessible: null },
  { id: 's34', sourceId: "PÕ21312", name: "Renniotsa jalakäijate tunnel", address: "Järvevana tee T4", district: "Kesklinn", lat: 59.413792, lng: 24.759285, capacity: null, accessible: null },
  { id: 's35', sourceId: "PÕ45250", name: "Reval Sport", address: "Aia tn 20", district: "Kesklinn", lat: 59.440675, lng: 24.751435, capacity: null, accessible: null },
  { id: 's36', sourceId: "PÕ45241", name: "Rotermanni maa-alune parkls", address: "Rotermanni tn 5", district: "Kesklinn", lat: 59.439176, lng: 24.756222, capacity: null, accessible: null },
  { id: 's37', sourceId: "PÕ59078", name: "Salme kultuurikeskus", address: "Salme tn 12", district: "Põhja-Tallinn", lat: 59.444895, lng: 24.729636, capacity: null, accessible: null },
  { id: 's38', sourceId: "PÕ79788", name: "Solarise keskus", address: "Estonia pst 9 // Rävala pst 12", district: "Kesklinn", lat: 59.433200, lng: 24.751509, capacity: null, accessible: null },
  { id: 's39', sourceId: "PÕ48908", name: "Sotsiaalmaja", address: "Pihlaka tn 12", district: "Nõmme", lat: 59.374439, lng: 24.712558, capacity: null, accessible: null },
  { id: 's40', sourceId: "PÕ986", name: "Suurhalli tunnel", address: "Haabersti liiklussõlm", district: "Haabersti", lat: 59.423849, lng: 24.646775, capacity: null, accessible: null },
  { id: 's41', sourceId: "PÕ46850", name: "Tallinna Humanitaargümnaasium", address: "Koidu tn 97 // Virmalise tn 27", district: "Kesklinn", lat: 59.422026, lng: 24.738846, capacity: null, accessible: null },
  { id: 's42', sourceId: "PÕ22226", name: "Tallinna Järveotsa Gümnaasium", address: "Järveotsa tee 31", district: "Haabersti", lat: 59.409846, lng: 24.640040, capacity: null, accessible: null },
  { id: 's43', sourceId: "PÕ98512", name: "Tallinna Kuristiku Gümnaasium", address: "K. Kärberi tn 9", district: "Lasnamäe", lat: 59.445969, lng: 24.879776, capacity: null, accessible: null },
  { id: 's44', sourceId: "PÕ54198", name: "Tallinna Lennujaam", address: "Tartu mnt 101", district: "Lasnamäe", lat: 59.416396, lng: 24.798910, capacity: null, accessible: null },
  { id: 's45', sourceId: "PÕ45011", name: "Tallinna Läänemere Gümnaasium", address: "Vormsi tn 3", district: "Lasnamäe", lat: 59.454055, lng: 24.868130, capacity: null, accessible: null },
  { id: 's46', sourceId: "PÕ1289", name: "Tallinna Õismäe Gümnaasium", address: "Õismäe tee 50", district: "Haabersti", lat: 59.413565, lng: 24.645393, capacity: null, accessible: null },
  { id: 's47', sourceId: "PÕ68331", name: "Tondiraba jalakäijate tunnel", address: "Laagna tee T7", district: "Lasnamäe", lat: 59.441162, lng: 24.859244, capacity: null, accessible: null },
  { id: 's48', sourceId: "PÕ65819", name: "Tondiraba jäähall", address: "Varraku tn 14", district: "Lasnamäe", lat: 59.443196, lng: 24.848777, capacity: null, accessible: null },
  { id: 's49', sourceId: "PÕ47921", name: "Tornimäe maa-alune parkla", address: "Väike-Pääsukese tn 5", district: "Kesklinn", lat: 59.433844, lng: 24.759955, capacity: null, accessible: null },
  { id: 's50', sourceId: "PÕ59675", name: "Vabaduse väljaku maa-alune parkla", address: "Vabaduse väljak 9", district: "Kesklinn", lat: 59.433443, lng: 24.744117, capacity: null, accessible: null },
  { id: 's51', sourceId: "PÕ54195", name: "Öpiku majad", address: "Valukoja tn 8/2", district: "Lasnamäe", lat: 59.419588, lng: 24.804473, capacity: null, accessible: null },
  { id: 's52', sourceId: "PÕ24722", name: "Ülemiste keskus", address: "Suur-Sõjamäe tn 4", district: "Lasnamäe", lat: 59.421702, lng: 24.793278, capacity: null, accessible: null },
];

/* Shared-mobility operators addressed by the Emergency Unlock Mandate */
LKP.OPERATORS = [
  { id: 'bolt',  name: 'Bolt',  letter: 'B', mdsProviderId: '2e4cb206-b2a4-4a3e-9a7e-1f0c9b0d0001',
    vehicleTypes: ['scooter', 'bicycle'], accessible: false,
    endpoint: 'https://mds.bolt.eu/agency/v2/policy-compliance' },
  { id: 'tuul',  name: 'Tuul',  letter: 'T', mdsProviderId: '8a1e5d2b-6d5c-4c7f-8a1b-2f0c9b0d0002',
    vehicleTypes: ['scooter'], accessible: false,
    endpoint: 'https://api.tuul.ee/mds/policy-compliance' },
  { id: 'pinge', name: 'Pinge', letter: 'P', mdsProviderId: 'c3f7a9e1-4b2d-4e8f-9c6a-3f0c9b0d0003',
    vehicleTypes: ['etricycle', 'mobility_aid'], accessible: true,
    endpoint: 'https://fleet.pinge-e.com/mds/policy-compliance' },
];

LKP.VEHICLE_LABELS = {
  scooter: 'E-scooter', bicycle: 'City bike', ebike: 'E-bike', cargo: 'Cargo bike',
  etricycle: 'Pinge eTricycle', mobility_aid: 'Mobility aid (Pinge)',
  wheelchair: 'Wheelchair', rollator: 'Rollator', car: 'Car', van: 'Van'
};

/* Deterministic PRNG so the demo looks the same on every device */
LKP.rng = function (seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

LKP.seedFleet = function () {
  const r = LKP.rng(20260924);
  const box = { latMin: 59.412, latMax: 59.452, lngMin: 24.700, lngMax: 24.805 };
  const counts = { bolt: 28, tuul: 18, pinge: 12 };
  const fleet = [];
  for (const op of LKP.OPERATORS) {
    for (let i = 0; i < counts[op.id]; i++) {
      const type = op.vehicleTypes[Math.floor(r() * op.vehicleTypes.length)];
      fleet.push({
        id: `${op.id}-${String(i + 1).padStart(3, '0')}`,
        operatorId: op.id,
        type,
        lat: box.latMin + r() * (box.latMax - box.latMin),
        lng: box.lngMin + r() * (box.lngMax - box.lngMin),
        battery: 35 + Math.floor(r() * 65),
        accessible: op.accessible,
        unlocked: false,       // set true by the mandate when inside a shelter geofence
        claimedBy: null,
        fare: type === 'scooter' ? 0.99 : 1.49
      });
    }
  }
  return fleet;
};

/* Pirent dormant listings — neighbours' spare bikes, scooters and mobility aids */
LKP.seedListings = function () {
  const now = Date.now();
  return [
    { id: 'l1', owner: 'Kadri',  type: 'bicycle',    label: 'Blue city bike, basket',        lat: 59.4468, lng: 24.7318, accessible: false, unlock: 'Combination lock — code sent on activation', contact: 'Door 4, Soo 12', status: 'dormant', createdAt: now - 86400e3 * 30, mine: false },
    { id: 'l2', owner: 'Priit',  type: 'scooter',    label: 'Xiaomi e-scooter, charged',     lat: 59.4436, lng: 24.7402, accessible: false, unlock: 'Kept unlocked in stairwell',           contact: 'Vabriku 7',      status: 'dormant', createdAt: now - 86400e3 * 21, mine: false },
    { id: 'l3', owner: 'Anu',    type: 'wheelchair', label: 'Manual wheelchair, folding',    lat: 59.4421, lng: 24.7288, accessible: true,  unlock: 'Ring bell, ground floor',            contact: 'Kalju 3',        status: 'dormant', createdAt: now - 86400e3 * 14, mine: false },
    { id: 'l4', owner: 'Marek',  type: 'cargo',      label: 'Cargo bike, seats 2 children',  lat: 59.4389, lng: 24.7450, accessible: false, unlock: 'Key box, code on activation',        contact: 'Kotzebue 9',     status: 'dormant', createdAt: now - 86400e3 * 10, mine: false },
    { id: 'l5', owner: 'Liis',   type: 'rollator',   label: 'Rollator with seat',            lat: 59.4352, lng: 24.7501, accessible: true,  unlock: 'Reception desk',                     contact: 'Rävala pst 5',   status: 'dormant', createdAt: now - 86400e3 * 7,  mine: false },
    { id: 'l6', owner: 'Tõnu',   type: 'ebike',      label: 'E-bike, 60 km range',           lat: 59.4312, lng: 24.7605, accessible: false, unlock: 'Garage, code on activation',         contact: 'Tartu mnt 18',   status: 'dormant', createdAt: now - 86400e3 * 3,  mine: false },
    { id: 'l7', owner: 'Helen',  type: 'bicycle',    label: 'Kids bike + adult bike',        lat: 59.4295, lng: 24.7250, accessible: false, unlock: 'Yard, unlocked on activation',       contact: 'Tulika 19',      status: 'dormant', createdAt: now - 86400e3 * 2,  mine: false },
  ];
};

/* Neighbours who can drive someone: own-vehicle users who offered spare seats */
LKP.seedVolunteers = function () {
  return [
    { id: 'v1', name: 'Mari',            vehicle: 'car', seats: 3, accessible: false, lat: 59.4473, lng: 24.7365, available: true, source: 'neighbour' },
    { id: 'v2', name: 'Jaan',            vehicle: 'van', seats: 6, accessible: true,  lat: 59.4415, lng: 24.7480, available: true, source: 'neighbour' },
    { id: 'v3', name: 'Pinge crew 1',    vehicle: 'etricycle', seats: 1, accessible: true, lat: 59.4380, lng: 24.7360, available: true, source: 'pinge' },
    { id: 'v4', name: 'Pinge crew 2',    vehicle: 'etricycle', seats: 1, accessible: true, lat: 59.4340, lng: 24.7580, available: true, source: 'pinge' },
    { id: 'v5', name: 'Kristjan',        vehicle: 'car', seats: 2, accessible: false, lat: 59.4300, lng: 24.7300, available: true, source: 'neighbour' },
  ];
};

/* Construction works registered by the municipality (demo) */
LKP.WORK_TYPES = { roadworks: 'Roadworks', building: 'Building site', utility: 'Utility works', closure: 'Street closure', tram: 'Tram line works' };
LKP.seedWorks = function () {
  const day = 86400e3, t = Date.now();
  const iso = ms => new Date(ms).toISOString().slice(0, 10);
  return [
    { id: 'w1', name: 'Vana-Kalamaja street reconstruction', type: 'roadworks', note: 'Pavement closed on the north side, pedestrians use the south side', lat: 59.4428, lng: 24.7368, radius: 140, start: iso(t - 20 * day), end: iso(t + 40 * day), affects: { walk: true, bike: true, drive: true }, mine: false, updatedAt: t - 2 * day },
    { id: 'w2', name: 'Kopli tram line works', type: 'tram', note: 'Tram tracks being replaced, cycle lane diverted', lat: 59.4404, lng: 24.7332, radius: 120, start: iso(t - 5 * day), end: iso(t + 90 * day), affects: { walk: false, bike: true, drive: true }, mine: false, updatedAt: t - 2 * day },
    { id: 'w3', name: 'Pärnu mnt utility works', type: 'utility', note: 'District heating pipe, one lane closed', lat: 59.4318, lng: 24.7470, radius: 90, start: iso(t + 10 * day), end: iso(t + 24 * day), affects: { walk: false, bike: false, drive: true }, mine: false, updatedAt: t - 2 * day },
  ];
};

/* Emergency protocols the city can declare. Each one changes where citizens are
   sent and how their route is chosen. */
LKP.PROTOCOLS = {
  airstrike: {
    label: 'War / air strike', dest: 'shelter', destLabel: 'public shelter', autoUnlock: true, hazard: null, routing: null,
    summary: 'Routes to public shelters. Fleets unlock, neighbours lend, pick-ups for people who cannot walk.',
    message: 'Air raid warning. Go to the nearest public shelter now. If you cannot reach one, stay in a windowless room or basement.',
    tips: ['Go below ground if you can: basements, underpasses, parking garages.', 'Keep away from windows and glass facades.', 'Take water, medicine and your phone.']
  },
  flood: {
    label: 'Flood', dest: 'dry', destLabel: 'dry shelter', autoUnlock: true, hazard: 'flood', routing: 'avoid',
    summary: 'The city marks flooded areas. Routes go around them to shelters on dry ground.',
    message: 'Flood warning. Leave low-lying and coastal streets. Your route avoids flooded areas.',
    tips: ['Never walk or drive through moving water: 15 cm can knock you over, 30 cm can float a car.', 'Move to higher ground or an upper floor.', 'Stay away from rivers, the shoreline and open drains.']
  },
  heat: {
    label: 'Heatwave', dest: 'cool', destLabel: 'cool place', autoUnlock: false, hazard: null, routing: 'shade',
    summary: 'Routes to cool indoor places (libraries, shopping centres), choosing streets shaded by buildings and trees.',
    message: 'Heat warning. Avoid direct sun between 11:00 and 17:00. Go to a cool indoor place; your route follows the shade.',
    tips: ['Walk on the shaded side of the street.', 'Drink water every 20 minutes, even if you are not thirsty.', 'Check on elderly neighbours and never leave anyone in a parked car.']
  },
  storm: {
    label: 'Storm', dest: 'indoor', destLabel: 'safe indoor place', autoUnlock: false, hazard: 'unsafe', routing: 'safe',
    summary: 'Routes to indoor safe places, avoiding marked unsafe places, trees, the shoreline and construction sites.',
    message: 'Storm warning. Get indoors now. Your route avoids trees, the shoreline, construction sites and unsafe places.',
    tips: ['Keep away from trees, scaffolding, cranes and power lines.', 'Stay off the shoreline and piers.', 'Do not ride shared scooters or bikes in strong wind.']
  }
};

/* Example hazard zones for the flood and storm protocols. These are illustrative
   demo areas drawn for the prototype, not official flood-risk or damage data. */
LKP.seedHazards = function () {
  return [
    { id: 'h1', kind: 'flood', name: 'Kalamaja low streets (Soo tn)', lat: 59.4452, lng: 24.7330, radius: 100, example: true },
    { id: 'h2', kind: 'flood', name: 'Kalaranna shoreline', lat: 59.4492, lng: 24.7440, radius: 240, example: true },
    { id: 'h3', kind: 'flood', name: 'Pirita river mouth', lat: 59.4668, lng: 24.8318, radius: 380, example: true },
    { id: 'h4', kind: 'flood', name: 'Stroomi beach and Pelgulinn low ground', lat: 59.4462, lng: 24.6965, radius: 340, example: true },
    { id: 'h5', kind: 'flood', name: 'Kadriorg shore, Pirita tee', lat: 59.4440, lng: 24.7920, radius: 260, example: true },
    { id: 'h6', kind: 'unsafe', name: 'Fallen trees, Kadriorg park', lat: 59.4385, lng: 24.7880, radius: 250, example: true },
    { id: 'h7', kind: 'unsafe', name: 'Flying debris, Linnahall seafront', lat: 59.4470, lng: 24.7545, radius: 180, example: true },
    { id: 'h8', kind: 'unsafe', name: 'Loose roofing, Kalamaja (Kotzebue tn)', lat: 59.4442, lng: 24.7338, radius: 70, example: true }
  ];
};

/* Example storm reports (fallen trees, branches, trees at risk). Shown only during a
   storm alert so the demo has something to see; real reports come from citizens and crews. */
LKP.seedReports = function () {
  const t = Date.now();
  return [
    { id: 'r1', type: 'fallen_tree', lat: 59.4436, lng: 24.7368, note: 'Birch across the pavement', by: 'citizen', status: 'confirmed', createdAt: t - 40 * 60e3, example: true },
    { id: 'r2', type: 'branches', lat: 59.4463, lng: 24.7296, note: 'Large branches on the cycle path', by: 'citizen', status: 'reported', createdAt: t - 15 * 60e3, example: true },
    { id: 'r3', type: 'tree', lat: 59.4417, lng: 24.7306, note: 'Old poplar leaning over the playground', by: 'city', status: 'confirmed', createdAt: t - 90 * 60e3, example: true },
    { id: 'r4', type: 'fallen_tree', lat: 59.4378, lng: 24.7905, note: 'Lime tree down on Kadrioru tee', by: 'city', status: 'confirmed', createdAt: t - 70 * 60e3, example: true }
  ];
};

/* Example citizen contributions (issues and ideas) so the community layer is not empty.
   Marked example: true; real ones come from residents in the app. */
LKP.seedContribs = function () {
  const t = Date.now(), h = 3600e3, day = 86400e3;
  return [
    { id: 'c1', kind: 'issue', cat: 'road', title: 'Deep pothole on the cycle path', note: 'Next to the Kalamaja park entrance, easy to fall at night.', lat: 59.4459, lng: 24.7329, by: 'citizen', status: 'planned', votes: 23, comments: [{ by: 'citizen', text: 'Nearly came off my bike here yesterday.', at: t - 20 * h }, { by: 'city', text: 'Thank you. Repair is scheduled with the October pavement works.', at: t - 6 * h }], createdAt: t - 3 * day, example: true },
    { id: 'c2', kind: 'issue', cat: 'light', title: 'Street light out on Kotzebue', note: 'Two lamps dark between Soo and Vana-Kalamaja.', lat: 59.4436, lng: 24.7378, by: 'citizen', status: 'new', votes: 9, comments: [], createdAt: t - 9 * h, example: true },
    { id: 'c3', kind: 'issue', cat: 'access', title: 'No ramp at the tram stop kerb', note: 'Wheelchair users cannot get onto the platform from the crossing.', lat: 59.4412, lng: 24.7292, by: 'citizen', status: 'seen', votes: 31, comments: [{ by: 'citizen', text: 'Same problem with a pram.', at: t - 2 * day }], createdAt: t - 5 * day, example: true },
    { id: 'c4', kind: 'idea', cat: 'bike', title: 'Bike racks by the Balti jaam market', note: 'Bikes are chained to every fence on market days.', lat: 59.4414, lng: 24.7355, by: 'citizen', status: 'new', votes: 47, comments: [{ by: 'citizen', text: 'Yes please, covered ones if possible.', at: t - day }], createdAt: t - 4 * day, example: true },
    { id: 'c5', kind: 'idea', cat: 'green', title: 'Plant street trees on Tööstuse', note: 'No shade at all in summer; would also help in a heatwave.', lat: 59.4448, lng: 24.7306, by: 'citizen', status: 'new', votes: 18, comments: [], createdAt: t - 2 * day, example: true },
    { id: 'c6', kind: 'idea', cat: 'bench', title: 'Benches along the Kalaranna promenade', note: 'Older residents have nowhere to rest between the tram and the sea.', lat: 59.4486, lng: 24.7415, by: 'citizen', status: 'progress', votes: 26, comments: [{ by: 'city', text: 'Six benches are being installed this autumn.', at: t - 3 * day }], createdAt: t - 12 * day, example: true },
    { id: 'c7', kind: 'issue', cat: 'litter', title: 'Illegal dumping behind the garages', note: 'Old furniture and tyres.', lat: 59.4471, lng: 24.7262, by: 'citizen', status: 'done', votes: 12, comments: [{ by: 'city', text: 'Cleared on 22 September.', at: t - 3 * day }], createdAt: t - 9 * day, example: true }
  ];
};

/* Default message pushed by EE-ALARM on declaration */
LKP.DEFAULT_ALERT = 'Seek shelter now. Sirens are active. Your nearest shelter and route are attached. If you cannot walk it, use Borrow or Request a ride.';
