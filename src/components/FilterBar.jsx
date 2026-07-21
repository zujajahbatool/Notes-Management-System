import Button from './Button.jsx';
import './FilterBar.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'incomplete', label: 'Incomplete' },
  { key: 'completed', label: 'Completed' },
];

export default function FilterBar({ activeFilter, onFilterChange, visibleCount }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter notes by status">
      <div className="filter-pills">
        {FILTERS.map((filter) => (
          <Button
            key={filter.key}
            variant="pill"
            active={activeFilter === filter.key}
            onClick={() => onFilterChange(filter.key)}
            aria-pressed={activeFilter === filter.key}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <span className="filter-count">{visibleCount} shown</span>
    </div>
  );
}
