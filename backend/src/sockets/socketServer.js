import { computeRouteSafety } from '../services/safetyScoringService.js';

export const bindSockets = (io) => {
  io.on('connection', (socket) => {
    socket.on('trip:join', ({ tripId }) => socket.join(`trip:${tripId}`));
    socket.on('contact:register', ({ contactKey }) => socket.join(`contact:${contactKey}`));
    socket.on('sos:watch', ({ sosId }) => socket.join(`sos:${sosId}`));

    socket.on('trip:location:update', async (payload) => {
      socket.to(`trip:${payload.tripId}`).emit('trip:location:broadcast', payload);
      const fakeRoute = {
        legs: [{
          start_location: payload.location,
          end_location: payload.destination || payload.location,
          distance: { value: payload.remainingDistance || 1000 }
        }]
      };
      const safety = await computeRouteSafety(fakeRoute, new Date(payload.timestamp || Date.now()));
      io.to(`trip:${payload.tripId}`).emit('trip:safety:update', safety);
      if (safety.score < 45) io.to(`trip:${payload.tripId}`).emit('trip:safety:warning', { message: 'Entering low-safety zone', safety });
    });
  });
};
