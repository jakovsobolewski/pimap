/* ============================================================
   Mock MDS (Mobility Data Specification) — Policy API
   The Rescue Board acts as the *agency*. Operators (Bolt, Tuul,
   Pinge) act as *providers*. In production the agency publishes
   a Policy + Geographies; providers poll /policies and apply
   the rules to their fleets. Here the whole exchange is simulated
   in the browser and every call is written to a visible log.
   ============================================================ */
window.LKP = window.LKP || {};

LKP.MDS = (function () {
  const AGENCY = {
    name: 'Päästeamet — Estonian Rescue Board',
    agency_id: 'ee-rescue-board',
    base: 'https://mds.rescue.ee/policy'
  };
  const VERSION = '2.0.0';

  function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
  }
  const delay = ms => new Promise(res => setTimeout(res, ms));

  /* GeoJSON circle polygon around a point (metres) */
  function circle(lat, lng, radiusM, steps = 36) {
    const coords = [];
    const dLat = radiusM / 111320;
    const dLng = radiusM / (111320 * Math.cos(lat * Math.PI / 180));
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * 2 * Math.PI;
      coords.push([+(lng + dLng * Math.cos(a)).toFixed(6), +(lat + dLat * Math.sin(a)).toFixed(6)]);
    }
    return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [coords] } };
  }

  function buildGeographies(shelters, radiusM, now) {
    return shelters.map(s => ({
      geography_id: 'geo-' + s.id,
      name: 'Shelter geofence — ' + s.name,
      description: `${radiusM} m radius around public shelter ${s.name}`,
      effective_date: now,
      publish_date: now,
      geography_json: { type: 'FeatureCollection', features: [circle(s.lat, s.lng, radiusM)] }
    }));
  }

  function buildPolicy(emergency, shelters, operators, radiusM) {
    const now = Date.now();
    const geoIds = shelters.map(s => 'geo-' + s.id);
    const vehicleTypes = ['bicycle', 'cargo_bicycle', 'scooter', 'moped', 'other'];
    return {
      version: VERSION,
      updated: now,
      policies: [{
        policy_id: emergency.policyId,
        name: 'Emergency Unlock Mandate',
        description: `Declared by ${AGENCY.name} for ${emergency.district}. All shared light vehicles inside shelter geofences are released at zero fare for the duration of the alert so residents can reach the nearest public shelter. Time-boxed, geofenced, revoked automatically at end_date.`,
        provider_ids: operators.map(o => o.mdsProviderId),
        start_date: emergency.declaredAt,
        end_date: emergency.endsAt,
        published_date: now,
        prev_policies: null,
        currency: 'EUR',
        rules: [
          {
            rule_id: uuid(),
            name: 'Zero fare on unlock inside shelter geofences',
            rule_type: 'rate',
            rule_units: 'amount',
            rate_amount: 0,
            rate_recurrence: 'once_on_unlock',
            geographies: geoIds,
            states: { available: ['reservation_start', 'trip_start'] },
            vehicle_types: vehicleTypes,
            messages: {
              'en-EE': 'Emergency alert: free unlock to reach your nearest shelter.',
              'et-EE': 'Hädaolukord: tasuta avamine lähima varjumiskohani jõudmiseks.'
            }
          },
          {
            rule_id: uuid(),
            name: 'Trips may only end inside a shelter geofence',
            rule_type: 'count',
            rule_units: 'devices',
            maximum: 0,
            geographies: ['geo-tallinn-outside-shelters'],
            states: { available: ['trip_end'] },
            vehicle_types: vehicleTypes,
            messages: { 'en-EE': 'Please end your trip at the shelter.' }
          },
          {
            rule_id: uuid(),
            name: 'Accessible vehicles held for mobility-impaired riders',
            rule_type: 'user',
            geographies: geoIds,
            vehicle_types: ['other'],
            messages: { 'en-EE': 'eTricycles and mobility aids are reserved for riders who cannot walk to a shelter.' }
          },
          {
            rule_id: uuid(),
            name: 'No repositioning or rebalancing out of geofences',
            rule_type: 'count',
            rule_units: 'devices',
            maximum: 0,
            geographies: geoIds,
            states: { removed: ['rebalance_pick_up', 'maintenance_pick_up'] },
            vehicle_types: vehicleTypes
          }
        ]
      }]
    };
  }

  /* Simulated exchange: agency publishes, each provider polls and applies.
     applyFn(operator) must perform the fleet change and return { unlocked, inGeofence, total } */
  async function publish({ policy, geographies, operators, log, applyFn, onAck }) {
    const pid = policy.policies[0].policy_id;
    log({ actor: 'agency', dir: 'out', method: 'POST', url: `${AGENCY.base}/geographies`, status: 201,
      body: { count: geographies.length, geography_ids: geographies.map(g => g.geography_id) } });
    await delay(250);
    log({ actor: 'agency', dir: 'out', method: 'POST', url: `${AGENCY.base}/policies`, status: 201,
      body: { policy_id: pid, name: policy.policies[0].name, start_date: policy.policies[0].start_date, end_date: policy.policies[0].end_date, rules: policy.policies[0].rules.length } });

    for (const op of operators) {
      await delay(350 + Math.random() * 500);
      log({ actor: op.id, dir: 'in', method: 'GET', url: `${AGENCY.base}/policies?start_date=${policy.policies[0].start_date}`, status: 200,
        body: { policies: 1, provider_id: op.mdsProviderId } });
      await delay(200 + Math.random() * 300);
      const result = applyFn(op);
      const ack = {
        policy_id: pid, provider_id: op.mdsProviderId, status: 'applied',
        vehicles_in_geofence: result.inGeofence, vehicles_zero_fare: result.unlocked,
        fleet_total: result.total, applied_at: Date.now()
      };
      log({ actor: op.id, dir: 'out', method: 'POST', url: op.endpoint, status: 200, body: ack });
      onAck(op, ack);
    }
  }

  /* Provider-side call when a resident taps Unlock on a specific vehicle */
  async function unlockVehicle({ operator, vehicle, policyId, log }) {
    await delay(300 + Math.random() * 400);
    const code = 'LKP-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const body = {
      device_id: vehicle.id, event_types: ['trip_start'], vehicle_state: 'on_trip',
      trip_id: uuid(), fare: 0, currency: 'EUR', policy_id: policyId, unlock_code: code, timestamp: Date.now()
    };
    log({ actor: operator.id, dir: 'out', method: 'POST', url: `${operator.endpoint.replace('policy-compliance', 'vehicles')}/${vehicle.id}/event`, status: 201, body });
    return body;
  }

  async function revoke({ policy, operators, log, onAck }) {
    const pid = policy.policies[0].policy_id;
    log({ actor: 'agency', dir: 'out', method: 'PATCH', url: `${AGENCY.base}/policies/${pid}`, status: 200,
      body: { policy_id: pid, end_date: Date.now(), reason: 'alert_ended' } });
    for (const op of operators) {
      await delay(200 + Math.random() * 300);
      const ack = { policy_id: pid, provider_id: op.mdsProviderId, status: 'revoked', restored_pricing: true, applied_at: Date.now() };
      log({ actor: op.id, dir: 'out', method: 'POST', url: op.endpoint, status: 200, body: ack });
      onAck(op, ack);
    }
  }

  return { AGENCY, VERSION, uuid, circle, buildGeographies, buildPolicy, publish, unlockVehicle, revoke };
})();
