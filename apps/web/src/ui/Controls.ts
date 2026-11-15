import type { EpisodeMode, Shot } from '../director/types';

export interface ControlsCallbacks {
  onTogglePlay: () => void;
  onReplay: () => void;
  onSkip: () => void;
  onToggleMute: () => void;
  onToggleSubtitles: () => void;
  onOpenSources: () => void;
}

export class Controls {
  private element: HTMLElement;
  private playBtn: HTMLButtonElement;
  private muteBtn: HTMLButtonElement;
  private subBtn: HTMLButtonElement;
  private progressBar: HTMLElement;
  private progressFill: HTMLElement;
  private timeLabel: HTMLElement;
  private shotLabel: HTMLElement;

  private isMuted: boolean = false;
  private isSubtitlesOn: boolean = true;
  private callbacks: ControlsCallbacks;

  constructor(container: HTMLElement, callbacks: ControlsCallbacks) {
    this.callbacks = callbacks;

    this.element = document.createElement('div');
    this.element.className = 'cinematic-controls';

    // 1. Top Bar (Mobile-friendly header with safe areas)
    const topBar = document.createElement('header');
    topBar.className = 'controls-top-bar';

    const titleArea = document.createElement('div');
    titleArea.className = 'controls-title-area';
    titleArea.innerHTML = `
      <span class="series-tag">V3 • CINEMÁTICO 3D</span>
      <h1 class="episode-title">Ranger 7 — O último olhar</h1>
    `;

    const topActions = document.createElement('div');
    topActions.className = 'controls-top-actions';

    this.subBtn = document.createElement('button');
    this.subBtn.className = 'touch-btn icon-btn active';
    this.subBtn.setAttribute('aria-label', 'Activar ou desactivar legendas');
    this.subBtn.innerHTML = '<span class="icon">CC</span><span class="btn-text">Legendas</span>';
    this.subBtn.addEventListener('click', () => this.handleSubtitlesClick());

    this.muteBtn = document.createElement('button');
    this.muteBtn.className = 'touch-btn icon-btn';
    this.muteBtn.setAttribute('aria-label', 'Ligar ou desligar som');
    this.muteBtn.innerHTML = '<span class="icon">🔊</span><span class="btn-text">Som</span>';
    this.muteBtn.addEventListener('click', () => this.handleMuteClick());

    const sourcesBtn = document.createElement('button');
    sourcesBtn.className = 'touch-btn icon-btn';
    sourcesBtn.setAttribute('aria-label', 'Consultar fontes científicas e referências');
    sourcesBtn.innerHTML = '<span class="icon">ℹ</span><span class="btn-text">Fontes</span>';
    sourcesBtn.addEventListener('click', () => this.callbacks.onOpenSources());

    topActions.appendChild(this.subBtn);
    topActions.appendChild(this.muteBtn);
    topActions.appendChild(sourcesBtn);

    topBar.appendChild(titleArea);
    topBar.appendChild(topActions);
    this.element.appendChild(topBar);

    // 2. Bottom Mobile Bar (Play/Pause, Progress, Scene Navigation)
    const bottomBar = document.createElement('footer');
    bottomBar.className = 'controls-bottom-bar';

    // Timeline Progress Bar
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'controls-progress-track';
    this.progressFill = document.createElement('div');
    this.progressFill.className = 'controls-progress-fill';
    this.progressBar.appendChild(this.progressFill);
    bottomBar.appendChild(this.progressBar);

    const bottomControls = document.createElement('div');
    bottomControls.className = 'controls-bottom-row';

    // Status Indicator
    const statusCol = document.createElement('div');
    statusCol.className = 'controls-status-col';
    this.shotLabel = document.createElement('span');
    this.shotLabel.className = 'shot-badge';
    this.shotLabel.textContent = 'S01';

    this.timeLabel = document.createElement('span');
    this.timeLabel.className = 'time-display';
    this.timeLabel.textContent = '00:00 / 04:15';

    statusCol.appendChild(this.shotLabel);
    statusCol.appendChild(this.timeLabel);
    bottomControls.appendChild(statusCol);

    // Center Action Buttons (large mobile touch buttons)
    const actionsCol = document.createElement('div');
    actionsCol.className = 'controls-actions-col';

    const replayBtn = document.createElement('button');
    replayBtn.className = 'touch-btn secondary-touch-btn';
    replayBtn.setAttribute('aria-label', 'Rever cena actual');
    replayBtn.innerHTML = '<span class="icon">↺</span><span class="btn-text">Rever</span>';
    replayBtn.addEventListener('click', () => this.callbacks.onReplay());

    this.playBtn = document.createElement('button');
    this.playBtn.className = 'touch-btn primary-touch-btn';
    this.playBtn.setAttribute('aria-label', 'Reproduzir ou pausar');
    this.playBtn.innerHTML = '<span class="play-icon">▶</span><span class="btn-label">Iniciar</span>';
    this.playBtn.addEventListener('click', () => this.handlePlayClick());

    const skipBtn = document.createElement('button');
    skipBtn.className = 'touch-btn secondary-touch-btn';
    skipBtn.setAttribute('aria-label', 'Saltar para a próxima cena');
    skipBtn.innerHTML = '<span class="icon">⏭</span><span class="btn-text">Saltar</span>';
    skipBtn.addEventListener('click', () => this.callbacks.onSkip());

    actionsCol.appendChild(replayBtn);
    actionsCol.appendChild(this.playBtn);
    actionsCol.appendChild(skipBtn);
    bottomControls.appendChild(actionsCol);

    bottomBar.appendChild(bottomControls);
    this.element.appendChild(bottomBar);

    container.appendChild(this.element);

    this.setupKeyboardShortcuts();
  }

  public updateState(
    mode: EpisodeMode,
    currentShot: Shot,
    shotIndex: number,
    totalShots: number,
    _localTimeSec: number,
    totalElapsedDirectedSec: number,
    totalDirectedDurationSec: number
  ): void {
    if (mode === 'ready') {
      this.playBtn.innerHTML = '<span class="play-icon">▶</span><span class="btn-label">Iniciar</span>';
      this.playBtn.classList.remove('paused');
    } else if (mode === 'playing') {
      this.playBtn.innerHTML = '<span class="play-icon">❚❚</span><span class="btn-label">Pausa</span>';
      this.playBtn.classList.add('playing');
      this.playBtn.classList.remove('paused');
    } else if (mode === 'paused') {
      this.playBtn.innerHTML = '<span class="play-icon">▶</span><span class="btn-label">Continuar</span>';
      this.playBtn.classList.remove('playing');
      this.playBtn.classList.add('paused');
    } else if (mode === 'finished') {
      this.playBtn.innerHTML = '<span class="play-icon">↺</span><span class="btn-label">Rever</span>';
      this.playBtn.classList.remove('playing', 'paused');
    } else if (mode === 'awaitingInteraction') {
      this.playBtn.innerHTML = '<span class="play-icon">⚡</span><span class="btn-label">Interagir</span>';
    }

    this.shotLabel.textContent = `${currentShot.id} (${shotIndex + 1}/${totalShots})`;

    const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    this.timeLabel.textContent = `${formatTime(totalElapsedDirectedSec)} / ${formatTime(totalDirectedDurationSec)}`;

    const progressPercent = Math.min(
      100,
      Math.max(0, (totalElapsedDirectedSec / totalDirectedDurationSec) * 100)
    );
    this.progressFill.style.width = `${progressPercent}%`;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    this.muteBtn.innerHTML = muted
      ? '<span class="icon">🔇</span><span class="btn-text">Mudo</span>'
      : '<span class="icon">🔊</span><span class="btn-text">Som</span>';
    this.muteBtn.classList.toggle('muted', muted);
  }

  public setSubtitlesEnabled(enabled: boolean): void {
    this.isSubtitlesOn = enabled;
    this.subBtn.classList.toggle('active', enabled);
  }

  private handlePlayClick(): void {
    this.callbacks.onTogglePlay();
  }

  private handleMuteClick(): void {
    this.isMuted = !this.isMuted;
    this.setMuted(this.isMuted);
    this.callbacks.onToggleMute();
  }

  private handleSubtitlesClick(): void {
    this.isSubtitlesOn = !this.isSubtitlesOn;
    this.setSubtitlesEnabled(this.isSubtitlesOn);
    this.callbacks.onToggleSubtitles();
  }

  private setupKeyboardShortcuts(): void {
    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        this.callbacks.onTogglePlay();
      } else if (e.code === 'KeyM') {
        this.handleMuteClick();
      } else if (e.code === 'KeyC') {
        this.handleSubtitlesClick();
      } else if (e.code === 'KeyR') {
        this.callbacks.onReplay();
      }
    });
  }

  public dispose(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
