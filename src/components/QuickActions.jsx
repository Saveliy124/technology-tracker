import './QuickActions.css';

function QuickActions({ 
  onMarkAllComplete, 
  onResetAll, 
  onRandomSelect,
  totalTechnologies,
  completedTechnologies
}) {
  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      
      <div className="actions-grid">
        <button 
          className="action-btn mark-complete"
          onClick={onMarkAllComplete}
          disabled={completedTechnologies === totalTechnologies}
        >
          <span className="btn-icon">✅</span>
          <span className="btn-text">Все выполнены</span>
          <span className="btn-desc">Отметить все как выполненные</span>
        </button>

        <button 
          className="action-btn reset-all"
          onClick={onResetAll}
          disabled={completedTechnologies === 0}
        >
          <span className="btn-icon">🔄</span>
          <span className="btn-text">Сброс</span>
          <span className="btn-desc">Сбросить все статусы</span>
        </button>

        <button 
          className="action-btn random-select"
          onClick={onRandomSelect}
        >
          <span className="btn-icon">🎲</span>
          <span className="btn-text">Случайный выбор</span>
          <span className="btn-desc">Начать случайную тему</span>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
