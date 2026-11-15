import type { SaveStateData } from '../game/contracts';

export class SettingsPanel {
  private container: HTMLElement;
  private onCloseCallback: (() => void) | null = null;
  private onMuteToggleCallback: (() => void) | null = null;
  private onResetCallback: (() => void) | null = null;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'settings-overlay hidden';
    this.container.id = 'settings-panel';
    parent.appendChild(this.container);
  }

  public show(
    state: SaveStateData,
    callbacks: {
      onClose: () => void;
      onMuteToggle: () => void;
      onReset: () => void;
    }
  ): void {
    this.onCloseCallback = callbacks.onClose;
    this.onMuteToggleCallback = callbacks.onMuteToggle;
    this.onResetCallback = callbacks.onReset;
    this.container.classList.remove('hidden');
    this.render(state);
  }

  public hide(): void {
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }

  public isVisible(): boolean {
    return !this.container.classList.contains('hidden');
  }

  private render(state: SaveStateData): void {
    this.container.innerHTML = `
      <div class="settings-card">
        <div class="settings-header">
          <h2>Instruções e Opções</h2>
          <button class="btn-close" id="btn-settings-close-x">✕</button>
        </div>

        <div class="settings-body">
          <div class="settings-group">
            <h3>🎮 Controlos de Exploração</h3>
            <ul>
              <li><strong>Mover Nayla:</strong> Teclas de Cursor (↑ ↓ ← →) ou W, A, S, D</li>
              <li><strong>Examinar / Interagir:</strong> Tecla <code>[E]</code>, <code>[Espaço]</code> ou botão no ecrã</li>
              <li><strong>Avançar Diálogos:</strong> Clique com o rato ou Tecla <code>[Espaço]</code></li>
            </ul>
          </div>

          <div class="settings-group">
            <h3>🔊 Definições de Áudio</h3>
            <div class="setting-row">
              <span>Sons e Atmosfera:</span>
              <button class="btn ${state.audioMuted ? 'btn-secondary' : 'btn-success'}" id="btn-settings-mute">
                ${state.audioMuted ? '🔇 Desativado (Sem Som)' : '🔊 Ativado'}
              </button>
            </div>
            <p class="settings-note">Nenhum som é obrigatório para resolver o enigma ou concluir a história.</p>
          </div>

          <div class="settings-group">
            <h3>📋 Estado da Missão Atual</h3>
            <div class="status-checklist">
              <div>${state.clueDiscovered ? '✅' : '⏳'} Pista de Hematite examinada</div>
              <div>${state.roverContacted ? '✅' : '⏳'} Memória do Opportunity ouvida</div>
              <div>${state.cinematicViewed ? '✅' : '⏳'} Vídeo da NASA transmitido</div>
              <div>${state.puzzleSolved ? '✅' : '⏳'} Enigma de água vs vida resolvido</div>
              <div>${state.episodeCompleted ? '🏆' : '⏳'} Episódio Piloto Concluído</div>
            </div>
          </div>
        </div>

        <div class="settings-footer">
          <button class="btn btn-outline-danger" id="btn-settings-reset">Reiniciar Progresso</button>
          <button class="btn btn-primary" id="btn-settings-done">Continuar a Jogar</button>
        </div>
      </div>
    `;

    const closeBtnX = this.container.querySelector('#btn-settings-close-x') as HTMLButtonElement;
    if (closeBtnX) {
      closeBtnX.onclick = () => {
        this.hide();
        if (this.onCloseCallback) this.onCloseCallback();
      };
    }

    const doneBtn = this.container.querySelector('#btn-settings-done') as HTMLButtonElement;
    if (doneBtn) {
      doneBtn.onclick = () => {
        this.hide();
        if (this.onCloseCallback) this.onCloseCallback();
      };
    }

    const muteBtn = this.container.querySelector('#btn-settings-mute') as HTMLButtonElement;
    if (muteBtn) {
      muteBtn.onclick = () => {
        if (this.onMuteToggleCallback) this.onMuteToggleCallback();
      };
    }

    const resetBtn = this.container.querySelector('#btn-settings-reset') as HTMLButtonElement;
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm('Desejas apagar o progresso local e reiniciar o piloto?')) {
          this.hide();
          if (this.onResetCallback) this.onResetCallback();
        }
      };
    }
  }
}
