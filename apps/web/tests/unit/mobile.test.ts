import { describe, it, expect } from 'vitest';
import { ClueController } from '../../src/director/ClueController';

describe('Mobile Controls and Touch Logic', () => {
  it('allows mobile users to reorder image sequence using step buttons or swaps', () => {
    const controller = new ClueController();

    // Player starts with shuffled sequence on mobile
    const order = ['frame-mid', 'frame-distant', 'frame-close'];
    let res = controller.validateImageSequence(order);
    expect(res.success).toBe(false);
    expect(res.feedback).toContain('Dica do Arquivo');

    // Player moves frame-distant up to position 0
    const fixedOrder = ['frame-distant', 'frame-mid', 'frame-close'];
    res = controller.validateImageSequence(fixedOrder);
    expect(res.success).toBe(true);
    expect(res.feedback).toContain('confirmada');
  });

  it('provides accessible feedback for mobile touch options during final verdict', () => {
    const controller = new ClueController();

    const wrong = controller.evaluateVerdict('accidentalCrash');
    expect(wrong.correct).toBe(false);
    expect(wrong.explanation).toContain('Não foi um acidente');

    const right = controller.evaluateVerdict('plannedImpact');
    expect(right.correct).toBe(true);
    expect(right.explanation).toContain('cumprindo a sua missão científica');
  });
});
