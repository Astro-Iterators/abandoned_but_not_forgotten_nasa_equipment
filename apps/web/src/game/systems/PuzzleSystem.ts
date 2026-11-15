import type { PuzzleDefinition, PuzzleOption } from '../contracts';

export interface PuzzleEvaluationResult {
  isCorrect: boolean;
  selectedOption: PuzzleOption;
  feedback: string;
  hint: string;
  attempts: number;
}

export class PuzzleSystem {
  private definition: PuzzleDefinition;
  private attempts = 0;
  private isSolved = false;

  constructor(definition: PuzzleDefinition) {
    this.definition = definition;
  }

  public getDefinition(): Readonly<PuzzleDefinition> {
    return this.definition;
  }

  public getAttempts(): number {
    return this.attempts;
  }

  public hasSolved(): boolean {
    return this.isSolved;
  }

  public evaluateAnswer(optionId: string): PuzzleEvaluationResult {
    this.attempts++;
    const option = this.definition.options.find((opt) => opt.id === optionId);

    if (!option) {
      throw new Error(`Opção inválida com id "${optionId}"`);
    }

    const isCorrect = option.id === this.definition.correctOptionId;
    if (isCorrect) {
      this.isSolved = true;
    }

    return {
      isCorrect,
      selectedOption: option,
      feedback: option.explanation,
      hint: isCorrect ? '' : option.hint || this.definition.clueHint,
      attempts: this.attempts
    };
  }

  public reset(): void {
    this.attempts = 0;
    this.isSolved = false;
  }
}
