import { getDirections, geocodeAddress } from '../services/googleMapsService.js';
import { computeRouteSafety, getRouteHash } from '../services/safetyScoringService.js';
import { RouteAnalysisCache } from '../models/RouteAnalysisCache.js';
import { Trip } from '../models/Trip.js';

export const analyzeRoutes = async (req, res) => {
  const { source, destination } = req.body;
  const hash = getRouteHash({ source, destination });
  const cached = await RouteAnalysisCache.findOne({ hash });
  if (cached) return res.json({ source, destination, routes: cached.routes, cached: true });

  const [sourceGeo, destinationGeo, routes] = await Promise.all([
    geocodeAddress(source),
    geocodeAddress(destination),
    getDirections(source, destination)
  ]);

  const enriched = await Promise.all(routes.map(async (route, idx) => ({
    index: idx,
    summary: route.summary,
    distanceMeters: route.legs?.[0]?.distance?.value,
    durationSeconds: route.legs?.[0]?.duration?.value,
    polyline: route.overview_polyline?.points,
    safety: await computeRouteSafety(route)
  })));

  const safest = enriched.sort((a, b) => b.safety.score - a.safety.score)[0];

  await RouteAnalysisCache.create({
    sourcePlaceId: sourceGeo?.place_id,
    destinationPlaceId: destinationGeo?.place_id,
    hash,
    routes: enriched,
    expiresAt: new Date(Date.now() + 1000 * 60 * 15)
  });

  const trip = await Trip.create({
    userId: req.user.userId,
    source: { address: source, location: sourceGeo?.geometry?.location },
    destination: { address: destination, location: destinationGeo?.geometry?.location },
    selectedRouteIndex: safest.index,
    routes: enriched,
    status: 'planned'
  });

  res.json({ tripId: trip.id, source, destination, routes: enriched, safestRouteIndex: safest.index });
};

export const getTrips = async (req, res) => {
  const trips = await Trip.find({ userId: req.user.userId }).sort({ createdAt: -1 }).limit(20);
  res.json(trips);
};
