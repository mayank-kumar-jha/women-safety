import mongoose from 'mongoose';

const routeAnalysisCacheSchema = new mongoose.Schema(
  {
    sourcePlaceId: String,
    destinationPlaceId: String,
    hash: { type: String, index: true, unique: true },
    routes: [mongoose.Schema.Types.Mixed],
    expiresAt: { type: Date, index: { expires: 0 } }
  },
  { timestamps: true }
);

export const RouteAnalysisCache = mongoose.model('Route_Analysis_Cache', routeAnalysisCacheSchema);
