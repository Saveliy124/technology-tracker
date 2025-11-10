import { useState } from 'react';
import './QuickActions.css';
import Modal from './Modal';

function QuickActions({ 
  onMarkAllComplete, 
  onResetAll, 
  onRandomSelect,
  technologies,
  totalTechnologies,
  completedTechnologies
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  // ========== ФУНКЦИЯ ЭКСПОРТА ==========
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      summary: {
        totalTechnologies: technologies.length,
        completedTechnologies: technologies.filter(t => t.status === 'completed').length,
        inProgressTechnologies: technologies.filter(t => t.status === 'in-progress').length,
        notStartedTechnologies: technologies.filter(t => t.status === 'not-started').length,
        progressPercentage: Math.round((technologies.filter(t => t.status === 'completed').length / technologies.length) * 100)
      },
      technologies: technologies
    };

    if (exportFormat === 'json') {
      downloadJSON(data);
    } else if (exportFormat === 'csv') {
      downloadCSV(data.technologies);
    }

    setShowExportModal(false);
  };

  // ========== ФУНКЦИИ СКАЧИВАНИЯ ==========

  /**
   * Скачивает данные в формате JSON
   */
  const downloadJSON = (data) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('✅ JSON экспортирован:', data);
  };

  /**
   * Скачивает данные в формате CSV
   */
  const downloadCSV = (technologies) => {
    const headers = ['ID', 'Название', 'Описание', 'Статус', 'Заметки', 'Категория'];
    const rows = technologies.map(tech => [
      tech.id,
      `"${tech.title}"`,
      `"${tech.description}"`,
      tech.status,
      `"${tech.notes.replace(/"/g, '""')}"`,
      tech.category || 'frontend'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('✅ CSV экспортирован');
  };

  /**
   * Копирует данные в буфер обмена
   */
  const copyToClipboard = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies
    };
    const dataStr = JSON.stringify(data, null, 2);
    
    navigator.clipboard.writeText(dataStr).then(() => {
      alert('✅ Данные скопированы в буфер обмена!');
      setShowExportModal(false);
    }).catch(() => {
      alert('❌ Ошибка при копировании данных');
    });
  };

  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      
      <div className="actions-grid">
        <button 
          className="action-btn mark-complete"
          onClick={onMarkAllComplete}
          disabled={completedTechnologies === totalTechnologies}
          title="Отметить все технологии как выполненные"
        >
          <span className="btn-icon">✅</span>
          <span className="btn-text">Все выполнены</span>
          <span className="btn-desc">Отметить все как выполненные</span>
        </button>

        <button 
          className="action-btn reset-all"
          onClick={onResetAll}
          disabled={completedTechnologies === 0}
          title="Сбросить все статусы на 'не начато'"
        >
          <span className="btn-icon">🔄</span>
          <span className="btn-text">Сброс</span>
          <span className="btn-desc">Сбросить все статусы</span>
        </button>

        <button 
          className="action-btn random-select"
          onClick={onRandomSelect}
          title="Выбрать случайную технологию"
        >
          <span className="btn-icon">🎲</span>
          <span className="btn-text">Случайный выбор</span>
          <span className="btn-desc">Начать случайную тему</span>
        </button>

        <button 
          className="action-btn export"
          onClick={() => setShowExportModal(true)}
          title="Экспортировать данные"
        >
          <span className="btn-icon">📤</span>
          <span className="btn-text">Экспорт</span>
          <span className="btn-desc">Экспортировать данные</span>
        </button>
      </div>

      {/* ========== МОДАЛЬНОЕ ОКНО ЭКСПОРТА ========== */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="📤 Экспорт данных"
      >
        <div className="export-modal-content">
          <p>Выберите формат экспорта:</p>

          <div className="export-format-options">
            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="json"
                checked={exportFormat === 'json'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <span className="format-name">JSON</span>
              <span className="format-desc">Полный формат со всеми данными</span>
            </label>

            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <span className="format-name">CSV</span>
              <span className="format-desc">Формат для Excel/Google Sheets</span>
            </label>
          </div>

          <div className="export-info">
            <p><strong>Что будет экспортировано:</strong></p>
            <ul>
              <li>✅ Все технологии ({technologies.length} шт)</li>
              <li>✅ Статусы и прогресс</li>
              <li>✅ Ваши заметки</li>
              <li>✅ Дата экспорта</li>
            </ul>
          </div>

          <div className="export-buttons">
            <button 
              className="btn btn-primary"
              onClick={handleExport}
            >
              📥 Скачать {exportFormat.toUpperCase()}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={copyToClipboard}
            >
              📋 Копировать в буфер обмена
            </button>

            <button 
              className="btn btn-outline"
              onClick={() => setShowExportModal(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;
