import type { DialogueLine } from '../game/contracts';

export class DialoguePanel {
  private container: HTMLElement;
  private currentLines: DialogueLine[] = [];
  private currentIndex = 0;
  private onCompleteCallback: (() => void) | null = null;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'dialogue-overlay hidden';
    this.container.id = 'dialogue-panel';
    parent.appendChild(this.container);
  }

  public show(lines: DialogueLine[], onComplete?: () => void): void {
    this.currentLines = lines;
    this.currentIndex = 0;
    this.onCompleteCallback = onComplete || null;
    this.container.classList.remove('hidden');
    this.renderCurrentLine();
  }

  public hide(): void {
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }

  public isVisible(): boolean {
    return !this.container.classList.contains('hidden');
  }

  private advance(): void {
    this.currentIndex++;
    if (this.currentIndex < this.currentLines.length) {
      this.renderCurrentLine();
    } else {
      this.hide();
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    }
  }

  private renderCurrentLine(): void {
    const line = this.currentLines[this.currentIndex];
    if (!line) return;

    let speakerName = 'Nayla';
    let avatarClass = 'speaker-nayla';
    let speakerBadge = 'Exploradora';

    if (line.speaker === 'bip') {
      speakerName = 'Bip';
      avatarClass = 'speaker-bip';
      speakerBadge = 'Assistente de Voo';
    } else if (line.speaker === 'opportunity') {
      speakerName = 'Opportunity (MER-B)';
      avatarClass = 'speaker-opportunity';
      speakerBadge = 'Memória Histórica Ficcionada';
    } else if (line.speaker === 'narrador') {
      speakerName = 'Arquivo de Memórias';
      avatarClass = 'speaker-system';
      speakerBadge = 'Registo Oficial';
    }

    const memoryNotice = line.isMemory
      ? `<div class="memory-tag" id="dialogue-memory-tag">★ Memória do Passado — Registos de 2004 a 2018 (Ficção Narrativa Baseada em Factos)</div>`
      : '';

    this.container.innerHTML = `
      <div class="dialogue-box">
        ${memoryNotice}
        <div class="dialogue-header">
          <div class="speaker-avatar ${avatarClass}"></div>
          <div class="speaker-meta">
            <span class="speaker-name">${speakerName}</span>
            <span class="speaker-badge">${speakerBadge}</span>
          </div>
          <div class="dialogue-counter">${this.currentIndex + 1}/${this.currentLines.length}</div>
        </div>
        <div class="dialogue-content" id="dialogue-text">
          "${line.text}"
        </div>
        <div class="dialogue-footer">
          <span class="dialogue-hint">Pressiona [Espaço] ou clica para avançar</span>
          <button class="btn btn-primary" id="btn-dialogue-next">
            ${this.currentIndex === this.currentLines.length - 1 ? 'Concluir Conversa' : 'Continuar →'}
          </button>
        </div>
      </div>
    `;

    const nextBtn = this.container.querySelector('#btn-dialogue-next') as HTMLButtonElement;
    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.stopPropagation();
        this.advance();
      };
    }

    this.container.onclick = () => {
      this.advance();
    };
  }
}
