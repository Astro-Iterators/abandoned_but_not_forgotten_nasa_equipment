import { PuzzleSystem } from '../game/systems/PuzzleSystem';
import type { PuzzleDefinition } from '../game/contracts';

export class PuzzlePanel {
  private container: HTMLElement;
  private puzzleSystem: PuzzleSystem;
  private onSolvedCallback: (() => void) | null = null;
  private onCloseCallback: (() => void) | null = null;

  constructor(parent: HTMLElement, definition: PuzzleDefinition) {
    this.puzzleSystem = new PuzzleSystem(definition);
    this.container = document.createElement('div');
    this.container.className = 'puzzle-overlay hidden';
    this.container.id = 'puzzle-panel';
    parent.appendChild(this.container);
  }

  public show(onSolved?: () => void, onClose?: () => void): void {
    this.onSolvedCallback = onSolved || null;
    this.onCloseCallback = onClose || null;
    this.container.classList.remove('hidden');
    this.render();
  }

  public hide(): void {
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }

  public isVisible(): boolean {
    return !this.container.classList.contains('hidden');
  }

  private render(feedback?: { isCorrect: boolean; text: string; hint: string }): void {
    const def = this.puzzleSystem.getDefinition();
    const isSolved = this.puzzleSystem.hasSolved();

    let feedbackHtml = '';
    if (feedback) {
      feedbackHtml = `
        <div class="puzzle-feedback ${feedback.isCorrect ? 'feedback-success' : 'feedback-error'}" id="puzzle-feedback">
          <h4>${feedback.isCorrect ? '✓ Evidência Científica Confirmada!' : '⚠ Análise Incompleta — Lembra-te do Método Científico'}</h4>
          <p>${feedback.text}</p>
          ${feedback.hint ? `<div class="puzzle-hint-box">💡 <strong>Pista de Bip:</strong> ${feedback.hint}</div>` : ''}
        </div>
      `;
    }

    const optionsHtml = def.options
      .map(
        (opt) => `
        <button class="puzzle-option-btn ${isSolved && opt.isEvidence ? 'option-correct' : ''}" data-option-id="${opt.id}" ${isSolved ? 'disabled' : ''}>
          <span class="option-marker">▶</span>
          <span class="option-text">${opt.label}</span>
        </button>
      `
      )
      .join('');

    this.container.innerHTML = `
      <div class="puzzle-card">
        <div class="puzzle-header">
          <div class="puzzle-tag">Enigma Educativo do Piloto</div>
          <h2 class="puzzle-title">${def.title}</h2>
          <p class="puzzle-prompt">${def.prompt}</p>
        </div>

        ${feedbackHtml}

        <div class="puzzle-options-list">
          ${optionsHtml}
        </div>

        <div class="puzzle-footer">
          ${
            isSolved
              ? `<button class="btn btn-success btn-large" id="btn-puzzle-continue">Consultar Ficha Científica e Concluir →</button>`
              : `<button class="btn btn-secondary" id="btn-puzzle-back">Voltar à Exploração</button>`
          }
        </div>
      </div>
    `;

    // Bind options click
    const optionButtons = this.container.querySelectorAll<HTMLButtonElement>('.puzzle-option-btn');
    optionButtons.forEach((btn) => {
      btn.onclick = () => {
        const optionId = btn.getAttribute('data-option-id');
        if (optionId) {
          const result = this.puzzleSystem.evaluateAnswer(optionId);
          this.render({
            isCorrect: result.isCorrect,
            text: result.feedback,
            hint: result.hint
          });
        }
      };
    });

    const backBtn = this.container.querySelector('#btn-puzzle-back') as HTMLButtonElement;
    if (backBtn) {
      backBtn.onclick = () => {
        this.hide();
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
      };
    }

    const continueBtn = this.container.querySelector('#btn-puzzle-continue') as HTMLButtonElement;
    if (continueBtn) {
      continueBtn.onclick = () => {
        this.hide();
        if (this.onSolvedCallback) {
          this.onSolvedCallback();
        }
      };
    }
  }
}
