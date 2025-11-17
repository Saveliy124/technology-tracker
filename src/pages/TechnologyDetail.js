import { useParams, Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import TechnologyNotes from '../components/TechnologyNotes';
import './TechnologyDetail.css';

function TechnologyDetail() {
  const { id } = useParams();
  const { technologies, updateStatus, updateNotes } = useTechnologies();
  
  const technology = technologies.find(t => t.id === parseInt(id));

  if (!technology) {
    return (
      <div className="detail-page not-found">
        <div className="not-found-container">
          <div className="not-found-icon">😕</div>
          <h1>Технология не найдена</h1>
          <p>Технология с ID {id} не существует в вашей базе.</p>
          <Link to="/technologies" className="btn btn-primary">
            ← Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  let statusIcon, statusColor;
  if (technology.status === 'completed') {
    statusIcon = '✅';
    statusColor = 'completed';
  } else if (technology.status === 'in-progress') {
    statusIcon = '📚';
    statusColor = 'in-progress';
  } else {
    statusIcon = '⏳';
    statusColor = 'not-started';
  }

  const handleStatusChange = (newStatus) => {
    updateStatus(technology.id, newStatus);
  };

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Кнопка назад */}
        <Link to="/technologies" className="btn btn-outline btn-back">
          ← Назад к списку
        </Link>

        {/* Основная карточка */}
        <div className={`detail-card ${statusColor}`}>
          <div className="detail-header">
            <div className="detail-title">
              <span className="detail-icon">{statusIcon}</span>
              <div className="title-content">
                <h1>{technology.title}</h1>
                <span className={`status-badge ${statusColor}`}>
                  {statusColor === 'completed' 
                    ? '✅ Пройдено' 
                    : statusColor === 'in-progress' 
                    ? '📚 В процессе' 
                    : '⏳ Не начато'}
                </span>
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className="detail-section">
            <h3>📖 Описание</h3>
            <p className="description-text">{technology.description}</p>
          </div>

          {/* Изменение статуса */}
          <div className="detail-section">
            <h3>🎯 Статус изучения</h3>
            <div className="status-buttons">
              <button
                className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
                onClick={() => handleStatusChange('not-started')}
              >
                <span className="btn-icon">⏳</span>
                <span className="btn-text">Не начато</span>
              </button>
              <button
                className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
                onClick={() => handleStatusChange('in-progress')}
              >
                <span className="btn-icon">📚</span>
                <span className="btn-text">В процессе</span>
              </button>
              <button
                className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
                onClick={() => handleStatusChange('completed')}
              >
                <span className="btn-icon">✅</span>
                <span className="btn-text">Завершено</span>
              </button>
            </div>
          </div>

          {/* Заметки */}
          <div className="detail-section">
            <h3>📝 Ваши заметки</h3>
            <TechnologyNotes 
              notes={technology.notes}
              onNotesChange={updateNotes}
              techId={technology.id}
            />
          </div>
        </div>

        {/* Информационная панель */}
        <div className="detail-info">
          <div className="info-card">
            <h3>ℹ️ Информация о технологии</h3>
            
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{technology.id}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Категория:</span>
              <span className="info-value">
                {technology.category ? (
                  <span className="category-badge">{technology.category}</span>
                ) : (
                  <span className="category-badge">frontend</span>
                )}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Статус:</span>
              <span className={`status-text status-${statusColor}`}>
                {statusColor === 'completed' 
                  ? 'Завершено' 
                  : statusColor === 'in-progress' 
                  ? 'В процессе' 
                  : 'Не начато'}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Заметок:</span>
              <span className="info-value">{technology.notes.length} символов</span>
            </div>
          </div>

          {/* Советы по изучению */}
          <div className="tips-card">
            <h3>💡 Советы по изучению</h3>
            <ul className="tips-list">
              <li>Начните с официальной документации</li>
              <li>Практикуйте на реальных проектах</li>
              <li>Записывайте ключевые моменты в заметки</li>
              <li>Не забывайте про примеры кода</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;
