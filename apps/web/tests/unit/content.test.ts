import { describe, it, expect } from 'vitest';
import { OPPORTUNITY_EPISODE } from '../../src/content/opportunity';
import { OPPORTUNITY_SOURCES } from '../../src/content/sources';

describe('Opportunity Scientific Content Integrity', () => {
  it('contains verified NASA and JPL primary sources', () => {
    expect(OPPORTUNITY_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const src of OPPORTUNITY_SOURCES) {
      expect(src.url).toMatch(/^https:\/\/[a-zA-Z0-9.-]*nasa\.gov/);
      expect(src.title.length).toBeGreaterThan(5);
      expect(src.description.length).toBeGreaterThan(15);
    }
  });

  it('correctly clarifies the famous poetic phrase as human interpretation, not literal robot message', () => {
    const poeticDialogue = OPPORTUNITY_EPISODE.roverDialogue.find(
      (d) => d.text.includes('bateria está fraca') || d.text.includes('tradução humana')
    );
    expect(poeticDialogue).toBeDefined();
    expect(poeticDialogue?.text).toContain('tradução humana dos meus dados');
  });

  it('strictly distinguishes evidence of water from unverified claims of life in puzzle options', () => {
    const correctOpt = OPPORTUNITY_EPISODE.puzzle.options.find((opt) => opt.isEvidence);
    const fakeLifeOpt = OPPORTUNITY_EPISODE.puzzle.options.find((opt) => opt.id === 'opt_life_fish');

    expect(correctOpt).toBeDefined();
    expect(correctOpt?.id).toBe(OPPORTUNITY_EPISODE.puzzle.correctOptionId);
    expect(fakeLifeOpt).toBeDefined();
    expect(fakeLifeOpt?.isEvidence).toBe(false);
    expect(fakeLifeOpt?.explanation).toContain('não comprova que existiram peixes ou outra vida');
  });

  it('clarifies the location Perseverance Valley is distinct from rover Perseverance', () => {
    const fact = OPPORTUNITY_EPISODE.missionSheet.facts.find((f) => f.label.includes('Repouso'));
    expect(fact).toBeDefined();
    expect(fact?.value).toContain('Perseverance Valley');
    expect(fact?.value).toContain('Não confundir com o rover Perseverance');
  });
});
