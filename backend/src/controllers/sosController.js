import UAParser from 'ua-parser-js';
import { SosEvent } from '../models/SosEvent.js';
import { TrustedContact } from '../models/TrustedContact.js';
import { sendEmail, sendSms } from '../services/notificationService.js';

export const triggerSos = (io) => async (req, res) => {
  const parser = new UAParser(req.headers['user-agent']);
  const event = await SosEvent.create({
    userId: req.user.userId,
    tripId: req.body.tripId,
    location: req.body.location,
    routeSnapshot: req.body.routeSnapshot,
    deviceInfo: parser.getResult()
  });

  const contacts = await TrustedContact.find({ userId: req.user.userId });
  const msg = `SOS ALERT: Live location ${req.body.location?.lat}, ${req.body.location?.lng} at ${new Date().toISOString()}`;
  await Promise.all(contacts.map(async (c) => {
    io.to(`contact:${c.socketUserId || c._id}`).emit('sos:alert', { eventId: event.id, location: event.location, msg });
    await Promise.all([sendSms(c.phone, msg), sendEmail(c.email, 'Emergency SOS Alert', msg)]);
  }));

  io.to(`trip:${req.body.tripId}`).emit('sos:started', event);
  res.status(201).json(event);
};

export const updateSosLocation = (io) => async (req, res) => {
  const event = await SosEvent.findByIdAndUpdate(req.params.sosId, { location: req.body.location }, { new: true });
  io.to(`sos:${event.id}`).emit('sos:location', { sosId: event.id, location: event.location, ts: Date.now() });
  res.json(event);
};

export const stopSos = (io) => async (req, res) => {
  const event = await SosEvent.findByIdAndUpdate(req.params.sosId, { active: false }, { new: true });
  io.to(`sos:${event.id}`).emit('sos:stopped', event);
  res.json(event);
};
