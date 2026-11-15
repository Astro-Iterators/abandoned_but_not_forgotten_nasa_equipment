export interface ReportPanelCallbacks {
  onVerdictCompleted: () => void;
  onReplayEpisode: () => void;
  onOpenSources: () => void;
}

export class ReportPanel {
  private element: HTMLElement;
  private cardEl: HTMLElement;
  private callbacks: ReportPanelCallbacks;

  constructor(container: HTMLElement, callbacks: ReportPanelCallbacks) {
    this.callbacks = callbacks;

    this.element = document.createElement('div');
    this.element.className = 'interaction-overlay';
    this.element.style.display = 'none';

    this.cardEl = document.createElement('div');
    this.cardEl.className = 'interaction-card report-card';
    this.element.appendChild(this.cardEl);

    container.appendChild(this.element);
  }

  public showVerdictQuestion(): void {
    this.cardEl.innerHTML = `
      <div class="card-badge">RELATÓRIO DO ARQUIVO • CONCLUSÃO</div>
      <h2 class="card-title">Qual é o estado final da Ranger 7?</h2>
      <p class="card-desc">
        Bip prepara-se para registar a missão no Arquivo. Com base nos vestígios e fotografias analisados, qual foi o verdadeiro propósito da nave?
      </p>

      <div class="verdict-options">
        <button id="verdict-opt-wrong" class="touch-btn verdict-btn" aria-label="Opção: Falha de motor e colisão acidental">
          <span class="opt-indicator">A</span>
          <span class="opt-label">Falha mecânica: A nave perdeu o controlo e caiu acidentalmente na Lua.</span>
        </button>

        <button id="verdict-opt-correct" class="touch-btn verdict-btn" aria-label="Opção: Fotografia e impacto lunar planeado">
          <span class="opt-indicator">B</span>
          <span class="opt-label">Missão cumprida: Fotografia de aproximação e impacto lunar planeado.</span>
        </button>
      </div>

      <div id="verdict-feedback" class="verdict-feedback" style="display: none;"></div>
      <p class="touch-hint">Selecciona a resposta que melhor sintetiza a história preservada.</p>
    `;

    const wrongBtn = this.cardEl.querySelector('#verdict-opt-wrong');
    const correctBtn = this.cardEl.querySelector('#verdict-opt-correct');
    const feedback = this.cardEl.querySelector('#verdict-feedback') as HTMLElement;

    if (wrongBtn) {
      wrongBtn.addEventListener('click', () => {
        feedback.style.display = 'block';
        feedback.className = 'verdict-feedback error';
        feedback.innerHTML = '<strong>Não foi um acidente:</strong> A Ranger 7 nunca teve retrofoguetes nem a intenção de pousar suavemente. O embate foi concebido desde o primeiro dia para transmitir até ao último instante.';
      });
    }

    if (correctBtn) {
      correctBtn.addEventListener('click', () => {
        feedback.style.display = 'block';
        feedback.className = 'verdict-feedback success';
        feedback.innerHTML = '<strong>Exacto!</strong> A missão foi um triunfo histórico. As suas mais de quatro mil imagens comprovaram a segurança do solo para o futuro programa Apollo.';

        setTimeout(() => {
          this.hide();
          this.callbacks.onVerdictCompleted();
        }, 1500);
      });
    }

    this.element.style.display = 'flex';
  }

  public showFinalEpisodeCard(): void {
    this.cardEl.innerHTML = `
      <div class="card-badge success-badge">EPISÓDIO 1 CONCLUÍDO</div>
      <h2 class="card-title">Ranger 7 — O último olhar</h2>
      
      <div class="report-summary-box">
        <div class="summary-line">
          <strong>Sonda Histórica:</strong> Ranger 7 (NASA / JPL, 1964)
        </div>
        <div class="summary-line">
          <strong>Localização:</strong> Mare Cognitum, Lua
        </div>
        <div class="summary-line">
          <strong>Legado Preservado:</strong> 4.308 imagens lunares transmitidas com sucesso antes do impacto.
        </div>
        <div class="summary-quote">
          «Não voltas comigo. Mas a tua história volta.» — Bip
        </div>
      </div>

      <div class="teaser-card">
        <span class="teaser-tag">GANCHO HISTÓRICO • PRÓXIMO EPISÓDIO</span>
        <h3 class="teaser-title">Mariner 4 — O planeta que não conhecíamos</h3>
        <p class="teaser-desc">
          O primeiro sobrevoo bem-sucedido de Marte (1965).
        </p>
        <span class="teaser-note">Nota: Este episódio piloto abrange apenas a Ranger 7. O episódio 2 é apenas um gancho e não está implementado.</span>
      </div>

      <div class="card-actions">
        <button id="btn-replay-ep" class="touch-btn primary-touch-btn" aria-label="Rever este episódio desde o início">
          <span class="icon">↺</span>
          <span class="btn-label">Rever Episódio</span>
        </button>
        <button id="btn-sources-ep" class="touch-btn secondary-touch-btn" aria-label="Consultar fontes históricas da NASA">
          <span class="icon">ℹ</span>
          <span class="btn-label">Fontes Oficiais</span>
        </button>
      </div>
    `;

    const replayBtn = this.cardEl.querySelector('#btn-replay-ep');
    const sourcesBtn = this.cardEl.querySelector('#btn-sources-ep');

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.hide();
        this.callbacks.onReplayEpisode();
      });
    }

    if (sourcesBtn) {
      sourcesBtn.addEventListener('click', () => {
        this.callbacks.onOpenSources();
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
