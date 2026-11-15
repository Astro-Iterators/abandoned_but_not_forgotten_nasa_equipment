import type { Clue } from '../director/types';

export class AnalysisPanel {
  private element: HTMLElement;
  private cardEl: HTMLElement;
  private onConfirmCallback?: () => void;

  constructor(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'interaction-overlay';
    this.element.style.display = 'none';

    this.cardEl = document.createElement('div');
    this.cardEl.className = 'interaction-card analysis-card';
    this.element.appendChild(this.cardEl);

    container.appendChild(this.element);
  }

  public show(clue: Clue, onConfirm: () => void): void {
    this.onConfirmCallback = onConfirm;

    this.cardEl.innerHTML = `
      <div class="card-badge">ANÁLISE DE VESTÍGIO</div>
      <h2 class="card-title">${clue.name}</h2>
      <p class="card-desc">${clue.description}</p>
      
      <div class="card-fact-box">
        <span class="fact-tag">REGISTO DO ARQUIVO</span>
        <p class="fact-text">${clue.historicalContext}</p>
        <p class="fact-sub">${clue.archiveFact}</p>
      </div>

      <div class="card-actions">
        <button id="btn-analyze-confirm" class="touch-btn primary-touch-btn wide-btn" aria-label="Confirmar análise do vestígio e abrir memória histórica">
          <span class="icon">🔍</span>
          <span class="btn-label">Analisar Vestígio</span>
        </button>
      </div>
      <p class="touch-hint">Toca no botão para sincronizar os dados do Arquivo com a memória histórica.</p>
    `;

    const confirmBtn = this.cardEl.querySelector('#btn-analyze-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        this.hide();
        if (this.onConfirmCallback) {
          this.onConfirmCallback();
        }
      });
    }

    this.element.style.display = 'flex';
  }

  public hide(): void {
    this.element.style.display = 'none';
  }

  public dispose(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
