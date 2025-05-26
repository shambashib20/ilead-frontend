// utils/storage.ts

export function setData<T = any>(key: string, value: T): boolean {
  try {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
    return true;
  } catch (error) {
    console.error(`❌ Error setting localStorage for key "${key}"`, error);
    return false;
  }
}

export function getData<T = any>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`❌ Error getting localStorage for key "${key}"`, error);
    return null;
  }
}

export function removeData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`❌ Error removing localStorage for key "${key}"`, error);
  }
}

export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`❌ Error clearing localStorage`, error);
  }
}
