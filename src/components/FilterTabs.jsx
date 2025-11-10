import './FilterTabs.css';

function FilterTabs({ activeFilter, onFilterChange, stats }) {
  const filters = [
    { id: 'all', label: 'Все', icon: '📋', count: stats.total },
    { id: 'not-started', label: 'Не начато', icon: '⏳', count: stats.notStarted },
    { id: 'in-progress', label: 'В процессе', icon: '📚', count: stats.inProgress },
    { id: 'completed', label: 'Выполнено', icon: '✅', count: stats.completed }
  ];

  return (
    <div className="filter-tabs">
      <div className="filter-container">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.label}</span>
            <span className="filter-count">{filter.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterTabs;
