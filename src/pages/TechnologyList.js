import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import ProgressHeader from '../components/ProgressHeader';
import QuickActions from '../components/QuickActions';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';
import TechnologyCard from '../components/TechnologyCard';

function TechnologyList() {
  // ========== ИСПОЛЬЗУЕМ КАСТОМНЫЙ ХУК ==========
  const {
    technologies,
    updateStatus,
    updateNotes,
    markAllCompleted,
    resetAllStatuses,
    selectRandomTechnology,
    getStatistics,
    getTechnologiesByStatus,
    searchTechnologies
  } = useTechnologies();

  // ========== ЛОКАЛЬНЫЕ СОСТОЯНИЯ ДЛЯ UI ==========
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ========== ПОЛУЧАЕМ СТАТИСТИКУ ==========
  const stats = getStatistics();

  // ========== ФИЛЬТРАЦИЯ ==========
  // 1. Фильтруем по статусу
  const filteredByStatus = getTechnologiesByStatus(activeFilter);

  // 2. Фильтруем по поиску
  const filteredTechnologies = filteredByStatus.filter(tech =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('🔍 App информация:', {
    всего_технологий: technologies.length,
    завершено: stats.completed,
    в_процессе: stats.inProgress,
    не_начато: stats.notStarted,
    прогресс: `${stats.progress}%`,
    активный_фильтр: activeFilter,
    поисковый_запрос: searchQuery,
    найдено_результатов: filteredTechnologies.length
  });

  return (
    <div className="App">
      {/* ========== ЗАГОЛОВОК ПРИЛОЖЕНИЯ ========== */}
      <header className="app-header">
        <div className="header-content">
          <h1>📚 Персональный трекер освоения технологий</h1>
          <p>Отслеживайте свой прогресс в изучении новых технологий и направлений</p>
          <p className="interaction-hint">💡 Нажимайте на карточки для изменения статуса</p>
        </div>
      </header>

      {/* ========== ОСНОВНОЙ КОНТЕНТ ========== */}
      <main className="app-main">
        {/* ========== ЛЕВАЯ КОЛОНКА - ТЕХНОЛОГИИ ========== */}
        <section className="technologies-section">
          
          {/* Progress Header - общий прогресс */}
          <ProgressHeader 
            totalTechnologies={stats.total}
            completedTechnologies={stats.completed}
          />

          {/* Quick Actions - быстрые действия */}
          <QuickActions 
            onMarkAllComplete={markAllCompleted}
            onResetAll={resetAllStatuses}
            onRandomSelect={selectRandomTechnology}
            technologies={technologies}
            totalTechnologies={stats.total}
            completedTechnologies={stats.completed}
          />

          {/* Filter Tabs - фильтрация по статусу */}
          <FilterTabs 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            stats={stats}
          />

          {/* Search Bar - поиск по названию и описанию */}
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultsCount={filteredTechnologies.length}
            totalCount={filteredByStatus.length}
          />

          {/* Section Header */}
          <div className="section-header">
            <h2>Дорожная карта: React</h2>
            <span className="badge">{filteredTechnologies.length} тем</span>
          </div>
          
          {/* Technologies List или Empty State */}
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
                {searchQuery
                  ? `По запросу "${searchQuery}" ничего не найдено`
                  : activeFilter === 'completed' 
                  ? 'Пока ничего не завершено. Начните обучение!' 
                  : activeFilter === 'in-progress'
                  ? 'Нет технологий в процессе. Начните со случайного выбора!'
                  : 'Все технологии начаты или завершены!'}
              </p>
            </div>
          )}
        </section>

        {/* ========== ПРАВАЯ КОЛОНКА - СТАТИСТИКА ========== */}
        <aside className="progress-summary">
          <div className="summary-card">
            <h3>📊 Статистика в реальном времени</h3>
            
            {/* Статистика по статусам */}
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

            {/* Полоса прогресса */}
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

            {/* Динамическая рекомендация */}
            <div className="recommendation">
              {stats.completed === stats.total ? (
                <p>🎉 Поздравляем! Вы завершили всю дорожную карту!</p>
              ) : stats.inProgress > 0 ? (
                <p>
                  💪 Продолжайте! У вас {stats.inProgress}{' '}
                  {stats.inProgress === 1 ? 'тема' : 'темы'} в процессе.
                </p>
              ) : stats.completed > 0 ? (
                <p>🚀 Отличный старт! Продолжайте обучение.</p>
              ) : (
                <p>🎯 Начните с любой темы!</p>
              )}
            </div>

            {/* Дополнительная статистика */}
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
          </div>
        </aside>
      </main>
    </div>
  );
}

export default TechnologyList;
