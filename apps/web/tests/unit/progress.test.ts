import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressManager } from '../../src/game/progress';

describe('ProgressManager', () => {
  let progress: ProgressManager;

  beforeEach(() => {
    progress = new ProgressManager();
    progress.reset();
  });

  it('initializes with default incomplete state', () => {
    const data = progress.getData();
    expect(data.clueDiscovered).toBe(false);
    expect(data.roverContacted).toBe(false);
    expect(data.cinematicViewed).toBe(false);
    expect(data.puzzleSolved).toBe(false);
    expect(data.episodeCompleted).toBe(false);
  });

  it('updates clue, rover contact and cinematic view flags', () => {
    progress.setClueDiscovered(true);
    expect(progress.getData().clueDiscovered).toBe(true);

    progress.setRoverContacted(true);
    expect(progress.getData().roverContacted).toBe(true);

    progress.setCinematicViewed(true);
    expect(progress.getData().cinematicViewed).toBe(true);
  });

  it('refuses to complete episode if puzzle is not solved', () => {
    progress.setRoverContacted(true);
    expect(progress.completeEpisode()).toBe(false);
    expect(progress.isCompleted()).toBe(false);
  });

  it('completes episode successfully when rover contacted and puzzle solved', () => {
    progress.setRoverContacted(true);
    progress.setPuzzleSolved(true);
    expect(progress.isReadyToComplete()).toBe(true);
    expect(progress.completeEpisode()).toBe(true);
    expect(progress.isCompleted()).toBe(true);
  });

  it('handles audio mute setting safely', () => {
    progress.setAudioMuted(true);
    expect(progress.getData().audioMuted).toBe(true);
    progress.setAudioMuted(false);
    expect(progress.getData().audioMuted).toBe(false);
  });
});
