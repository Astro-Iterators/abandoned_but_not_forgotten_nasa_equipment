import type { EpisodeContent, CinematicAct, DialogueLine } from '../game/contracts';
import { AudioManager } from '../game/systems/AudioManager';

export interface CinematicPlayerCallbacks {
  onActChange: (act: CinematicAct) => void;
  onExploreStart: () => void;
  onVideoStart: () => void;
  onPuzzleStart: () => void;
  onJournalStart: () => void;
  onReset: () => void;
}

export class CinematicPlayerUI {
  private container: HTMLElement;
  private content: EpisodeContent;
  private audioManager: AudioManager;
  private callbacks: CinematicPlayerCallbacks;

  private currentActIndex = 0;
  private currentLineIndex = 0;
  private isAutoPlaying = true;
  private autoPlayTimer: number | null = null;
  private scannerCompleted = false;

  constructor(parent: HTMLElement, content: EpisodeContent, audioManager: AudioManager, callbacks: CinematicPlayerCallbacks) {
    this.content = content;
    this.audioManager = audioManager;
    this.callbacks = callbacks;

    this.container = document.createElement('div');
    this.container.id = 'cinematic-director-container';
    this.container.className = 'cinematic-director-container';
    parent.appendChild(this.container);

    this.render();
  }

  public getCurrentAct(): CinematicAct {
    return this.content.acts[this.currentActIndex];
  }

  public setActIndex(index: number): void {
    if (index >= 0 && index < this.content.acts.length) {
      this.currentActIndex = index;
      this.currentLineIndex = 0;
      this.stopAutoPlay();
      this.render();
      this.callbacks.onActChange(this.getCurrentAct());
    }
  }

  public nextAct(): void {
    if (this.currentActIndex < this.content.acts.length - 1) {
      this.setActIndex(this.currentActIndex + 1);
    }
  }

  public previousAct(): void {
    if (this.currentActIndex > 0) {
      this.setActIndex(this.currentActIndex - 1);
    }
  }

  public togglePlayPause(): void {
    this.isAutoPlaying = !this.isAutoPlaying;
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
    this.updateControls();
  }

  public advanceLine(): void {
    const act = this.getCurrentAct();
    const lines = act.narrationLines || [];
    if (this.currentLineIndex < lines.length - 1) {
      this.currentLineIndex++;
      this.audioManager.playCue('bip');
      this.renderDialogueSection();
    } else {
      // Act narration finished
      if (act.type === 'interactive_exploration') {
        this.callbacks.onExploreStart();
      } else if (act.type === 'cinematic_video') {
        this.callbacks.onVideoStart();
      } else if (act.type === 'interactive_journal') {
        this.callbacks.onPuzzleStart();
      } else if (act.type === 'cinematic_epilogue') {
        this.callbacks.onJournalStart();
      } else if (!act.isInteractive) {
        this.nextAct();
      }
    }
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.autoPlayTimer = window.setTimeout(() => {
      if (this.isAutoPlaying) {
        this.advanceLine();
        this.startAutoPlay();
      }
    }, 4500);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer !== null) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  public render(): void {
    const act = this.getCurrentAct();
    const isActInteractive = act.isInteractive;

    this.container.innerHTML = `
      <!-- Top Cinematic Timeline (Inspired by A Solar Tale) -->
      <nav class="cinema-timeline" aria-label="Navegação em Capítulos">
        <div class="timeline-title-row">
          <span class="film-badge">Ainda Estou Aqui: Filme Educativo</span>
          <span class="act-counter">Capítulo ${act.index + 1} de ${this.content.acts.length}</span>
        </div>
        <div class="timeline-stepper">
          ${this.content.acts
            .map(
              (a, idx) => `
            <button class="step-btn ${idx === this.currentActIndex ? 'step-active' : ''} ${idx < this.currentActIndex ? 'step-done' : ''}" data-act-idx="${idx}" title="${a.title}">
              <span class="step-dot"></span>
              <span class="step-text">${a.title.split(':')[0]}</span>
            </button>
          `
            )
            .join('<div class="step-line"></div>')}
        </div>
      </nav>

      <!-- Center Cinematic Stage -->
      <main class="cinema-stage ${act.type}">
        ${this.renderActStageContent(act)}
      </main>

      <!-- Bottom Film Director Controls -->
      <footer class="cinema-controls-bar">
        <div class="controls-left">
          <button class="btn btn-cinema" id="btn-cinema-prev" ${this.currentActIndex === 0 ? 'disabled' : ''}>
            ⏮ Anterior
          </button>
          <button class="btn btn-cinema" id="btn-cinema-playpause">
            ${this.isAutoPlaying ? '⏸ Pausar Filme' : '▶ Reproduzir Filme'}
          </button>
          <button class="btn btn-cinema" id="btn-cinema-next" ${this.currentActIndex === this.content.acts.length - 1 ? 'disabled' : ''}>
            Seguinte ⏭
          </button>
        </div>

        <div class="controls-center">
          ${
            isActInteractive
              ? `<span class="mode-pill mode-interactive">🎮 O TEU TURNO: ${act.interactiveGoal || 'Interage'}</span>`
              : `<span class="mode-pill mode-cinema">🎬 MODO CINEMA: Assiste à narrativa</span>`
          }
        </div>

        <div class="controls-right">
          <button class="btn btn-cinema" id="btn-cinema-sound">
            ${this.audioManager.isMuted() ? '🔇 Sem Som' : '🔊 Som'}
          </button>
          <button class="btn btn-cinema btn-highlight" id="btn-cinema-journal">
            📖 Ficha & Fontes
          </button>
        </div>
      </footer>
    `;

    this.bindEvents();
    if (this.isAutoPlaying && !act.isInteractive) {
      this.startAutoPlay();
    }
  }

  private renderActStageContent(act: CinematicAct): string {
    if (act.type === 'interactive_exploration') {
      return `
        <div class="game-view-wrapper">
          <div class="interactive-banner">
            <h3>🎮 Exploração Guiada: Os Primeiros Passos em Marte</h3>
            <p>${act.interactiveGoal}</p>
          </div>
          <!-- Game container is visible underneath -->
        </div>
      `;
    }

    if (act.type === 'interactive_scanner') {
      return `
        <div class="macro-scanner-card">
          <div class="scanner-image-container">
            <img src="${act.imageSrc}" alt="Pormenor das esférulas de hematite" class="macro-image" />
            <div class="scanner-beam ${this.scannerCompleted ? 'beam-finished' : 'beam-active'}"></div>
          </div>
          <div class="scanner-data-panel">
            <div class="scanner-header">
              <span class="badge-blue">Instrumento APXS & Microscopic Imager</span>
              <h2>Leitura Espectroscópica da Rocha</h2>
            </div>
            <div class="scanner-readout ${this.scannerCompleted ? 'readout-active' : ''}" id="scanner-readout">
              <div class="readout-row">
                <span>Composição Mineral:</span>
                <strong>Hematite ($Fe_2O_3$) em Esférulas Concrecionárias</strong>
              </div>
              <div class="readout-row">
                <span>Ambiente Geológico:</span>
                <strong>Sedimentação aquosa com sais de sulfato (Jarosite)</strong>
              </div>
              <div class="readout-row">
                <span>Dedução Científica:</span>
                <strong class="color-success">Evidência comprovada de água líquida no passado antigo!</strong>
              </div>
            </div>
            <div class="scanner-actions">
              <button class="btn btn-primary btn-large" id="btn-trigger-scan">
                ${this.scannerCompleted ? '✓ Scanner Concluído' : '⚡ Ativar Scanner Espectroscópico de Bip'}
              </button>
              ${
                this.scannerCompleted
                  ? `<button class="btn btn-success btn-large" id="btn-scan-continue">Continuar para o Próximo Capítulo ➔</button>`
                  : ''
              }
            </div>
          </div>
        </div>
      `;
    }

    if (act.type === 'cinematic_video') {
      return `
        <div class="cinema-video-presentation">
          <div class="video-card-widescreen">
            <div class="video-overlay-title">Ato III: 5.111 Sóis de Descoberta — Memória Real da NASA</div>
            <button class="btn btn-primary btn-large" id="btn-launch-video-presentation">
              ▶ Assistir à Memória Histórica da NASA (Vídeo & Legendas)
            </button>
          </div>
        </div>
      `;
    }

    // Default Cinematic Story acts (Prologue, Storm, Epilogue)
    return `
      <div class="cinema-narrative-card">
        ${act.imageSrc ? `<div class="cinema-art-frame"><img src="${act.imageSrc}" alt="${act.title}" class="cinema-art-img" /></div>` : ''}
        <div class="cinema-dialogue-area" id="cinema-dialogue-area">
          ${this.getDialogueHtml()}
        </div>
      </div>
    `;
  }

  private getDialogueHtml(): string {
    const act = this.getCurrentAct();
    const lines = act.narrationLines || [];
    const line = lines[this.currentLineIndex];
    if (!line) return '';

    let speakerName = 'Nayla';
    let avatarClass = 'speaker-nayla';
    let badge = 'Exploradora';

    if (line.speaker === 'bip') {
      speakerName = 'Bip';
      avatarClass = 'speaker-bip';
      badge = 'Assistente de Voo';
    } else if (line.speaker === 'opportunity') {
      speakerName = 'Opportunity (MER-B)';
      avatarClass = 'speaker-opportunity';
      badge = 'Memória Ficcionada de Arquivo';
    } else if (line.speaker === 'narrador') {
      speakerName = 'Arquivo de Memórias';
      avatarClass = 'speaker-system';
      badge = 'Registo Histórico';
    }

    return `
      <div class="cinema-subtitle-box">
        <div class="subtitle-speaker-info">
          <div class="speaker-avatar ${avatarClass}"></div>
          <div class="speaker-label">
            <span class="speaker-title">${speakerName}</span>
            <span class="speaker-role">${badge}</span>
          </div>
          <span class="line-progress">${this.currentLineIndex + 1} / ${lines.length}</span>
        </div>
        <div class="subtitle-body">
          <p class="subtitle-quote">"${line.text}"</p>
        </div>
        <div class="subtitle-prompt">
          <button class="btn btn-primary btn-sm" id="btn-subtitle-advance">
            ${this.currentLineIndex === lines.length - 1 ? 'Prosseguir Capítulo →' : 'Continuar →'}
          </button>
        </div>
      </div>
    `;
  }

  private renderDialogueSection(): void {
    const el = this.container.querySelector('#cinema-dialogue-area');
    if (el) {
      el.innerHTML = this.getDialogueHtml();
      const advanceBtn = el.querySelector('#btn-subtitle-advance') as HTMLButtonElement;
      if (advanceBtn) {
        advanceBtn.onclick = () => this.advanceLine();
      }
    }
  }

  private updateControls(): void {
    const playPauseBtn = this.container.querySelector('#btn-cinema-playpause');
    if (playPauseBtn) {
      playPauseBtn.textContent = this.isAutoPlaying ? '⏸ Pausar Filme' : '▶ Reproduzir Filme';
    }
  }

  private bindEvents(): void {
    // Stepper buttons
    const stepBtns = this.container.querySelectorAll<HTMLButtonElement>('.step-btn');
    stepBtns.forEach((btn) => {
      btn.onclick = () => {
        const idx = Number(btn.getAttribute('data-act-idx'));
        this.setActIndex(idx);
      };
    });

    // Control buttons
    const prevBtn = this.container.querySelector('#btn-cinema-prev') as HTMLButtonElement;
    if (prevBtn) prevBtn.onclick = () => this.previousAct();

    const nextBtn = this.container.querySelector('#btn-cinema-next') as HTMLButtonElement;
    if (nextBtn) nextBtn.onclick = () => this.nextAct();

    const playPauseBtn = this.container.querySelector('#btn-cinema-playpause') as HTMLButtonElement;
    if (playPauseBtn) playPauseBtn.onclick = () => this.togglePlayPause();

    const soundBtn = this.container.querySelector('#btn-cinema-sound') as HTMLButtonElement;
    if (soundBtn) {
      soundBtn.onclick = () => {
        const muted = this.audioManager.toggleMute();
        soundBtn.textContent = muted ? '🔇 Sem Som' : '🔊 Som';
      };
    }

    const journalBtn = this.container.querySelector('#btn-cinema-journal') as HTMLButtonElement;
    if (journalBtn) {
      journalBtn.onclick = () => this.callbacks.onJournalStart();
    }

    const advanceBtn = this.container.querySelector('#btn-subtitle-advance') as HTMLButtonElement;
    if (advanceBtn) {
      advanceBtn.onclick = () => this.advanceLine();
    }

    // Interactive scanner buttons
    const triggerScanBtn = this.container.querySelector('#btn-trigger-scan') as HTMLButtonElement;
    if (triggerScanBtn) {
      triggerScanBtn.onclick = () => {
        this.scannerCompleted = true;
        this.audioManager.playCue('clue');
        this.render();
      };
    }

    const scanContinueBtn = this.container.querySelector('#btn-scan-continue') as HTMLButtonElement;
    if (scanContinueBtn) {
      scanContinueBtn.onclick = () => {
        this.nextAct();
      };
    }

    // Video launcher button
    const launchVideoBtn = this.container.querySelector('#btn-launch-video-presentation') as HTMLButtonElement;
    if (launchVideoBtn) {
      launchVideoBtn.onclick = () => {
        this.callbacks.onVideoStart();
      };
    }
  }
}
