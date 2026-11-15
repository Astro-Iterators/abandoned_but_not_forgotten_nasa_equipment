import type { Clue, ClueId } from './types';
import { episode01Clues } from '../episode/episode01';

export interface ImageCard {
  id: string;
  title: string;
  altitudeKm: number;
  description: string;
  correctIndex: number; // 0 = first/farthest, 1 = middle, 2 = closest
}

export const CLUE_C_FRAMES: ImageCard[] = [
  {
    id: 'frame-distant',
    title: 'Fotograma 1 — Visão Geral',
    altitudeKm: 2100,
    description: 'Crateras grandes visíveis em todo o horizonte lunar.',
    correctIndex: 0,
  },
  {
    id: 'frame-mid',
    title: 'Fotograma 2 — Aproximação Intermédia',
    altitudeKm: 470,
    description: 'Detalhes nítidos das ravinas e crateras secundárias.',
    correctIndex: 1,
  },
  {
    id: 'frame-close',
    title: 'Fotograma 3 — Último Olhar',
    altitudeKm: 3.5,
    description: 'Superfície imediata antes do embate; pequenas crateras individuais visíveis.',
    correctIndex: 2,
  },
];

export class ClueController {
  private clues: Map<ClueId, Clue>;

  constructor(clueList: Clue[] = episode01Clues) {
    this.clues = new Map(clueList.map((c) => [c.id, c]));
  }

  public getClue(id: ClueId): Clue | undefined {
    return this.clues.get(id);
  }

  public getAllClues(): Clue[] {
    return Array.from(this.clues.values());
  }

  public validateImageSequence(selectedIds: string[]): { success: boolean; feedback: string } {
    if (selectedIds.length !== 3) {
      return {
        success: false,
        feedback: 'Deves seleccionar os 3 fotogramas por ordem decrescente de altitude.',
      };
    }

    const correctOrder = ['frame-distant', 'frame-mid', 'frame-close'];
    const isCorrect = selectedIds.every((id, idx) => id === correctOrder[idx]);

    if (isCorrect) {
      return {
        success: true,
        feedback:
          'Sequência histórica confirmada! As fotografias revelam a descida progressiva até ao solo lunar.',
      };
    }

    // Friendly educational hint
    return {
      success: false,
      feedback:
        'Dica do Arquivo: Organiza do plano mais aberto e distante (onde se vê o horizonte) para o plano mais próximo da superfície.',
    };
  }

  public evaluateVerdict(verdict: 'accidentalCrash' | 'plannedImpact'): {
    correct: boolean;
    explanation: string;
  } {
    if (verdict === 'plannedImpact') {
      return {
        correct: true,
        explanation:
          'Correcto! A Ranger 7 não tinha retrofoguetes para pousar; o seu propósito era fotografar a aproximação e embater como planeado, cumprindo a sua missão científica com sucesso.',
      };
    }

    return {
      correct: false,
      explanation:
        'Não foi um acidente. A Ranger 7 foi desenhada propositadamente para fotografar até ao impacto, fornecendo dados vitais para os futuros voos lunares.',
    };
  }
}
