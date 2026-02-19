import mongoose from 'mongoose';

const sosEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    active: { type: Boolean, default: true },
    location: { lat: Number, lng: Number },
    routeSnapshot: mongoose.Schema.Types.Mixed,
    deviceInfo: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const SosEvent = mongoose.model('SOS_Event', sosEventSchema);
