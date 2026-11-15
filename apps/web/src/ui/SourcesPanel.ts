import { EPISODE_SOURCES, EDITORIAL_DISCLAIMER } from '../episode/sources';

export class SourcesPanel {
  private element: HTMLElement;
  private cardEl: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'interaction-overlay sources-overlay';
    this.element.style.display = 'none';

    this.cardEl = document.createElement('div');
    this.cardEl.className = 'interaction-card sources-card';
    this.element.appendChild(this.cardEl);

    container.appendChild(this.element);
  }

  public show(): void {
    const sourcesHtml = EPISODE_SOURCES.map(
      (s) => `
      <div class="source-item">
        <h3 class="source-title">
          <a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ↗</a>
        </h3>
        <p class="source-note">${s.note}</p>
      </div>
    `
    ).join('');

    this.cardEl.innerHTML = `
      <div class="sources-header">
        <div class="card-badge">RIGOR & REFERÊNCIAS</div>
        <button id="btn-sources-close" class="touch-btn mini-btn close-btn" aria-label="Fechar painel de fontes">✕</button>
      </div>

      <h2 class="card-title">Fontes Científicas e Créditos</h2>

      <div class="sources-disclaimer">
        <strong>Aviso Editorial:</strong>
        <p>${EDITORIAL_DISCLAIMER}</p>
      </div>

      <div class="sources-list">
        ${sourcesHtml}
      </div>

      <div class="card-actions">
        <button id="btn-sources-done" class="touch-btn primary-touch-btn wide-btn" aria-label="Fechar e regressar ao episódio">
          <span class="btn-label">Regressar ao Episódio</span>
        </button>
      </div>
    `;

    const closeBtn = this.cardEl.querySelector('#btn-sources-close');
    const doneBtn = this.cardEl.querySelector('#btn-sources-done');

    const handleClose = () => this.hide();
    if (closeBtn) closeBtn.addEventListener('click', handleClose);
    if (doneBtn) doneBtn.addEventListener('click', handleClose);

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
