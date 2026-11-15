import type { SavedProgress } from './types';

const STORAGE_KEY = 'ainda-estou-aqui:ep01:progress';

export class ProgressStore {
  private memoryFallback: SavedProgress | null = null;
  private storageKey: string;

  constructor(key: string = STORAGE_KEY) {
    this.storageKey = key;
  }

  public save(progress: SavedProgress): boolean {
    this.memoryFallback = { ...progress };

    if (typeof window === 'undefined' || !window.localStorage) {
      return true;
    }

    try {
      const serialized = JSON.stringify(progress);
      window.localStorage.setItem(this.storageKey, serialized);
      return true;
    } catch (e) {
      console.warn('ProgressStore: Falha ao gravar no localStorage, a usar memória.', e);
      return false;
    }
  }

  public load(): SavedProgress | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return this.memoryFallback;
    }

    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (!raw) {
        return this.memoryFallback;
      }

      const parsed = JSON.parse(raw) as Partial<SavedProgress>;
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        parsed.schemaVersion === 1 &&
        typeof parsed.shotId === 'string' &&
        Array.isArray(parsed.discoveredClues)
      ) {
        return parsed as SavedProgress;
      }

      console.warn('ProgressStore: Dados de save corrompidos ou versão inválida. Ignorando.');
      return this.memoryFallback;
    } catch (e) {
      console.warn('ProgressStore: Falha ao ler localStorage, a usar memória.', e);
      return this.memoryFallback;
    }
  }

  public clear(): void {
    this.memoryFallback = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(this.storageKey);
      } catch (e) {
        console.warn('ProgressStore: Erro ao limpar localStorage.', e);
      }
    }
  }
}
