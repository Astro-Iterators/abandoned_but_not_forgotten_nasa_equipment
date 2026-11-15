import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressStore } from '../../src/director/ProgressStore';
import type { SavedProgress } from '../../src/director/types';

describe('ProgressStore', () => {
  let store: ProgressStore;

  beforeEach(() => {
    store = new ProgressStore('test-ep01-progress');
    store.clear();
  });

  it('saves and loads valid progress safely', () => {
    const validProgress: SavedProgress = {
      schemaVersion: 1,
      shotId: 'S05',
      discoveredClues: ['clueA'],
      completedFlashbacks: ['S06'],
      verdictCorrect: true,
      summarySeen: false,
      timestamp: Date.now(),
    };

    const saved = store.save(validProgress);
    expect(saved).toBe(true);

    const loaded = store.load();
    expect(loaded).not.toBeNull();
    expect(loaded?.shotId).toBe('S05');
    expect(loaded?.discoveredClues).toEqual(['clueA']);
  });

  it('gracefully recovers when localStorage has corrupted or outdated schema data', () => {
    // Simulate corrupt data in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('test-ep01-progress', '{"badJson": true, "schemaVersion": 99}');
    }

    const loaded = store.load();
    // Should safely return memory fallback or null without throwing
    expect(loaded === null || loaded.schemaVersion === 1).toBe(true);
  });
});
