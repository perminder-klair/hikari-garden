import type { Snippet } from '../types';

export const snippets: Snippet[] = [
  {
    lang: 'TypeScript',
    code: `// Deep clone with type safety
const deepClone = <T>(obj: T): T => {
  if (obj === null) return obj;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj) as T;

  const clone = Array.isArray(obj) ? [] : {};
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = deepClone(obj[key]);
    return acc;
  }, clone) as T;
};`,
  },
  {
    lang: 'React',
    code: `// Custom hook for localStorage
const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (val: T) => void] => {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStored(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [stored, setValue];
};`,
  },
  {
    lang: 'Python',
    code: `# Decorator for timing functions
import time
from functools import wraps

def timer(func):
    """Measure execution time"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}: {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)`,
  },
  {
    lang: 'CSS',
    code: `/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.1);
}`,
  },
];
