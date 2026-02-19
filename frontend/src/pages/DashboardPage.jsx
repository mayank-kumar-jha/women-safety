import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import client from '../api/client';
import RouteCard from '../components/RouteCard';
import SosButton from '../components/SosButton';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export default function DashboardPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState([]);
  const [tripId, setTripId] = useState('');
  const [selected, setSelected] = useState(0);
  const [sos, setSos] = useState(null);
  const [liveSafety, setLiveSafety] = useState(null);

  useEffect(() => {
    socket.on('trip:safety:update', setLiveSafety);
    socket.on('trip:safety:warning', (w) => alert(w.message));
    return () => {
      socket.off('trip:safety:update');
      socket.off('trip:safety:warning');
    };
  }, []);

  const analyze = async () => {
    const { data } = await client.post('/routes/analyze', { source, destination });
    setRoutes(data.routes);
    setTripId(data.tripId);
    setSelected(data.safestRouteIndex);
    socket.emit('trip:join', { tripId: data.tripId });
  };

  const safest = useMemo(() => routes[selected], [routes, selected]);

  const toggleSos = async () => {
    if (!sos) {
      const { data } = await client.post('/sos', { tripId, location: { lat: 0, lng: 0 }, routeSnapshot: safest });
      setSos(data);
      socket.emit('sos:watch', { sosId: data._id });
      return;
    }
    await client.patch(`/sos/${sos._id}/stop`);
    setSos(null);
  };

  return (
    <div className="layout">
      <div className="card">
        <h2>Women Safety Route Analyzer</h2>
        <input placeholder="Source address" value={source} onChange={(e) => setSource(e.target.value)} />
        <input placeholder="Destination address" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <button onClick={analyze}>Analyze Route Safety</button>
        <SosButton active={Boolean(sos)} onToggle={toggleSos} />
      </div>

      <section>
        <h3>Route Options</h3>
        {routes.map((route, i) => <RouteCard key={i} route={route} selected={selected === i} onPick={() => setSelected(i)} />)}
      </section>

      <section className="card">
        <h3>Safety Breakdown</h3>
        {safest && <pre>{JSON.stringify(safest.safety.factors, null, 2)}</pre>}
        {liveSafety && <p>Live Micro-Safety: {liveSafety.score}</p>}
      </section>

      <section className="map-placeholder card">
        <h3>Map Overlay</h3>
        <p>Integrate Google Maps JS SDK with polyline color codes (green/yellow/red) using route safety scores.</p>
      </section>
    </div>
  );
}
