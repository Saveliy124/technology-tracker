import useTechnologies from '../hooks/useTechnologies';
import './Statistics.css';

function Statistics() {
  const { technologies, getStatistics } = useTechnologies();
  const stats = getStatistics();

  // Подсчёт технологий по категориям
  const categoriesData = technologies.reduce((acc, tech) => {
    const category = tech.category || 'frontend';
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: category, count: 1 });
    }
    return acc;
  }, []);

  // Подсчёт технологий по статусам
  const statusData = [
    { name: 'Завершено', count: stats.completed, color: '#4CAF50' },
    { name: 'В процессе', count: stats.inProgress, color: '#2196F3' },
    { name: 'Не начато', count: stats.notStarted, color: '#FF9800' }
  ];

  // Генерируем данные прогресса за месяцы (симуляция)
  const progressData = [
    { month: 'Январь', progress: 10 },
    { month: 'Февраль', progress: 15 },
    { month: 'Март', progress: 20 },
    { month: 'Апрель', progress: 25 },
    { month: 'Май', progress: 30 },
    { month: 'Июнь', progress: stats.progress }
  ];

  const maxProgress = Math.max(...progressData.map(d => d.progress));

  return (
    <div className="statistics-page">
      <div className="statistics-container">
        <div className="page-header">
          <h1>📊 Статистика вашего прогресса</h1>
          <p>Подробный анализ вашего обучения</p>
        </div>

        {/* ========== ОСНОВНЫЕ МЕТРИКИ ========== */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#4CAF50' }}>✅</div>
            <div className="metric-content">
              <p className="metric-label">Завершено</p>
              <p className="metric-value">{stats.completed}</p>
              <p className="metric-desc">из {stats.total} технологий</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#2196F3' }}>📚</div>
            <div className="metric-content">
              <p className="metric-label">В процессе</p>
              <p className="metric-value">{stats.inProgress}</p>
              <p className="metric-desc">активных тем</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#FF9800' }}>⏳</div>
            <div className="metric-content">
              <p className="metric-label">Не начато</p>
              <p className="metric-value">{stats.notStarted}</p>
              <p className="metric-desc">ожидающих тем</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#667eea' }}>🎯</div>
            <div className="metric-content">
              <p className="metric-label">Прогресс</p>
              <p className="metric-value">{stats.progress}%</p>
              <p className="metric-desc">завершения</p>
            </div>
          </div>
        </div>

        {/* ========== ГРАФИКИ ========== */}
        <div className="charts-grid">
          {/* График прогресса по времени */}
          <div className="chart-card">
            <h3>📈 Прогресс по месяцам</h3>
            <div className="line-chart">
              {progressData.map((data, index) => (
                <div key={index} className="chart-item">
                  <div className="chart-column-container">
                    <div 
                      className="chart-column"
                      style={{ height: `${(data.progress / maxProgress) * 200}px` }}
                    >
                      <span className="column-value">{data.progress}%</span>
                    </div>
                  </div>
                  <p className="chart-label">{data.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* График по статусам */}
          <div className="chart-card">
            <h3>🎯 Распределение по статусам</h3>
            <div className="pie-chart">
              {statusData.map((data, index) => (
                <div key={index} className="pie-item">
                  <div className="pie-bar">
                    <div 
                      className="pie-fill"
                      style={{ 
                        width: `${(data.count / stats.total) * 100}%`,
                        backgroundColor: data.color
                      }}
                    ></div>
                  </div>
                  <div className="pie-label">
                    <span className="label-text">{data.name}</span>
                    <span className="label-count">{data.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========== КАТЕГОРИИ ========== */}
        <div className="categories-card">
          <h3>🏷️ Технологии по категориям</h3>
          <div className="categories-grid">
            {categoriesData.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-header">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ width: `${(category.count / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========== РЕКОМЕНДАЦИИ ========== */}
        <div className="recommendations-card">
          <h3>💡 Рекомендации</h3>
          <div className="recommendations-list">
            {stats.progress === 100 ? (
              <div className="recommendation-item success">
                <span className="rec-icon">🎉</span>
                <p>Поздравляем! Вы завершили все технологии на дорожной карте!</p>
              </div>
            ) : stats.inProgress === 0 && stats.completed > 0 ? (
              <div className="recommendation-item">
                <span className="rec-icon">🚀</span>
                <p>Выберите одну из {stats.notStarted} оставшихся технологий для изучения</p>
              </div>
            ) : stats.inProgress > 0 ? (
              <div className="recommendation-item">
                <span className="rec-icon">💪</span>
                <p>Продолжайте работать над {stats.inProgress} {stats.inProgress === 1 ? 'темой' : 'темами'} в процессе</p>
              </div>
            ) : (
              <div className="recommendation-item">
                <span className="rec-icon">🎯</span>
                <p>Начните с любой интересующей вас технологии!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
