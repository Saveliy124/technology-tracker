const GITHUB_API = 'https://api.github.com';

// ========== ЗАГРУЗКА ТЕХНОЛОГИЙ ИЗ API ==========
export const loadTechnologiesFromAPI = async (query = 'javascript') => {
  try {
    console.log(`🔍 Поиск репозиториев: ${query}`);
    
    // ✅ ИСПРАВЛЕНО: используем языки программирования, а не фреймворки
    const validLanguages = ['javascript', 'python', 'typescript', 'go', 'rust', 'java', 'cpp', 'csharp'];
    const searchLanguage = validLanguages.includes(query.toLowerCase()) 
      ? query.toLowerCase() 
      : 'javascript'; // Fallback на JavaScript

    console.log(`✅ Используется язык: ${searchLanguage}`);
    
    const searchUrl = `${GITHUB_API}/search/repositories?q=language:${searchLanguage}&sort=stars&order=desc&per_page=10`;
    
    console.log(`📡 URL запроса: ${searchUrl}`);

    const response = await fetch(searchUrl);

    console.log(`📊 Статус ответа: ${response.status}`);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('⏱️ Rate limit достигнут (60 запросов/час). Попробуйте позже');
      }
      if (response.status === 422) {
        throw new Error(`❌ Ошибка валидации (422). Проверьте синтаксис запроса. Язык: ${searchLanguage}`);
      }
      throw new Error(`API ошибка: ${response.status}`);
    }

    const data = await response.json();

    console.log(`📦 Получено репозиториев: ${data.items?.length || 0}`);

    if (!data.items || data.items.length === 0) {
      throw new Error(`Репозитории с языком "${searchLanguage}" не найдены`);
    }

    const technologies = data.items.map((repo, index) => ({
      id: repo.id || index + 1,
      title: repo.name.charAt(0).toUpperCase() + repo.name.slice(1),
      description: repo.description || 'Описание отсутствует',
      status: 'not-started',
      notes: '',
      category: getCategory(searchLanguage),
      language: repo.language || searchLanguage,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      source: 'github',
      owner: repo.owner.login,
      updatedAt: repo.updated_at,
      resources: []
    }));

    console.log(`✅ Трансформировано технологий: ${technologies.length}`);
    return technologies;
  } catch (error) {
    console.error('❌ Ошибка при загрузке API:', error.message);
    throw error;
  }
};

// ========== ОПРЕДЕЛЕНИЕ КАТЕГОРИИ ПО ЯЗЫКУ ==========
function getCategory(language) {
  const categories = {
    'javascript': 'frontend',
    'typescript': 'frontend',
    'python': 'backend',
    'java': 'backend',
    'go': 'backend',
    'rust': 'backend',
    'cpp': 'systems',
    'csharp': 'backend'
  };
  return categories[language] || 'other';
}

// ========== ЗАГРУЗКА РЕСУРСОВ ДЛЯ ТЕХНОЛОГИИ ==========
export const loadResourcesForTechnology = async (technologyName) => {
  try {
    const resources = [];

    // GitHub Awesome Lists
    const awesomeQuery = `${technologyName} awesome`;
    const awesomeResponse = await fetch(
      `${GITHUB_API}/search/repositories?q=${encodeURIComponent(awesomeQuery)}&sort=stars&per_page=5`
    );

    if (awesomeResponse.ok) {
      const awesomeData = await awesomeResponse.json();
      awesomeData.items?.forEach((repo) => {
        resources.push({
          type: 'github',
          title: repo.full_name,
          description: repo.description || 'Awesome список',
          url: repo.html_url,
          stars: repo.stargazers_count
        });
      });
    }

    const popularResources = getPopularResources(technologyName);
    resources.push(...popularResources);

    return resources;
  } catch (error) {
    console.error('Ошибка загрузки ресурсов:', error);
    return getPopularResources(technologyName);
  }
};

// ========== ПОПУЛЯРНЫЕ РЕСУРСЫ ПО ТЕХНОЛОГИЯМ ==========
function getPopularResources(tech) {
  const resources = {
    react: [
      { type: 'documentation', title: 'React Official Docs', description: 'Официальная документация React', url: 'https://react.dev' },
      { type: 'course', title: 'React Course - Scrimba', description: 'Интерактивный курс React', url: 'https://scrimba.com/learn/learnreact' }
    ],
    javascript: [
      { type: 'documentation', title: 'MDN Web Docs', description: 'Полная документация JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { type: 'book', title: 'Eloquent JavaScript', description: 'Отличная книга по JavaScript', url: 'https://eloquentjavascript.net/' }
    ],
    typescript: [
      { type: 'documentation', title: 'TypeScript Official Docs', description: 'Официальная документация TypeScript', url: 'https://www.typescriptlang.org/docs/' }
    ],
    python: [
      { type: 'documentation', title: 'Python Official Docs', description: 'Официальная документация Python', url: 'https://docs.python.org/' }
    ]
  };

  const techLower = tech.toLowerCase();
  return resources[techLower] || [];
}

// ========== ПОЛУЧЕНИЕ ПОПУЛЯРНЫХ ЯЗЫКОВ ==========
export const getPopularLanguages = async () => {
  const languages = [
    { code: 'javascript', label: '📜 JavaScript', emoji: '🚀' },
    { code: 'python', label: '🐍 Python', emoji: '🤖' },
    { code: 'typescript', label: '📘 TypeScript', emoji: '✨' },
    { code: 'go', label: '🐹 Go', emoji: '⚡' },
    { code: 'rust', label: '🦀 Rust', emoji: '🔐' }
  ];
  return languages;
};

// ========== ПРОВЕРКА СТАТУСА API ==========
export const checkAPIStatus = async () => {
  try {
    const response = await fetch(`${GITHUB_API}/rate_limit`);
    const data = await response.json();

    return {
      remaining: data.rate_limit.remaining,
      limit: data.rate_limit.limit,
      resetTime: new Date(data.rate_limit.reset * 1000)
    };
  } catch (error) {
    console.error('Ошибка проверки API:', error);
    return null;
  }
};
