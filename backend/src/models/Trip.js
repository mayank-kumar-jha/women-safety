import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    source: { address: String, location: { lat: Number, lng: Number } },
    destination: { address: String, location: { lat: Number, lng: Number } },
    selectedRouteIndex: Number,
    routes: [{
      summary: String,
      distanceMeters: Number,
      durationSeconds: Number,
      polyline: String,
      safety: {
        score: Number,
        factors: mongoose.Schema.Types.Mixed,
        risks: [String]
      }
    }],
    status: { type: String, enum: ['planned', 'active', 'completed'], default: 'planned' }
  },
  { timestamps: true }
);

export const Trip = mongoose.model('Trip', tripSchema);
