import { describe, it, expect, beforeEach } from 'vitest';
import { TimelineDirector } from '../../src/director/TimelineDirector';
import { episode01Shots } from '../../src/episode/episode01';

describe('TimelineDirector', () => {
  let director: TimelineDirector;

  beforeEach(() => {
    director = new TimelineDirector(episode01Shots);
  });

  it('validates total directed duration of S01-S12 is at least 120 seconds', () => {
    const totalDirected = director.getTotalDirectedDuration();
    expect(totalDirected).toBeGreaterThanOrEqual(120);
    expect(totalDirected).toBe(255); // S01-S12 canonical duration
  });

  it('starts in ready mode and transitions to playing', () => {
    expect(director.getMode()).toBe('ready');
    director.start();
    expect(director.getMode()).toBe('playing');
    expect(director.getCurrentShot().id).toBe('S01');
  });

  it('pause test: advancing time during pause does not change shot or local time', () => {
    director.start();
    director.update(5.0); // 5 seconds into S01
    expect(director.getElapsedDirectedTime()).toBeCloseTo(5.0);
    expect(director.getCurrentShotLocalTime()).toBeCloseTo(5.0);

    director.pause();
    expect(director.getMode()).toBe('paused');

    // Advance clock while paused
    director.update(10.0);
    expect(director.getElapsedDirectedTime()).toBeCloseTo(5.0);
    expect(director.getCurrentShotLocalTime()).toBeCloseTo(5.0);
    expect(director.getCurrentShot().id).toBe('S01');

    director.resume();
    expect(director.getMode()).toBe('playing');
    director.update(2.0);
    expect(director.getElapsedDirectedTime()).toBeCloseTo(7.0);
  });

  it('advances between shots accurately at duration boundary', () => {
    director.start();
    // S01 is 25s
    director.update(24.9);
    expect(director.getCurrentShot().id).toBe('S01');
    director.update(0.2); // total 25.1 -> should enter S02
    expect(director.getCurrentShot().id).toBe('S02');
    expect(director.getCurrentShotLocalTime()).toBeCloseTo(0.1);
  });

  it('pauses and awaits interaction at designated interaction points', () => {
    director.start();
    // Advance to S05 (S01: 25s, S02: 25s, S03: 20s, S04: 15s = 85s total before S05)
    director.update(85.0);
    expect(director.getCurrentShot().id).toBe('S05');
    // S05 is 10s directed, then triggers interaction
    director.update(10.1);
    expect(director.getMode()).toBe('awaitingInteraction');
    expect(director.getCurrentShot().interaction).toBe('analyzeClueA');

    // Further updates while awaiting interaction do NOT advance shot
    director.update(5.0);
    expect(director.getCurrentShot().id).toBe('S05');
    expect(director.getMode()).toBe('awaitingInteraction');

    // Completing interaction resumes playback to next shot (S06 flashback 1)
    director.completeInteraction();
    expect(director.getMode()).toBe('playing');
    expect(director.getCurrentShot().id).toBe('S06');
  });

  it('supports skip to checkpoint/summary without falsifying watched directed time', () => {
    director.start();
    director.update(10.0);
    expect(director.getElapsedDirectedTime()).toBeCloseTo(10.0);

    director.skipToShot('S05');
    expect(director.getCurrentShot().id).toBe('S05');
    expect(director.getCurrentShotLocalTime()).toBe(0);
    // Directed watched time is still 10.0 (honest accounting)
    expect(director.getElapsedDirectedTime()).toBeCloseTo(10.0);
  });

  it('is idempotent on completion and replay', () => {
    director.start();
    // Skip to S12 (last shot)
    director.skipToShot('S12');
    // S12 duration is 20s
    director.update(21.0);
    expect(director.getMode()).toBe('finished');

    // Calling complete/update again does not crash or double complete
    director.update(5.0);
    expect(director.getMode()).toBe('finished');

    // Replay restarts cleanly
    director.replay();
    expect(director.getMode()).toBe('playing');
    expect(director.getCurrentShot().id).toBe('S01');
    expect(director.getCurrentShotLocalTime()).toBe(0);
  });
});
