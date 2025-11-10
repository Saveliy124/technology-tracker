import { useState, useEffect } from 'react';

/**
 * Кастомный хук для работы с localStorage
 * @param {string} key - ключ в localStorage
 * @param {any} initialValue - начальное значение
 * @returns {[any, Function]} - [значение, функция обновления]
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Пытаемся получить значение из localStorage
      const item = window.localStorage.getItem(key);
      
      if (item) {
        console.log(`✅ Загружено из localStorage (${key}):`, JSON.parse(item));
        return JSON.parse(item);
      } else {
        console.log(`💡 localStorage пуст, используется начальное значение (${key})`);
        return initialValue;
      }
    } catch (error) {
      console.error(`❌ Ошибка при чтении localStorage (${key}):`, error);
      return initialValue;
    }
  });

  // Эффект для сохранения в localStorage при изменении
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      console.log(`💾 Сохранено в localStorage (${key})`);
    } catch (error) {
      console.error(`❌ Ошибка при сохранении в localStorage (${key}):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
