import { describe, it, expect, beforeEach } from 'vitest';
import { EpisodeStateManager } from '../../src/director/EpisodeState';

describe('EpisodeStateManager', () => {
  let stateManager: EpisodeStateManager;

  beforeEach(() => {
    stateManager = new EpisodeStateManager();
  });

  it('initializes with default clean state', () => {
    const state = stateManager.getState();
    expect(state.currentShotId).toBe('S01');
    expect(state.discoveredClues).toEqual([]);
    expect(state.completedFlashbacks).toEqual([]);
    expect(state.verdictCorrect).toBeUndefined();
    expect(state.isSubtitlesEnabled).toBe(true);
    expect(state.isMuted).toBe(false);
  });

  it('registers discovered clues idempotently without duplicates', () => {
    stateManager.discoverClue('clueA');
    expect(stateManager.getState().discoveredClues).toEqual(['clueA']);

    // Duplicate discovery
    stateManager.discoverClue('clueA');
    expect(stateManager.getState().discoveredClues).toEqual(['clueA']);

    stateManager.discoverClue('clueB');
    expect(stateManager.getState().discoveredClues).toEqual(['clueA', 'clueB']);
  });

  it('records completed flashbacks idempotently', () => {
    stateManager.completeFlashback('S06');
    expect(stateManager.getState().completedFlashbacks).toEqual(['S06']);

    stateManager.completeFlashback('S06');
    expect(stateManager.getState().completedFlashbacks).toEqual(['S06']);
  });

  it('records final verdict and handles correct vs incorrect', () => {
    stateManager.setVerdict(false);
    expect(stateManager.getState().verdictCorrect).toBe(false);

    stateManager.setVerdict(true);
    expect(stateManager.getState().verdictCorrect).toBe(true);
  });

  it('exports and restores safe serializable progress without DOM or WebGL refs', () => {
    stateManager.setShot('S07');
    stateManager.discoverClue('clueA');
    stateManager.discoverClue('clueB');
    stateManager.completeFlashback('S06');

    const progress = stateManager.exportProgress();
    expect(progress.schemaVersion).toBe(1);
    expect(progress.shotId).toBe('S07');
    expect(progress.discoveredClues).toContain('clueA');
    expect(progress.discoveredClues).toContain('clueB');
    expect(progress.completedFlashbacks).toContain('S06');

    // Restore into a fresh manager
    const newManager = new EpisodeStateManager();
    newManager.restoreProgress(progress);
    const restored = newManager.getState();
    expect(restored.currentShotId).toBe('S07');
    expect(restored.discoveredClues).toEqual(['clueA', 'clueB']);
    expect(restored.completedFlashbacks).toEqual(['S06']);
  });
});
