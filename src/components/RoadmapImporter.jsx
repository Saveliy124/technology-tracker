import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';
import './RoadmapImporter.css';

function RoadmapImporter({ onSuccess }) {
  const { fetchTechnologies } = useTechnologiesApi();
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [loadedCount, setLoadedCount] = useState(0);

  // ========== ЗАГРУЗКА ПО ЯЗЫКУ ==========
  const handleLoadByLanguage = async (language) => {
    try {
      setImporting(true);
      setError('');
      setSuccess('');
      setSelectedLanguage(language);

      console.log(`📥 Загрузка по языку: ${language}`);

      const result = await fetchTechnologies(language);

      if (result && result.length > 0) {
        setLoadedCount(result.length);
        setSuccess(`✅ Успешно загружено ${result.length} репозиториев`);
        console.log(`✅ Загружено ${result.length} репозиториев`);
        
        // Сохраняем в localStorage
        localStorage.setItem('apiTechnologies', JSON.stringify(result));
        
        // Вызываем callback успеха
        if (onSuccess) {
          setTimeout(() => {
            onSuccess(result);
          }, 1500);
        }
      } else {
        setError('❌ Не удалось загрузить репозитории');
        console.error('Ошибка: результат пуст');
      }
    } catch (err) {
      const errorMsg = `❌ Ошибка: ${err.message}`;
      setError(errorMsg);
      console.error('Ошибка загрузки:', err);
    } finally {
      setImporting(false);
    }
  };

  // ========== ПОПУЛЯРНЫЕ ЯЗЫКИ ==========
  const languages = [
    { code: 'javascript', label: '📜 JavaScript', emoji: '🚀' },
    { code: 'python', label: '🐍 Python', emoji: '🤖' },
    { code: 'typescript', label: '📘 TypeScript', emoji: '✨' },
    { code: 'go', label: '🐹 Go', emoji: '⚡' },
    { code: 'rust', label: '🦀 Rust', emoji: '🔐' },
    { code: 'java', label: '☕ Java', emoji: '⚙️' },
    { code: 'cpp', label: '➕ C++', emoji: '🚀' },
    { code: 'csharp', label: '#️⃣ C#', emoji: '💎' },
  ];

  return (
    <div className="roadmap-importer">
      <div className="importer-card">
        <div className="importer-header">
          <h3>🌐 Загрузить популярные репозитории</h3>
          <p className="importer-subtitle">Выберите язык программирования</p>
        </div>

        {/* ========== СООБЩЕНИЯ ========== */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* ========== КНОПКИ ЯЗЫКОВ ========== */}
        <div className="language-grid">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLoadByLanguage(lang.code)}
              disabled={importing}
              className={`language-btn ${selectedLanguage === lang.code ? 'active' : ''}`}
              title={`Загрузить ${lang.label}`}
            >
              <span className="language-emoji">{lang.emoji}</span>
              <span className="language-label">{lang.label}</span>
              {importing && selectedLanguage === lang.code && (
                <span className="loading-spinner">⏳</span>
              )}
            </button>
          ))}
        </div>

        {/* ========== ИНФОРМАЦИЯ ========== */}
        <div className="importer-info">
          <div className="info-item">
            <span className="info-icon">📊</span>
            <div className="info-content">
              <p className="info-title">Загруженные репозитории</p>
              <p className="info-value">{loadedCount} из 10</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">🔗</span>
            <div className="info-content">
              <p className="info-title">Источник</p>
              <p className="info-value">GitHub API</p>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">💾</span>
            <div className="info-content">
              <p className="info-title">Хранение</p>
              <p className="info-value">localStorage</p>
            </div>
          </div>
        </div>

        {/* ========== ПРИМЕЧАНИЯ ========== */}
        <div className="importer-notes">
          <h4>📌 Важная информация:</h4>
          <ul>
            <li>✓ Загружаются топ 10 репозиториев по выбранному языку</li>
            <li>✓ Данные сортируются по количеству звёзд</li>
            <li>⚠️ GitHub API имеет лимит: 60 запросов/час без ключа</li>
            <li>💡 Данные автоматически сохраняются в localStorage</li>
            <li>🔄 Загрузка новых данных заменит текущие</li>
          </ul>
        </div>

        {/* ========== ОПИСАНИЕ ИСТОЧНИКОВ ========== */}
        <div className="importer-sources">
          <h4>📚 Доступные источники:</h4>
          <div className="sources-list">
            <div className="source-item">
              <span className="source-icon">🌟</span>
              <div className="source-info">
                <p className="source-name">GitHub API</p>
                <p className="source-desc">Популярные репозитории по языку программирования</p>
              </div>
            </div>

            <div className="source-item">
              <span className="source-icon">📤</span>
              <div className="source-info">
                <p className="source-name">JSON импорт</p>
                <p className="source-desc">Загрузка собственного JSON файла с технологиями</p>
              </div>
            </div>

            <div className="source-item">
              <span className="source-icon">📥</span>
              <div className="source-info">
                <p className="source-name">JSON экспорт</p>
                <p className="source-desc">Сохранение текущих данных в JSON файл</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapImporter;
