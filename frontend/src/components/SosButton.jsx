export default function SosButton({ active, onToggle }) {
  return <button className={`sos ${active ? 'active' : ''}`} onClick={onToggle}>{active ? 'Stop SOS' : 'Trigger SOS'}</button>;
}
