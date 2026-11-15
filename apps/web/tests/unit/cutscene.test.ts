import { describe, it, expect, beforeEach } from 'vitest';
import { CutsceneDirector } from '../../src/game/systems/CutsceneDirector';

describe('CutsceneDirector', () => {
  let director: CutsceneDirector;

  beforeEach(() => {
    director = new CutsceneDirector({
      durationSeconds: 15,
      fallbackSummary: ['Slide 1: Pouso', 'Slide 2: Água', 'Slide 3: Tempestade']
    });
  });

  it('starts in idle state', () => {
    expect(director.getStatus()).toBe('idle');
    expect(director.getCurrentTime()).toBe(0);
  });

  it('plays, pauses, and updates time correctly', () => {
    director.play();
    expect(director.getStatus()).toBe('playing');

    director.updateTime(5);
    expect(director.getCurrentTime()).toBe(5);

    director.pause();
    expect(director.getStatus()).toBe('paused');

    director.resume();
    expect(director.getStatus()).toBe('playing');
  });

  it('allows skipping and triggers completion callback exactly once', () => {
    let callCount = 0;
    director.onCompleted(() => {
      callCount++;
    });

    director.play();
    director.skip();

    expect(director.getStatus()).toBe('skipped');
    expect(director.getCurrentTime()).toBe(15);
    expect(callCount).toBe(1);

    // Additional skip calls do not trigger callback again
    director.skip();
    expect(callCount).toBe(1);
  });

  it('handles fallback storyboard mode gracefully on media failure', () => {
    director.triggerFallback();
    expect(director.getStatus()).toBe('fallback_storyboard');
    expect(director.getFallbackSummary().length).toBe(3);
  });

  it('supports replay safely from the beginning', () => {
    director.play();
    director.skip();
    expect(director.getStatus()).toBe('skipped');

    director.replay();
    expect(director.getStatus()).toBe('playing');
    expect(director.getCurrentTime()).toBe(0);
  });
});
