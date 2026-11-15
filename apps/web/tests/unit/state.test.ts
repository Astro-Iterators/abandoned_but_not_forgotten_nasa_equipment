import { describe, it, expect, beforeEach } from 'vitest';
import { StateManager } from '../../src/game/state';

describe('StateManager Transitions', () => {
  let sm: StateManager;

  beforeEach(() => {
    sm = new StateManager();
  });

  it('starts in menu state', () => {
    expect(sm.getState()).toBe('menu');
  });

  it('transitions from menu to exploration', () => {
    expect(sm.transition('exploration')).toBe(true);
    expect(sm.getState()).toBe('exploration');
  });

  it('strictly rejects transition to complete if puzzle is not solved or rover not contacted', () => {
    sm.transition('exploration');
    sm.transition('puzzle');

    // Attempting to complete without context
    expect(sm.canTransition('complete')).toBe(false);
    expect(sm.transition('complete')).toBe(false);
    expect(sm.getState()).toBe('puzzle');

    // Attempting to complete with only rover contacted but puzzle unsolved
    expect(sm.transition('complete', { roverContacted: true, puzzleSolved: false })).toBe(false);

    // Attempting to complete with only puzzle solved but rover uncontacted
    expect(sm.transition('complete', { roverContacted: false, puzzleSolved: true })).toBe(false);

    // Transition succeeds only when both conditions are satisfied
    expect(sm.transition('complete', { roverContacted: true, puzzleSolved: true })).toBe(true);
    expect(sm.getState()).toBe('complete');
  });

  it('handles pause and resume properly', () => {
    sm.transition('exploration');
    expect(sm.pause()).toBe(true);
    expect(sm.getState()).toBe('paused');
    expect(sm.resume()).toBe(true);
    expect(sm.getState()).toBe('exploration');
  });
});
