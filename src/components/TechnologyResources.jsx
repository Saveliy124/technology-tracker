import { useState, useEffect } from 'react';
import { loadResourcesForTechnology } from '../services/api';
import './TechnologyResources.css';

function TechnologyResources({ technologyName, technologyId }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  // ========== ЗАГРУЗКА РЕСУРСОВ ==========
  useEffect(() => {
    if (!expanded) return;

    const loadResources = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await loadResourcesForTechnology(technologyName);
        setResources(data);
      } catch (err) {
        setError(`Ошибка загрузки ресурсов: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [expanded, technologyName]);

  const getResourceIcon = (type) => {
    const icons = {
      documentation: '📖',
      course: '🎓',
      tutorial: '📚',
      book: '📕',
      practice: '💪',
      github: '🐙'
    };
    return icons[type] || '🔗';
  };

  return (
    <div className="technology-resources">
      <button
        className="resources-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="toggle-icon">{expanded ? '▼' : '▶'}</span>
        📚 Ресурсы и материалы
        {resources.length > 0 && <span className="resource-count">{resources.length}</span>}
      </button>

      {expanded && (
        <div className="resources-content">
          {loading && (
            <div className="resources-loading">
              <span className="spinner-small"></span>
              Загрузка ресурсов...
            </div>
          )}

          {error && (
            <div className="resources-error">
              ❌ {error}
            </div>
          )}

          {!loading && resources.length > 0 && (
            <div className="resources-list">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-item"
                >
                  <span className="resource-icon">
                    {getResourceIcon(resource.type)}
                  </span>
                  <div className="resource-info">
                    <h4 className="resource-title">{resource.title}</h4>
                    <p className="resource-desc">{resource.description}</p>
                  </div>
                  {resource.stars && (
                    <span className="resource-stars">⭐ {resource.stars.toLocaleString()}</span>
                  )}
                  <span className="resource-link">→</span>
                </a>
              ))}
            </div>
          )}

          {!loading && resources.length === 0 && !error && (
            <div className="no-resources">
              <p>Ресурсы загружены, но данные недоступны</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TechnologyResources;
