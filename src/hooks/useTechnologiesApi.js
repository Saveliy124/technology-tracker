import { useState, useEffect } from 'react';
import { loadTechnologiesFromAPI } from '../services/api';

function useTechnologiesApi() {
  const [apiTechnologies, setApiTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // ========== ЗАГРУЗКА ТЕХНОЛОГИЙ ИЗ API ==========
  const fetchTechnologies = async (query = 'javascript') => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Загрузка технологий: ${query}`);

      const data = await loadTechnologiesFromAPI(query);

      if (data && data.length > 0) {
        setApiTechnologies(data);
        localStorage.setItem('apiTechnologies', JSON.stringify(data));
        setLastFetch(new Date().toLocaleString('ru-RU'));
        console.log(`✅ Загружено ${data.length} технологий`);
        return data;
      } else {
        const msg = 'Технологии не найдены';
        setError(msg);
        console.warn(`⚠️ ${msg}`);
        return null;
      }
    } catch (err) {
      const errorMsg = `Ошибка: ${err.message}`;
      setError(errorMsg);
      console.error(`❌ ${errorMsg}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ========== ЗАГРУЗКА ПРИ МОНТИРОВАНИИ ==========
  useEffect(() => {
    console.log('📱 Компонент useTechnologiesApi смонтирован');
    
    // Проверяем localStorage сначала
    const saved = localStorage.getItem('apiTechnologies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          console.log(`📦 Загружено ${parsed.length} технологий из localStorage`);
          setApiTechnologies(parsed);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Ошибка парсинга localStorage:', err);
      }
    }

    // Если в localStorage ничего нет, загружаем с API
    console.log('🌐 Загрузка с GitHub API...');
    fetchTechnologies('javascript');
  }, []);

  // ========== ДОБАВЛЕНИЕ НОВОЙ ТЕХНОЛОГИИ ==========
  const addTechnology = async (techData) => {
    try {
      const newTech = {
        id: Math.max(...apiTechnologies.map(t => t.id || 0), 0) + 1,
        ...techData,
        status: 'not-started',
        notes: '',
        createdAt: new Date().toISOString(),
        source: 'manual'
      };

      const updated = [...apiTechnologies, newTech];
      setApiTechnologies(updated);
      localStorage.setItem('apiTechnologies', JSON.stringify(updated));
      return newTech;
    } catch (err) {
      console.error('Ошибка добавления технологии:', err);
      throw new Error('Не удалось добавить технологию');
    }
  };

  // ========== УДАЛЕНИЕ ТЕХНОЛОГИИ ==========
  const deleteTechnology = (id) => {
    const updated = apiTechnologies.filter(tech => tech.id !== id);
    setApiTechnologies(updated);
    localStorage.setItem('apiTechnologies', JSON.stringify(updated));
    console.log(`🗑️ Удалена технология с ID: ${id}`);
  };

  // ========== ОБНОВЛЕНИЕ ТЕХНОЛОГИИ ==========
  const updateTechnology = (id, updates) => {
    const updated = apiTechnologies.map(tech =>
      tech.id === id ? { ...tech, ...updates } : tech
    );
    setApiTechnologies(updated);
    localStorage.setItem('apiTechnologies', JSON.stringify(updated));
    console.log(`✏️ Обновлена технология с ID: ${id}`);
  };

  // ========== ЭКСПОРТ В JSON ==========
  const exportToJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      count: apiTechnologies.length,
      technologies: apiTechnologies
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-api-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('📥 JSON экспортирован');
  };

  // ========== ИМПОРТ ИЗ JSON ==========
  const importFromJSON = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.technologies && Array.isArray(data.technologies)) {
            setApiTechnologies(data.technologies);
            localStorage.setItem('apiTechnologies', JSON.stringify(data.technologies));
            console.log(`📤 JSON импортирован: ${data.technologies.length} технологий`);
            resolve(data.technologies.length);
          } else {
            reject(new Error('Неверный формат файла'));
          }
        } catch (err) {
          reject(new Error(`Ошибка чтения файла: ${err.message}`));
        }
      };
      reader.onerror = () => {
        reject(new Error('Ошибка при чтении файла'));
      };
      reader.readAsText(file);
    });
  };

  // ========== ПОЛУЧЕНИЕ СТАТИСТИКИ ==========
  const getStatistics = () => {
    const total = apiTechnologies.length;
    const completed = apiTechnologies.filter(t => t.status === 'completed').length;
    const inProgress = apiTechnologies.filter(t => t.status === 'in-progress').length;
    const notStarted = apiTechnologies.filter(t => t.status === 'not-started').length;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  // ========== ПОЛУЧЕНИЕ КАТЕГОРИЙ ==========
  const getCategories = () => {
    return [...new Set(apiTechnologies.map(t => t.category || 'другое'))];
  };

  // ========== ФИЛЬТРАЦИЯ ПО КАТЕГОРИИ ==========
  const getTechnologiesByCategory = (category) => {
    if (category === 'all') return apiTechnologies;
    return apiTechnologies.filter(t => t.category === category);
  };

  // ========== ПОИСК ==========
  const searchTechnologies = (query) => {
    const lowerQuery = query.toLowerCase();
    return apiTechnologies.filter(tech =>
      tech.title.toLowerCase().includes(lowerQuery) ||
      tech.description.toLowerCase().includes(lowerQuery) ||
      (tech.language && tech.language.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    // Данные
    technologies: apiTechnologies,
    loading,
    error,
    lastFetch,

    // Методы работы с данными
    fetchTechnologies,
    addTechnology,
    deleteTechnology,
    updateTechnology,

    // Методы работы с файлами
    exportToJSON,
    importFromJSON,

    // Методы работы с информацией
    getStatistics,
    getCategories,
    getTechnologiesByCategory,
    searchTechnologies
  };
}

export default useTechnologiesApi;
