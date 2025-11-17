import { useState, useEffect } from 'react';
import './App.css';
import useTechnologiesApi from './hooks/useTechnologiesApi'; // ✅ ИСПОЛЬЗУЕМ API ХУК
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import FilterTabs from './components/FilterTabs';
import SearchBar from './components/SearchBar';
import TechnologyCard from './components/TechnologyCard';
import APILoader from './components/APILoader';
import RoadmapImporter from './components/RoadmapImporter';
import AdvancedSearch from './components/AdvancedSearch';

function App() {
  // ========== ИСПОЛЬЗУЕМ API ХУК ВМЕСТО ЛОКАЛЬНОГО ==========
  const {
    technologies,
    loading,
    error,
    fetchTechnologies
  } = useTechnologiesApi();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dataSource, setDataSource] = useState('api'); // Начинаем с API
  const [searchResults, setSearchResults] = useState([]);

  console.log('📊 App загружен. Технологии:', technologies.length);

  // ========== ФИЛЬТРАЦИЯ ==========
  const getTechnologiesByStatus = (filter) => {
    if (filter === 'all') return technologies;
    return technologies.filter(tech => tech.status === filter);
  };

  const updateStatus = (id, newStatus) => {
    console.log(`📝 Обновление статуса: ${id} -> ${newStatus}`);
    const updated = technologies.map(tech =>
      tech.id === id ? { ...tech, status: newStatus } : tech
    );
    localStorage.setItem('apiTechnologies', JSON.stringify(updated));
    window.location.reload(); // Перезагружаем для обновления
  };

  const updateNotes = (id, newNotes) => {
    console.log(`📝 Обновление заметок: ${id}`);
    const updated = technologies.map(tech =>
      tech.id === id ? { ...tech, notes: newNotes } : tech
    );
    localStorage.setItem('apiTechnologies', JSON.stringify(updated));
  };

  // ========== СТАТИСТИКА ==========
  const getStatistics = () => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const stats = getStatistics();
  const filteredByStatus = getTechnologiesByStatus(activeFilter);
  const filteredTechnologies = filteredByStatus.filter(tech =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentCompleted = technologies
    .filter(tech => tech.status === 'completed')
    .slice(0, 5);

  const handleLoadFromAPI = (newTechnologies) => {
    console.log(`✅ Загружено ${newTechnologies.length} технологий`);
    localStorage.setItem('apiTechnologies', JSON.stringify(newTechnologies));
    window.location.reload();
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  // ========== СОСТОЯНИЕ ЗАГРУЗКИ ==========
  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>⏳ Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>📚 Персональный трекер освоения технологий</h1>
          <p>Отслеживайте свой прогресс в изучении новых технологий и направлений</p>
          <p className="interaction-hint">💡 Нажимайте на карточки для изменения статуса</p>
        </div>

        <div className="data-source-toggle">
          <div className="toggle-buttons">
            <button
              className="toggle-btn active"
              title="API данные"
            >
              🌐 API данные
            </button>
          </div>
          <p className="source-info">
            Источник: <strong>🌐 GitHub API</strong>
          </p>
        </div>
      </header>

      <main className="app-main">
        <section className="technologies-section">
          <ProgressHeader 
            totalTechnologies={stats.total}
            completedTechnologies={stats.completed}
          />

          {/* ========== ПОИСК С DEBOUNCE ========== */}
          <AdvancedSearch
            technologies={technologies}
            onSearch={handleSearch}
          />

          <div className="api-section">
            <div className="section-divider">
              <h3>🔧 Управление источниками данных</h3>
            </div>

            {error && (
              <div className="alert alert-error">
                ❌ {error}
              </div>
            )}

            <RoadmapImporter onSuccess={handleLoadFromAPI} />
            <APILoader onTechnologiesLoaded={handleLoadFromAPI} />
          </div>

          {/* ========== НЕДАВНО ВЫПОЛНЕННЫЕ ========== */}
          {recentCompleted.length > 0 && (
            <div className="recent-section">
              <div className="section-header">
                <h3>⭐ Недавно выполненные</h3>
                <span className="badge">{recentCompleted.length}</span>
              </div>
              <div className="recent-list">
                {recentCompleted.map(tech => (
                  <div key={tech.id} className="recent-item">
                    <span className="recent-icon">✅</span>
                    <div className="recent-content">
                      <p className="recent-title">{tech.title}</p>
                      <p className="recent-desc">{tech.description}</p>
                    </div>
                    <button 
                      className="recent-undo"
                      onClick={() => updateStatus(tech.id, 'in-progress')}
                      title="Вернуть в процесс"
                    >
                      ↩️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <QuickActions 
            onMarkAllComplete={() => {
              const updated = technologies.map(t => ({ ...t, status: 'completed' }));
              localStorage.setItem('apiTechnologies', JSON.stringify(updated));
              window.location.reload();
            }}
            onResetAll={() => {
              const updated = technologies.map(t => ({ ...t, status: 'not-started' }));
              localStorage.setItem('apiTechnologies', JSON.stringify(updated));
              window.location.reload();
            }}
            onRandomSelect={() => {
              if (technologies.length > 0) {
                const random = technologies[Math.floor(Math.random() * technologies.length)];
                updateStatus(random.id, 'in-progress');
              }
            }}
            technologies={technologies}
            totalTechnologies={stats.total}
            completedTechnologies={stats.completed}
          />

          <FilterTabs 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            stats={stats}
          />

          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultsCount={filteredTechnologies.length}
            totalCount={filteredByStatus.length}
          />

          <div className="section-header">
            <h2>🌐 Популярные репозитории</h2>
            <span className="badge">{filteredTechnologies.length} тем</span>
          </div>

          {filteredTechnologies.length > 0 ? (
            <div className="technologies-list">
              {filteredTechnologies.map(tech => (
                <TechnologyCard
                  key={tech.id}
                  id={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                  notes={tech.notes}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <p className="empty-text">
                {technologies.length === 0
                  ? '📥 Нажмите кнопку выше для загрузки репозиториев'
                  : searchQuery
                  ? `По запросу "${searchQuery}" ничего не найдено`
                  : 'Все технологии начаты или завершены!'}
              </p>
            </div>
          )}
        </section>

        {/* ========== БОКОВАЯ ПАНЕЛЬ СТАТИСТИКИ ========== */}
        <aside className="progress-summary">
          <div className="summary-card">
            <h3>📊 Статистика в реальном времени</h3>
            
            <div className="stats">
              <div className="stat-item completed">
                <span className="stat-icon">✅</span>
                <div className="stat-content">
                  <span className="stat-label">Пройдено</span>
                  <span className="stat-value">{stats.completed}</span>
                </div>
              </div>
              
              <div className="stat-item in-progress">
                <span className="stat-icon">📚</span>
                <div className="stat-content">
                  <span className="stat-label">В процессе</span>
                  <span className="stat-value">{stats.inProgress}</span>
                </div>
              </div>
              
              <div className="stat-item not-started">
                <span className="stat-icon">⏳</span>
                <div className="stat-content">
                  <span className="stat-label">Не начато</span>
                  <span className="stat-value">{stats.notStarted}</span>
                </div>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
              <p className="progress-text">
                Прогресс: <strong>{stats.progress}%</strong>
              </p>
            </div>

            <div className="recommendation">
              {stats.completed === stats.total && stats.total > 0 ? (
                <p>🎉 Поздравляем! Вы завершили всю дорожную карту!</p>
              ) : stats.inProgress > 0 ? (
                <p>
                  💪 Продолжайте! У вас {stats.inProgress}{' '}
                  {stats.inProgress === 1 ? 'тема' : 'темы'} в процессе.
                </p>
              ) : stats.completed > 0 ? (
                <p>🚀 Отличный старт! Продолжайте обучение.</p>
              ) : (
                <p>🎯 Загрузите репозитории для начала работы!</p>
              )}
            </div>

            <div className="additional-stats">
              <div className="stat-row">
                <span className="stat-row-label">Осталось:</span>
                <span className="stat-row-value">
                  {stats.notStarted + stats.inProgress}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-row-label">Завершение:</span>
                <span className="stat-row-value">{stats.progress}%</span>
              </div>
            </div>

            <div className="source-info-card">
              <h4>📍 Источник данных</h4>
              <p className="source-info-text">
                🌐 GitHub API - популярные репозитории по языкам
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
