import { describe, it, expect, beforeEach } from 'vitest';
import { PuzzleSystem } from '../../src/game/systems/PuzzleSystem';
import { OPPORTUNITY_EPISODE } from '../../src/content/opportunity';

describe('PuzzleSystem', () => {
  let puzzle: PuzzleSystem;

  beforeEach(() => {
    puzzle = new PuzzleSystem(OPPORTUNITY_EPISODE.puzzle);
  });

  it('initializes as unsolved with 0 attempts', () => {
    expect(puzzle.hasSolved()).toBe(false);
    expect(puzzle.getAttempts()).toBe(0);
  });

  it('provides constructive feedback and hint when selecting an incorrect option', () => {
    const wrongResult = puzzle.evaluateAnswer('opt_life_fish');
    expect(wrongResult.isCorrect).toBe(false);
    expect(wrongResult.attempts).toBe(1);
    expect(wrongResult.feedback).toContain('não comprova que existiram peixes ou outra vida');
    expect(wrongResult.hint.length).toBeGreaterThan(10);
    expect(puzzle.hasSolved()).toBe(false);
  });

  it('marks puzzle as solved and provides scientific explanation on correct answer', () => {
    const correctResult = puzzle.evaluateAnswer('opt_evidence');
    expect(correctResult.isCorrect).toBe(true);
    expect(correctResult.feedback).toContain('Correto');
    expect(puzzle.hasSolved()).toBe(true);
  });

  it('handles multiple attempts without blocking the player', () => {
    puzzle.evaluateAnswer('opt_letter_poetic');
    expect(puzzle.hasSolved()).toBe(false);
    expect(puzzle.getAttempts()).toBe(1);

    const secondTry = puzzle.evaluateAnswer('opt_evidence');
    expect(secondTry.isCorrect).toBe(true);
    expect(secondTry.attempts).toBe(2);
    expect(puzzle.hasSolved()).toBe(true);
  });
});
