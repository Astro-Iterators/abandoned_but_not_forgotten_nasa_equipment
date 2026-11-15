import { describe, it, expect, beforeEach } from 'vitest';
import { ClueController } from '../../src/director/ClueController';

describe('ClueController', () => {
  let controller: ClueController;

  beforeEach(() => {
    controller = new ClueController();
  });

  it('provides all three canonical clues A, B and C', () => {
    const clues = controller.getAllClues();
    expect(clues).toHaveLength(3);
    const ids = clues.map((c) => c.id);
    expect(ids).toContain('clueA');
    expect(ids).toContain('clueB');
    expect(ids).toContain('clueC');
  });

  it('validates correct image sequence in Clue C and rejects wrong orders with constructive help', () => {
    // Correct order: distant -> mid -> close
    const correctRes = controller.validateImageSequence([
      'frame-distant',
      'frame-mid',
      'frame-close',
    ]);
    expect(correctRes.success).toBe(true);
    expect(correctRes.feedback).toContain('confirmada');

    // Wrong order
    const wrongRes = controller.validateImageSequence([
      'frame-close',
      'frame-mid',
      'frame-distant',
    ]);
    expect(wrongRes.success).toBe(false);
    expect(wrongRes.feedback).toContain('Dica do Arquivo');
  });

  it('evaluates final verdict correctly distinguishing planned impact from accidental crash', () => {
    const plannedRes = controller.evaluateVerdict('plannedImpact');
    expect(plannedRes.correct).toBe(true);
    expect(plannedRes.explanation).toContain('cumprindo a sua missão');

    const crashRes = controller.evaluateVerdict('accidentalCrash');
    expect(crashRes.correct).toBe(false);
    expect(crashRes.explanation).toContain('Não foi um acidente');
  });
});
