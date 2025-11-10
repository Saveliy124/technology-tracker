import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange, resultsCount, totalCount }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по названию или описанию технологии..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Поиск технологий"
        />
        {searchQuery && (
          <button
            className="clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="search-results-info">
        {searchQuery ? (
          <span className="results-text">
            Найдено: <strong>{resultsCount}</strong> из <strong>{totalCount}</strong>
          </span>
        ) : (
          <span className="results-text total">
            Всего технологий: <strong>{totalCount}</strong>
          </span>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
