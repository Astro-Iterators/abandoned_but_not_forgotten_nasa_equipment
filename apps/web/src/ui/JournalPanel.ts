import type { EpisodeContent } from '../game/contracts';

export class JournalPanel {
  private container: HTMLElement;
  private content: EpisodeContent;
  private onCloseCallback: (() => void) | null = null;
  private onReplayVideoCallback: (() => void) | null = null;
  private onResetCallback: (() => void) | null = null;

  constructor(parent: HTMLElement, content: EpisodeContent) {
    this.content = content;
    this.container = document.createElement('div');
    this.container.className = 'journal-overlay hidden';
    this.container.id = 'journal-panel';
    parent.appendChild(this.container);
  }

  public show(callbacks?: {
    onClose?: () => void;
    onReplayVideo?: () => void;
    onReset?: () => void;
  }): void {
    if (callbacks) {
      this.onCloseCallback = callbacks.onClose || null;
      this.onReplayVideoCallback = callbacks.onReplayVideo || null;
      this.onResetCallback = callbacks.onReset || null;
    }
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

  private render(): void {
    const sheet = this.content.missionSheet;

    const factsHtml = sheet.facts
      .map(
        (f) => `
        <div class="fact-card">
          <div class="fact-label">${f.label}</div>
          <div class="fact-value">${f.value}</div>
          <div class="fact-source">Fonte: ${f.sourceNote}</div>
        </div>
      `
      )
      .join('');

    const sourcesHtml = sheet.sources
      .map(
        (s) => `
        <div class="source-item">
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="source-link">
            🔗 ${s.title} (${s.organization})
          </a>
          <p class="source-desc">${s.description}</p>
        </div>
      `
      )
      .join('');

    this.container.innerHTML = `
      <div class="journal-card">
        <div class="journal-header">
          <div class="journal-badge">Caderno de Bordo de Nayla & Bip</div>
          <h2 class="journal-title">${sheet.title}</h2>
          <p class="journal-subtitle">Arquivo Oficial de Memórias Espaciais — Desafio NASA Space Apps</p>
        </div>

        <div class="journal-body">
          <div class="journal-stats-grid">
            <div class="stat-box">
              <span class="stat-number">45,16 km</span>
              <span class="stat-label">Distância Percorrida em Marte</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">5.111 Sóis</span>
              <span class="stat-label">Dias Marcianos de Operação</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">217.000+</span>
              <span class="stat-label">Imagens Científicas Enviadas</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">90 Sóis</span>
              <span class="stat-label">Duração Original Prevista</span>
            </div>
          </div>

          <div class="journal-section">
            <h3>Factos Científicos Verificados</h3>
            <div class="facts-list">
              ${factsHtml}
            </div>
          </div>

          <div class="journal-section">
            <h3>Fontes Oficiais Consultadas (NASA & JPL)</h3>
            <div class="sources-list">
              ${sourcesHtml}
            </div>
          </div>
        </div>

        <div class="journal-footer">
          <div class="journal-actions-left">
            <button class="btn btn-secondary" id="btn-journal-replay-video">🎬 Rever Vídeo da Memória</button>
            <button class="btn btn-outline-danger" id="btn-journal-reset">Reiniciar Episódio</button>
          </div>
          <button class="btn btn-primary" id="btn-journal-close">Fechar Caderno</button>
        </div>
      </div>
    `;

    const closeBtn = this.container.querySelector('#btn-journal-close') as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.hide();
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
      };
    }

    const replayBtn = this.container.querySelector('#btn-journal-replay-video') as HTMLButtonElement;
    if (replayBtn) {
      replayBtn.onclick = () => {
        this.hide();
        if (this.onReplayVideoCallback) {
          this.onReplayVideoCallback();
        }
      };
    }

    const resetBtn = this.container.querySelector('#btn-journal-reset') as HTMLButtonElement;
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm('Tens a certeza que queres reiniciar o progresso deste episódio?')) {
          this.hide();
          if (this.onResetCallback) {
            this.onResetCallback();
          }
        }
      };
    }
  }
}
