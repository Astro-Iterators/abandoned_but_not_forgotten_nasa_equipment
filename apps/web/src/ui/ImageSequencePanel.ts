import { CLUE_C_FRAMES, type ImageCard } from '../director/ClueController';

export class ImageSequencePanel {
  private element: HTMLElement;
  private cardEl: HTMLElement;
  private currentOrder: ImageCard[] = [];
  private onConfirmCallback?: () => void;
  private feedbackEl!: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'interaction-overlay';
    this.element.style.display = 'none';

    this.cardEl = document.createElement('div');
    this.cardEl.className = 'interaction-card sequence-card';
    this.element.appendChild(this.cardEl);

    container.appendChild(this.element);
  }

  public show(onConfirm: () => void): void {
    this.onConfirmCallback = onConfirm;

    // Start with shuffled order so player has a meaningful interaction
    this.currentOrder = [CLUE_C_FRAMES[1], CLUE_C_FRAMES[2], CLUE_C_FRAMES[0]];

    this.render();
    this.element.style.display = 'flex';
  }

  private render(): void {
    this.cardEl.innerHTML = `
      <div class="card-badge">ARQUIVO DE IMAGEM • SEQUÊNCIA</div>
      <h2 class="card-title">Ordenar Aproximação Lunar</h2>
      <p class="card-desc">
        A Ranger 7 enviou transmissões contínuas durante a queda. 
        Organiza os 3 fotogramas <strong>do mais distante (maior altitude) para o mais próximo (menor altitude)</strong>.
      </p>

      <div class="sequence-list" id="sequence-list"></div>

      <div id="sequence-feedback" class="sequence-feedback" style="display: none;"></div>

      <div class="card-actions">
        <button id="btn-sequence-confirm" class="touch-btn primary-touch-btn wide-btn" aria-label="Confirmar ordem dos fotogramas">
          <span class="icon">✓</span>
          <span class="btn-label">Confirmar Sequência</span>
        </button>
      </div>
      <p class="touch-hint">Usa as setas ▲ e ▼ para ajustar a posição de cada fotograma no ecrã táctil.</p>
    `;

    const listContainer = this.cardEl.querySelector('#sequence-list')!;
    this.feedbackEl = this.cardEl.querySelector('#sequence-feedback') as HTMLElement;

    this.currentOrder.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'sequence-item-row';
      row.innerHTML = `
        <span class="seq-index-badge">${index + 1}º</span>
        <div class="seq-item-info">
          <span class="seq-item-title">${item.title}</span>
          <span class="seq-item-alt">Altitude aprox.: ~${item.altitudeKm} km</span>
          <span class="seq-item-desc">${item.description}</span>
        </div>
        <div class="seq-item-buttons">
          <button class="touch-btn mini-btn btn-up" data-idx="${index}" aria-label="Mover para cima" ${index === 0 ? 'disabled' : ''}>▲</button>
          <button class="touch-btn mini-btn btn-down" data-idx="${index}" aria-label="Mover para baixo" ${index === this.currentOrder.length - 1 ? 'disabled' : ''}>▼</button>
        </div>
      `;

      const upBtn = row.querySelector('.btn-up');
      if (upBtn) {
        upBtn.addEventListener('click', () => this.moveItem(index, -1));
      }

      const downBtn = row.querySelector('.btn-down');
      if (downBtn) {
        downBtn.addEventListener('click', () => this.moveItem(index, 1));
      }

      listContainer.appendChild(row);
    });

    const confirmBtn = this.cardEl.querySelector('#btn-sequence-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.handleConfirm());
    }
  }

  private moveItem(index: number, direction: number): void {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= this.currentOrder.length) return;

    const temp = this.currentOrder[index];
    this.currentOrder[index] = this.currentOrder[targetIdx];
    this.currentOrder[targetIdx] = temp;

    this.render();
  }

  private handleConfirm(): void {
    const selectedIds = this.currentOrder.map((f) => f.id);
    const correctOrder = ['frame-distant', 'frame-mid', 'frame-close'];
    const isCorrect = selectedIds.every((id, idx) => id === correctOrder[idx]);

    this.feedbackEl.style.display = 'block';

    if (isCorrect) {
      this.feedbackEl.className = 'sequence-feedback success';
      this.feedbackEl.innerHTML = '<strong>Ordem Correcta!</strong> As fotografias mostram a aproximação contínua até à superfície.';

      setTimeout(() => {
        this.hide();
        if (this.onConfirmCallback) {
          this.onConfirmCallback();
        }
      }, 1200);
    } else {
      this.feedbackEl.className = 'sequence-feedback error';
      this.feedbackEl.innerHTML = '<strong>Dica do Arquivo:</strong> Coloca primeiro a foto com altitude maior (~2100 km), depois a média (~470 km), e por fim a mais baixa (~3.5 km).';
    }
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
