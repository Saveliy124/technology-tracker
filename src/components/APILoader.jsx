import { useState } from 'react';
import { loadTechnologiesFromAPI } from '../services/api';
import './APILoader.css';

function APILoader({ onTechnologiesLoaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadedCount, setLoadedCount] = useState(0);

  const handleLoadFromGitHub = async () => {
    setLoading(true);
    setError('');
    
    try {
      const technologies = await loadTechnologiesFromAPI();
      
      if (technologies) {
        onTechnologiesLoaded(technologies);
        setLoadedCount(technologies.length);
      } else {
        setError('❌ Не удалось загрузить технологии');
      }
    } catch (err) {
      setError(`❌ Ошибка: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-loader">
      <div className="loader-card">
        <h3>🌐 Загрузить технологии с GitHub</h3>
        
        {error && <div className="loader-error">{error}</div>}
        
        {loadedCount > 0 && (
          <div className="loader-success">
            ✅ Успешно загружено {loadedCount} технологий
          </div>
        )}

        <button 
          onClick={handleLoadFromGitHub}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? '⏳ Загрузка...' : '📥 Загрузить популярные репозитории'}
        </button>

        <p className="loader-info">
          💡 Загружаются топ 10 JavaScript репозиториев с GitHub<br/>
          🔓 Используется публичный API (без ключа)<br/>
          ⚠️ Может быть rate limit (60 запросов в час)
        </p>
      </div>
    </div>
  );
}

export default APILoader;
