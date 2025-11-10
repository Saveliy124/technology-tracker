import './TechnologyCard.css';
import TechnologyNotes from './TechnologyNotes';

function TechnologyCard({ 
  id, 
  title, 
  description, 
  status, 
  notes,
  onStatusChange,
  onNotesChange
}) {
  let statusIcon;
  let statusText;
  let statusClass;

  if (status === 'completed') {
    statusIcon = '✅';
    statusText = 'Пройдено';
    statusClass = 'completed';
  } else if (status === 'in-progress') {
    statusIcon = '📚';
    statusText = 'В процессе';
    statusClass = 'in-progress';
  } else if (status === 'not-started') {
    statusIcon = '⏳';
    statusText = 'Не начато';
    statusClass = 'not-started';
  }

  // Обработчик клика по карточке (ТОЛЬКО для изменения статуса)
  const handleCardClick = (e) => {
    // Проверяем, был ли клик по textarea или другим интерактивным элементам
    if (e.target.tagName === 'TEXTAREA' || e.target.closest('.notes-section')) {
      return; // ← ИГНОРИРУЕМ, ЕСЛИ КЛИК ПО TEXTAREA ИЛИ NOTES
    }

    let nextStatus;
    
    if (status === 'not-started') {
      nextStatus = 'in-progress';
    } else if (status === 'in-progress') {
      nextStatus = 'completed';
    } else if (status === 'completed') {
      nextStatus = 'not-started';
    }
    
    onStatusChange(id, nextStatus);
  };

  return (
    <div 
      className={`technology-card ${statusClass}`}
      onClick={handleCardClick}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className="status-badge">{statusIcon}</span>
      </div>
      <div className="card-body">
        <p className="description">{description}</p>
      </div>
      
      {/* Компонент заметок */}
      <TechnologyNotes 
        notes={notes}
        onNotesChange={onNotesChange}
        techId={id}
      />

      <div className="card-footer">
        <p className="status-text">Статус: {statusText}</p>
        <span className="click-hint">Нажмите для изменения статуса</span>
      </div>
    </div>
  );
}

export default TechnologyCard;
