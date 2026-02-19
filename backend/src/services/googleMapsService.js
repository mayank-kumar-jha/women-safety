import axios from 'axios';
import { env } from '../config/env.js';

const maps = axios.create({ baseURL: 'https://maps.googleapis.com/maps/api' });
const key = () => ({ key: env.googleMapsApiKey });

export const geocodeAddress = async (address) => {
  const { data } = await maps.get('/geocode/json', { params: { address, ...key() } });
  return data.results?.[0];
};

export const getDirections = async (origin, destination) => {
  const { data } = await maps.get('/directions/json', {
    params: {
      origin,
      destination,
      alternatives: true,
      departure_time: 'now',
      traffic_model: 'best_guess',
      ...key()
    }
  });
  return data.routes || [];
};

export const nearbyPlaces = async ({ location, radius = 800, type, openNow = false }) => {
  const { data } = await maps.get('/place/nearbysearch/json', {
    params: {
      location,
      radius,
      type,
      opennow: openNow || undefined,
      ...key()
    }
  });
  return data.results || [];
};
