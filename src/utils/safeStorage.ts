// Bulletproof storage helper that falls back to in-memory store
// if localStorage or sessionStorage are restricted (e.g. Incognito mode, Safari private, or iframe security)

const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // localStorage restricted or disabled
    }
    return memoryStore[key] ?? null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // localStorage restricted or disabled
    }
    memoryStore[key] = value;
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // localStorage restricted or disabled
    }
    delete memoryStore[key];
  },

  getSessionItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch {
      // sessionStorage restricted or disabled
    }
    return memoryStore[`session_${key}`] ?? null;
  },

  setSessionItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch {
      // sessionStorage restricted or disabled
    }
    memoryStore[`session_${key}`] = value;
  },

  removeSessionItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch {
      // sessionStorage restricted or disabled
    }
    delete memoryStore[`session_${key}`];
  },
};
