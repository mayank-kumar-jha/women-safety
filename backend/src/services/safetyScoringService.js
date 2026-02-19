import crypto from 'crypto';
import { nearbyPlaces } from './googleMapsService.js';

const DEFAULT_WEIGHTS = {
  poiDensity: 0.35,
  openBusinessDensity: 0.2,
  urbanDensity: 0.25,
  isolationPenalty: 0.1,
  nightPenalty: 0.1
};

const midPoint = (route) => {
  const leg = route.legs?.[0];
  const s = leg?.start_location;
  const e = leg?.end_location;
  return `${(s.lat + e.lat) / 2},${(s.lng + e.lng) / 2}`;
};

const clamp100 = (v) => Math.max(0, Math.min(100, Math.round(v)));

export const getRouteHash = ({ source, destination }) =>
  crypto.createHash('sha256').update(`${source}:${destination}:${new Date().toISOString().slice(0, 13)}`).digest('hex');

export const computeRouteSafety = async (route, when = new Date(), weights = DEFAULT_WEIGHTS) => {
  const location = midPoint(route);
  const [police, hospitals, pharmacies, transit, stores, restaurants, openNowBusinesses] = await Promise.all([
    nearbyPlaces({ location, type: 'police' }),
    nearbyPlaces({ location, type: 'hospital' }),
    nearbyPlaces({ location, type: 'pharmacy' }),
    nearbyPlaces({ location, type: 'transit_station' }),
    nearbyPlaces({ location, type: 'convenience_store' }),
    nearbyPlaces({ location, type: 'restaurant' }),
    nearbyPlaces({ location, type: 'restaurant', openNow: true })
  ]);

  const distanceKm = (route.legs?.[0]?.distance?.value || 1000) / 1000;
  const poiCount = police.length + hospitals.length + pharmacies.length + transit.length + stores.length + restaurants.length;
  const normalizedPoiDensity = Math.min(1, poiCount / (distanceKm * 35));
  const openBusinessDensity = Math.min(1, openNowBusinesses.length / (distanceKm * 15));
  const urbanDensityScore = Math.min(1, (restaurants.length + stores.length + transit.length) / (distanceKm * 20));
  const isolationPenalty = Math.max(0, 1 - normalizedPoiDensity);

  const hour = when.getHours();
  const nightBand = hour >= 21 || hour <= 5;
  const nightPenalty = nightBand ? Math.min(1, isolationPenalty + 0.25) : 0;

  const score = 100 * ((weights.poiDensity * normalizedPoiDensity) + (weights.openBusinessDensity * openBusinessDensity) + (weights.urbanDensity * urbanDensityScore) - (weights.isolationPenalty * isolationPenalty) - (weights.nightPenalty * nightPenalty));

  const risks = [];
  if (isolationPenalty > 0.6) risks.push('Long isolated stretch with limited services');
  if (nightPenalty > 0.3) risks.push('Night-time travel across low-density zones');
  if (police.length < 1) risks.push('No nearby police station on sampled segment');

  return {
    score: clamp100(score),
    factors: {
      normalizedPoiDensity,
      openBusinessDensity,
      urbanDensityScore,
      isolationPenalty,
      nightPenalty,
      counts: {
        police: police.length,
        hospitals: hospitals.length,
        pharmacies: pharmacies.length,
        transit: transit.length,
        stores: stores.length,
        restaurants: restaurants.length,
        openNowBusinesses: openNowBusinesses.length
      }
    },
    risks
  };
};
