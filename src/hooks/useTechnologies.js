import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение базовых компонентов, функциональные и классовые компоненты', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX, встраивание JavaScript выражений', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов, useState хук', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 4, 
    title: 'Props и PropTypes', 
    description: 'Передача данных между компонентами через props', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 5, 
    title: 'Lifecycle Methods', 
    description: 'Жизненный цикл компонентов, useEffect хук', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 6, 
    title: 'React Router', 
    description: 'Маршрутизация в приложении, навигация между страницами', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 7, 
    title: 'Context API', 
    description: 'Глобальное управление состоянием с помощью Context API', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 8, 
    title: 'Custom Hooks', 
    description: 'Создание собственных хуков для переиспользования логики', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  }
];

/**
 * Кастомный хук для управления технологиями
 * Упрощает работу с состоянием и localStorage
 */
function useTechnologies() {
  // Используем useLocalStorage вместо useState
  const [technologies, setTechnologies] = useLocalStorage('techTrackerData', initialTechnologies);

  // ========== ФУНКЦИИ ОБНОВЛЕНИЯ ==========

  /**
   * Обновляет статус технологии
   * @param {number} techId - ID технологии
   * @param {string} newStatus - новый статус (not-started, in-progress, completed)
   */
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  /**
   * Обновляет заметки технологии
   * @param {number} techId - ID технологии
   * @param {string} newNotes - новые заметки
   */
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  /**
   * Отмечает все технологии как выполненные
   */
  const markAllCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({
        ...tech,
        status: 'completed'
      }))
    );
  };

  /**
   * Сбрасывает все статусы на не начато
   */
  const resetAllStatuses = () => {
    setTechnologies(prev =>
      prev.map(tech => ({
        ...tech,
        status: 'not-started'
      }))
    );
  };

  /**
   * Выбирает случайную технологию и устанавливает её в процесс
   */
  const selectRandomTechnology = () => {
    const notStartedTechs = technologies.filter(t => t.status === 'not-started');
    
    if (notStartedTechs.length > 0) {
      const randomTech = notStartedTechs[
        Math.floor(Math.random() * notStartedTechs.length)
      ];
      updateStatus(randomTech.id, 'in-progress');
    } else {
      const notCompletedTechs = technologies.filter(t => t.status !== 'completed');
      if (notCompletedTechs.length > 0) {
        const randomTech = notCompletedTechs[
          Math.floor(Math.random() * notCompletedTechs.length)
        ];
        updateStatus(randomTech.id, 'in-progress');
      }
    }
  };

  // ========== ФУНКЦИИ РАСЧЁТА ==========

  /**
   * Рассчитывает общий прогресс
   * @returns {number} процент завершения (0-100)
   */
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  /**
   * Получает статистику по статусам
   * @returns {Object} объект со статистикой
   */
  const getStatistics = () => {
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;

    return {
      total: technologies.length,
      completed,
      inProgress,
      notStarted,
      progress: calculateProgress()
    };
  };

  /**
   * Фильтрует технологии по статусу
   * @param {string} status - статус для фильтрации
   * @returns {Array} отфильтрованный массив
   */
  const getTechnologiesByStatus = (status) => {
    if (status === 'all') return technologies;
    return technologies.filter(tech => tech.status === status);
  };

  /**
   * Поиск технологий по названию и описанию
   * @param {string} query - поисковый запрос
   * @returns {Array} отфильтрованный массив
   */
  const searchTechnologies = (query) => {
    const lowerQuery = query.toLowerCase();
    return technologies.filter(tech =>
      tech.title.toLowerCase().includes(lowerQuery) ||
      tech.description.toLowerCase().includes(lowerQuery)
    );
  };

  // ========== ВОЗВРАЩАЕМЫЕ ЗНАЧЕНИЯ ==========

  return {
    // Данные
    technologies,
    
    // Функции обновления
    updateStatus,
    updateNotes,
    markAllCompleted,
    resetAllStatuses,
    selectRandomTechnology,
    
    // Функции расчёта
    calculateProgress,
    getStatistics,
    getTechnologiesByStatus,
    searchTechnologies
  };
}

export default useTechnologies;
