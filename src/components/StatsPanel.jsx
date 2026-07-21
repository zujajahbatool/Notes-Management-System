import './StatsPanel.css';
import StatsCard from './StatsCard';

export default function StatsPanel({ total, completed }) {
  return (
    <section className="stats-panel" aria-label="Notes summary">
      <StatsCard label="Total notes" value={total} id="total-items" />
      <StatsCard label="Completed" value={completed} id="completed-items" variant="complete" />
    </section>
  );
}
