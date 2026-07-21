import './StatsCard.css';

export default function StatsCard({ label, value, id, variant = 'default' }) {
  const cardClassName = variant === 'complete' ? 'stat-card stat-card-complete' : 'stat-card';

  return (
    <div className={cardClassName}>
      <span className="stat-label">{label}</span>
      <strong id={id} className="stat-value">
        {value}
      </strong>
    </div>
  );
}
