export default function RouteCard({ route, selected, onPick }) {
  const zone = route.safety.score >= 70 ? 'safe' : route.safety.score >= 45 ? 'moderate' : 'risk';
  return (
    <div className={`card ${selected ? 'selected' : ''}`} onClick={onPick}>
      <h4>{route.summary}</h4>
      <p>{(route.distanceMeters / 1000).toFixed(1)} km • {Math.round(route.durationSeconds / 60)} min</p>
      <p className={zone}>Safety Score: {route.safety.score}</p>
      <small>{route.safety.risks.join(' | ') || 'Low visible risk'}</small>
    </div>
  );
}
