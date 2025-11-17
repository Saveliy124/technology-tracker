import { useState } from 'react';
import useTechnologies from '../hooks/useTechnologies';
import './Settings.css';

function Settings() {
  const { technologies } = useTechnologies();
  const [exportFormat, setExportFormat] = useState('json');
  const [message, setMessage] = useState('');

  // Экспорт данных
  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      technologies: technologies
    };

    if (exportFormat === 'json') {
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
    } else if (exportFormat === 'csv') {
      const headers = ['ID', 'Название', 'Описание', 'Статус', 'Заметки'];
      const rows = technologies.map(tech => [
        tech.id,
        `"${tech.title}"`,
        `"${tech.description}"`,
        tech.status,
        `"${tech.notes.replace(/"/g, '""')}"`
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
    }

    setMessage(`✅ Данные успешно экспортированы в ${exportFormat.toUpperCase()}`);
    setTimeout(() => setMessage(''), 3000);
  };

  // Импорт данных
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.technologies && Array.isArray(imported.technologies)) {
          localStorage.setItem('technologies', JSON.stringify(imported.technologies));
          setMessage('✅ Данные успешно импортированы! Обновите страницу');
          setTimeout(() => window.location.reload(), 2000);
        } else {
          setMessage('❌ Неверный формат файла');
        }
      } catch (err) {
        setMessage('❌ Ошибка при чтении файла');
      }
    };
    reader.readAsText(file);
  };

  // Очистка всех данных
  const handleClearAll = () => {
    if (window.confirm('⚠️ Вы уверены? Все данные будут удалены!')) {
      localStorage.removeItem('technologies');
      setMessage('✅ Все данные удалены');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  // Сброс на значения по умолчанию
  const handleReset = () => {
    if (window.confirm('⚠️ Восстановить данные по умолчанию?')) {
      const defaultTechs = [
        { id: 1, title: 'React Hooks', description: 'Глубокое изучение React Hooks', status: 'not-started', notes: '', category: 'frontend' },
        { id: 2, title: 'Redux', description: 'Управление состоянием приложения', status: 'not-started', notes: '', category: 'frontend' },
        { id: 3, title: 'REST API', description: 'Создание и потребление REST API', status: 'not-started', notes: '', category: 'backend' }
      ];
      localStorage.setItem('technologies', JSON.stringify(defaultTechs));
      setMessage('✅ Данные восстановлены');
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="page-header">
          <h1>⚙️ Настройки приложения</h1>
          <p>Управляйте данными и параметрами TechTracker</p>
        </div>

        {/* Сообщение */}
        {message && (
          <div className={`alert ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="settings-grid">
          {/* ========== ЭКСПОРТ ДАННЫХ ========== */}
          <div className="settings-card">
            <div className="card-header">
              <h3>📤 Экспорт данных</h3>
              <span className="card-icon">💾</span>
            </div>

            <div className="card-content">
              <p className="card-description">
                Сохраните все ваши технологии и прогресс в файл
              </p>

              <div className="setting-item">
                <label>Формат файла:</label>
                <select 
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="select-input"
                >
                  <option value="json">JSON (полные данные)</option>
                  <option value="csv">CSV (для Excel)</option>
                </select>
              </div>

              <button 
                onClick={handleExport}
                className="btn btn-primary"
              >
                ⬇️ Экспортировать
              </button>

              <div className="info-box">
                <p>📌 Включает: все технологии, статусы, заметки и дату экспорта</p>
              </div>
            </div>
          </div>

          {/* ========== ИМПОРТ ДАННЫХ ========== */}
          <div className="settings-card">
            <div className="card-header">
              <h3>📥 Импорт данных</h3>
              <span className="card-icon">📂</span>
            </div>

            <div className="card-content">
              <p className="card-description">
                Загрузите ранее экспортированные данные
              </p>

              <div className="file-input-wrapper">
                <input 
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="file-input"
                  id="import-file"
                />
                <label htmlFor="import-file" className="btn btn-secondary">
                  📋 Выбрать файл
                </label>
              </div>

              <div className="info-box">
                <p>⚠️ Импорт заменит все текущие данные</p>
              </div>
            </div>
          </div>

          {/* ========== ОЧИСТКА ДАННЫХ ========== */}
          <div className="settings-card">
            <div className="card-header">
              <h3>🗑️ Очистить данные</h3>
              <span className="card-icon">⚠️</span>
            </div>

            <div className="card-content">
              <p className="card-description">
                Удалить все технологии и начать заново
              </p>

              <button 
                onClick={handleClearAll}
                className="btn btn-danger"
              >
                🗑️ Удалить все данные
              </button>

              <div className="info-box">
                <p>⚠️ Это действие невозможно отменить!</p>
              </div>
            </div>
          </div>

          {/* ========== ВОССТАНОВЛЕНИЕ ========== */}
          <div className="settings-card">
            <div className="card-header">
              <h3>🔄 Восстановление</h3>
              <span className="card-icon">↩️</span>
            </div>

            <div className="card-content">
              <p className="card-description">
                Восстановить данные по умолчанию
              </p>

              <button 
                onClick={handleReset}
                className="btn btn-outline"
              >
                ↩️ Восстановить по умолчанию
              </button>

              <div className="info-box">
                <p>📌 Загрузит базовый набор технологий для начинающих</p>
              </div>
            </div>
          </div>

          {/* ========== ИНФОРМАЦИЯ ========== */}
          <div className="settings-card">
            <div className="card-header">
              <h3>ℹ️ О приложении</h3>
              <span className="card-icon">📱</span>
            </div>

            <div className="card-content">
              <div className="info-item">
                <span className="label">Версия:</span>
                <span className="value">1.0.0</span>
              </div>
              <div className="info-item">
                <span className="label">Технологии:</span>
                <span className="value">{technologies.length}</span>
              </div>
              <div className="info-item">
                <span className="label">Хранилище:</span>
                <span className="value">localStorage</span>
              </div>
              <div className="info-item">
                <span className="label">Последнее обновление:</span>
                <span className="value">{new Date().toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          </div>

          {/* ========== СПРАВКА ========== */}
          <div className="settings-card">
            <div className="card-header">
              <h3>❓ Справка</h3>
              <span className="card-icon">💬</span>
            </div>

            <div className="card-content">
              <ul className="help-list">
                <li>📚 Добавьте технологию через кнопку "➕ Добавить"</li>
                <li>✅ Кликните на карточку для изменения статуса</li>
                <li>📝 Добавляйте заметки в каждую технологию</li>
                <li>📊 Смотрите статистику на странице "Статистика"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
