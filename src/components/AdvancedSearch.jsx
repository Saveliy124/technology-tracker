import { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';
import './AdvancedSearch.css';

function AdvancedSearch({ technologies, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Получаем уникальные языки программирования
  const languages = [
    'all',
    ...new Set(
      technologies
        .filter(tech => tech.language)
        .map(tech => tech.language)
    )
  ];

  // ========== ПОИСК С DEBOUNCE ==========
  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Имитируем API запрос
    const timer = setTimeout(() => {
      const query = debouncedSearchQuery.toLowerCase();
      
      const results = technologies.filter(tech => {
        const matchesQuery =
          tech.title.toLowerCase().includes(query) ||
          tech.description.toLowerCase().includes(query) ||
          (tech.language && tech.language.toLowerCase().includes(query));

        const matchesLanguage =
          filterLanguage === 'all' || tech.language === filterLanguage;

        return matchesQuery && matchesLanguage;
      });

      setSearchResults(results);
      setIsSearching(false);
      onSearch(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchQuery, filterLanguage, technologies, onSearch]);

  // ========== ОЧИСТКА ПОИСКА ==========
  const handleClearSearch = () => {
    setSearchQuery('');
    setFilterLanguage('all');
    setSearchResults([]);
  };

  return (
    <div className="advanced-search">
      <div className="search-container">
        {/* ========== ПОЛЕ ВВОДА ========== */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Поиск технологий, языков, репозиториев..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-btn"
              onClick={handleClearSearch}
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>

        {/* ========== ФИЛЬТР ПО ЯЗЫКУ ========== */}
        <div className="language-filter">
          <label htmlFor="language-select">Язык:</label>
          <select
            id="language-select"
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="language-select"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang === 'all' ? '📋 Все' : `${lang}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========== СОСТОЯНИЕ ПОИСКА ========== */}
      {isSearching && (
        <div className="search-status">
          <span className="spinner-small"></span>
          Поиск... {debouncedSearchQuery}
        </div>
      )}

      {/* ========== РЕЗУЛЬТАТЫ ПОИСКА ========== */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h3>🔎 Результаты поиска</h3>
            <span className="results-count">{searchResults.length}</span>
          </div>

          <div className="results-list">
            {searchResults.map((tech) => (
              <div key={tech.id} className="result-item">
                <div className="result-main">
                  <h4 className="result-title">{tech.title}</h4>
                  <p className="result-desc">{tech.description}</p>
                  
                  <div className="result-meta">
                    {tech.language && (
                      <span className="meta-badge language-badge">
                        💻 {tech.language}
                      </span>
                    )}
                    {tech.stars && (
                      <span className="meta-badge stars-badge">
                        ⭐ {tech.stars.toLocaleString()}
                      </span>
                    )}
                    {tech.url && (
                      <a
                        href={tech.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="meta-badge url-badge"
                      >
                        🔗 Открыть
                      </a>
                    )}
                  </div>
                </div>
                <span className={`result-status status-${tech.status}`}>
                  {tech.status === 'completed'
                    ? '✅'
                    : tech.status === 'in-progress'
                    ? '📚'
                    : '⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== ПУСТОЙ РЕЗУЛЬТАТ ========== */}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="no-results">
          <p className="no-results-icon">🚫</p>
          <p className="no-results-text">
            По запросу "{searchQuery}" ничего не найдено
          </p>
        </div>
      )}

      {/* ========== ПОДСКАЗКА ========== */}
      {!searchQuery && (
        <div className="search-hint">
          <p>💡 Введите запрос для поиска или выберите язык для фильтрации</p>
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;
