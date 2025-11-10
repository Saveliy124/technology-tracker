function ProgressHeader({ totalTechnologies, completedTechnologies }) {
  // Расчёт процента выполнения
  const progressPercentage = Math.round(
    (completedTechnologies / totalTechnologies) * 100
  );

  // Определяем уровень прогресса для вывода мотивирующего сообщения
  let motivationalMessage;
  if (progressPercentage === 0) {
    motivationalMessage = '🚀 Начните прямо сейчас!';
  } else if (progressPercentage < 33) {
    motivationalMessage = '💪 Хороший старт!';
  } else if (progressPercentage < 66) {
    motivationalMessage = '📈 Вы на середине пути!';
  } else if (progressPercentage < 100) {
    motivationalMessage = '🔥 Уже близко!';
  } else {
    motivationalMessage = '🎉 Вы завершили все!';
  }

  return (
    <div className="progress-header">
      <div className="progress-header-content">
        <div className="progress-info">
          <h2>Ваш прогресс</h2>
          <p className="motivational-message">{motivationalMessage}</p>
        </div>

        <div className="progress-stats">
          <div className="stat-group">
            <span className="stat-label">Изучено:</span>
            <span className="stat-value">{completedTechnologies} / {totalTechnologies}</span>
          </div>
          
          <div className="stat-group">
            <span className="stat-label">Прогресс:</span>
            <span className="stat-value">{progressPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          >
            <span className="progress-label">{progressPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="progress-footer">
        <p className="progress-message">
          {completedTechnologies === totalTechnologies
            ? 'Поздравляем! Вы освоили все технологии на дорожной карте! 🏆'
            : `Осталось изучить ${totalTechnologies - completedTechnologies} тем`}
        </p>
      </div>
    </div>
  );
}

export default ProgressHeader;
