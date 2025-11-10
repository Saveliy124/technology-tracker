import { useState } from 'react';
import './App.css';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import FilterTabs from './components/FilterTabs';
import TechnologyCard from './components/TechnologyCard';

function App() {
  // Состояние для массива технологий
  const [technologies, setTechnologies] = useState([
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение базовых компонентов, функциональные и классовые компоненты', 
      status: 'not-started' 
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX, встраивание JavaScript выражений', 
      status: 'not-started' 
    },
    { 
      id: 3, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов, useState хук', 
      status: 'not-started' 
    },
    { 
      id: 4, 
      title: 'Props и PropTypes', 
      description: 'Передача данных между компонентами через props', 
      status: 'not-started' 
    },
    { 
      id: 5, 
      title: 'Lifecycle Methods', 
      description: 'Жизненный цикл компонентов, useEffect хук', 
      status: 'not-started' 
    },
    { 
      id: 6, 
      title: 'React Router', 
      description: 'Маршрутизация в приложении, навигация между страницами', 
      status: 'not-started' 
    },
    { 
      id: 7, 
      title: 'Context API', 
      description: 'Глобальное управление состоянием с помощью Context API', 
      status: 'not-started' 
    },
    { 
      id: 8, 
      title: 'Custom Hooks', 
      description: 'Создание собственных хуков для переиспользования логики', 
      status: 'not-started' 
    }
  ]);

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');

  // Функция для изменения статуса технологии
  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech =>
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Функция для отметки всех как выполненных
  const handleMarkAllComplete = () => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech => ({
        ...tech,
        status: 'completed'
      }))
    );
  };

  // Функция для сброса всех статусов
  const handleResetAll = () => {
    setTechnologies(prevTechnologies =>
      prevTechnologies.map(tech => ({
        ...tech,
        status: 'not-started'
      }))
    );
  };

  // Функция для случайного выбора следующей технологии
  const handleRandomSelect = () => {
    const notStartedTechs = technologies.filter(t => t.status === 'not-started');
    
    if (notStartedTechs.length > 0) {
      const randomTech = notStartedTechs[
        Math.floor(Math.random() * notStartedTechs.length)
      ];
      
      handleStatusChange(randomTech.id, 'in-progress');
    } else {
      // Если все начаты, выбираем случайную из не завершённых
      const notCompletedTechs = technologies.filter(t => t.status !== 'completed');
      if (notCompletedTechs.length > 0) {
        const randomTech = notCompletedTechs[
          Math.floor(Math.random() * notCompletedTechs.length)
        ];
        handleStatusChange(randomTech.id, 'in-progress');
      }
    }
  };

  // Расчёты статистики
  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const inProgressCount = technologies.filter(t => t.status === 'in-progress').length;
  const notStartedCount = technologies.filter(t => t.status === 'not-started').length;

  // Фильтрация технологий на основе активного фильтра
  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  // Объект со статистикой для FilterTabs
  const stats = {
    total: technologies.length,
    completed: completedCount,
    inProgress: inProgressCount,
    notStarted: notStartedCount
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>📚 Персональный трекер освоения технологий</h1>
          <p>Отслеживайте свой прогресс в изучении новых технологий и направлений</p>
          <p className="interaction-hint">💡 Нажимайте на карточки для изменения статуса</p>
        </div>
      </header>

      <main className="app-main">
        <section className="technologies-section">
          {/* Компонент ProgressHeader */}
          <ProgressHeader 
            totalTechnologies={technologies.length}
            completedTechnologies={completedCount}
          />

          {/* Компонент QuickActions */}
          <QuickActions 
            onMarkAllComplete={handleMarkAllComplete}
            onResetAll={handleResetAll}
            onRandomSelect={handleRandomSelect}
            totalTechnologies={technologies.length}
            completedTechnologies={completedCount}
          />

          {/* Фильтры */}
          <FilterTabs 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            stats={stats}
          />

          <div className="section-header">
            <h2>Дорожная карта: React</h2>
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
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📭</p>
              <p className="empty-text">
                {activeFilter === 'completed' 
                  ? 'Пока ничего не завершено. Начните обучение!' 
                  : activeFilter === 'in-progress'
                  ? 'Нет технологий в процессе. Начните со случайного выбора!'
                  : 'Все технологии начаты или завершены!'}
              </p>
            </div>
          )}
        </section>

        {/* Сайдбар со статистикой */}
        <aside className="progress-summary">
          <div className="summary-card">
            <h3>📊 Статистика в реальном времени</h3>
            
            <div className="stats">
              <div className="stat-item completed">
                <span className="stat-icon">✅</span>
                <div className="stat-content">
                  <span className="stat-label">Пройдено</span>
                  <span className="stat-value">{completedCount}</span>
                </div>
              </div>
              
              <div className="stat-item in-progress">
                <span className="stat-icon">📚</span>
                <div className="stat-content">
                  <span className="stat-label">В процессе</span>
                  <span className="stat-value">{inProgressCount}</span>
                </div>
              </div>
              
              <div className="stat-item not-started">
                <span className="stat-icon">⏳</span>
                <div className="stat-content">
                  <span className="stat-label">Не начато</span>
                  <span className="stat-value">{notStartedCount}</span>
                </div>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${Math.round((completedCount / technologies.length) * 100)}%` 
                  }}
                ></div>
              </div>
              <p className="progress-text">
                Прогресс: <strong>{Math.round((completedCount / technologies.length) * 100)}%</strong>
              </p>
            </div>

            <div className="recommendation">
              {completedCount === technologies.length ? (
                <p>🎉 Поздравляем! Вы завершили всю дорожную карту!</p>
              ) : inProgressCount > 0 ? (
                <p>💪 Продолжайте! У вас {inProgressCount} {inProgressCount === 1 ? 'тема' : 'темы'} в процессе.</p>
              ) : completedCount > 0 ? (
                <p>🚀 Отличный старт! Продолжайте обучение.</p>
              ) : (
                <p>🎯 Начните с любой темы!</p>
              )}
            </div>

            <div className="additional-stats">
              <div className="stat-row">
                <span className="stat-row-label">Осталось:</span>
                <span className="stat-row-value">{notStartedCount + inProgressCount}</span>
              </div>
              <div className="stat-row">
                <span className="stat-row-label">Завершение:</span>
                <span className="stat-row-value">
                  {Math.round((completedCount / technologies.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
