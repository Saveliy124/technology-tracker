import './TechnologyNotes.css';

function TechnologyNotes({ notes, onNotesChange, techId }) {
  // Обработчик для остановки распространения клика
  const handleNotesClick = (e) => {
    e.stopPropagation(); // ← ОСТАНАВЛИВАЕМ РАСПРОСТРАНЕНИЕ СОБЫТИЯ
  };

  // Обработчик для изменения текста в textarea
  const handleNotesChange = (e) => {
    e.stopPropagation(); // ← ТАКЖЕ ОСТАНАВЛИВАЕМ ДЛЯ НАДЁЖНОСТИ
    onNotesChange(techId, e.target.value);
  };

  return (
    <div 
      className="notes-section"
      onClick={handleNotesClick}  // ← ДОБАВЛЯЕМ ОБРАБОТЧИК
    >
      <h4>📝 Мои заметки:</h4>
      <textarea
        className="notes-textarea"
        value={notes}
        onChange={handleNotesChange}
        onClick={handleNotesClick}  // ← ТАКЖЕ ЗДЕСЬ
        onMouseDown={handleNotesClick}  // ← И ДЛЯ MOUSE DOWN
        placeholder="Записывайте сюда важные моменты, примеры кода или напоминания..."
        rows="4"
      />
      <div className="notes-hint">
        {notes.length > 0 
          ? `✅ Заметка сохранена (${notes.length} символов)` 
          : '💡 Добавьте заметку'}
      </div>
    </div>
  );
}

export default TechnologyNotes;
