import { describe, it, expect } from 'vitest';
import { episode01Shots, episode01Clues } from '../../src/episode/episode01';
import { EPISODE_DIALOGUES } from '../../src/episode/dialogue';
import { EPISODE_SOURCES, EDITORIAL_DISCLAIMER } from '../../src/episode/sources';

describe('Episode Content Integrity', () => {
  it('contains exactly S01 through S12 in canonical sequence', () => {
    const expectedIds = [
      'S01',
      'S02',
      'S03',
      'S04',
      'S05',
      'S06',
      'S07',
      'S08',
      'S09',
      'S10',
      'S11',
      'S12',
    ];
    const shotIds = episode01Shots.map((s) => s.id);
    expect(shotIds).toEqual(expectedIds);
  });

  it('exceeds the 120-second minimum directed duration with honest scene timing', () => {
    const totalDirected = episode01Shots.reduce((acc, s) => acc + s.durationSec, 0);
    expect(totalDirected).toBeGreaterThanOrEqual(120);
    expect(totalDirected).toBe(255);
  });

  it('contains three distinct flashbacks S06, S08 and S10 with historical labels', () => {
    const flashbacks = episode01Shots.filter((s) => s.isFlashback);
    expect(flashbacks).toHaveLength(3);
    const fbIds = flashbacks.map((s) => s.id);
    expect(fbIds).toEqual(['S06', 'S08', 'S10']);

    for (const fb of flashbacks) {
      expect(fb.flashbackLabel).toBeDefined();
      expect(fb.flashbackLabel?.length).toBeGreaterThan(10);
    }
  });

  it('ensures all dialogues have unique IDs, valid speakers and fit within shot bounds', () => {
    const seenIds = new Set<string>();
    const validSpeakers = ['Narrador', 'Bip', 'Arquivo', 'Ranger 7'];

    for (const shot of episode01Shots) {
      for (const line of shot.dialogues) {
        expect(seenIds.has(line.id)).toBe(false);
        seenIds.add(line.id);
        expect(validSpeakers).toContain(line.speaker);
        expect(line.durationSec).toBeGreaterThan(0);
        expect(line.startOffsetSec).toBeGreaterThanOrEqual(0);
        expect(line.startOffsetSec).toBeLessThan(shot.durationSec);
      }
    }
  });

  it('links each clue to an existing shot and its corresponding flashback', () => {
    const shotMap = new Map(episode01Shots.map((s) => [s.id, s]));

    for (const clue of episode01Clues) {
      expect(shotMap.has(clue.shotId)).toBe(true);
      expect(shotMap.has(clue.flashbackShotId)).toBe(true);
      const fbShot = shotMap.get(clue.flashbackShotId);
      expect(fbShot?.isFlashback).toBe(true);
    }
  });

  it('provides verified primary NASA sources and scientific disclaimer', () => {
    expect(EPISODE_SOURCES.length).toBeGreaterThanOrEqual(2);
    expect(EPISODE_SOURCES.some((s) => s.url.includes('science.nasa.gov'))).toBe(true);
    expect(EDITORIAL_DISCLAIMER).toContain('Ranger 7');
    expect(EDITORIAL_DISCLAIMER).toContain('impacto planeado');
  });
});
