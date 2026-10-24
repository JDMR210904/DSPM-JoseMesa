import { useEffect, useState } from 'react';

// Custom hook genérico: estado sincronizado con localStorage
export function useLocalStorage<T>(key: string, initial: T) {
  const read = (): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  };

  const [value, setValue] = useState<T>(read);

  // Si cambia la clave (otro usuario), se recarga su información
  useEffect(() => {
    setValue(read());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
