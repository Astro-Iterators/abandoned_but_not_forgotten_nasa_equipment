import { StateManager } from '../game/state';
import { ProgressManager } from '../game/progress';
import { AudioManager } from '../game/systems/AudioManager';
import { CutsceneDirector } from '../game/systems/CutsceneDirector';
import { DialoguePanel } from './DialoguePanel';
import { PuzzlePanel } from './PuzzlePanel';
import { JournalPanel } from './JournalPanel';
import { SettingsPanel } from './SettingsPanel';
import { SubtitlePanel } from './SubtitlePanel';
import type { EpisodeContent } from '../game/contracts';

export class UIController {
  private root: HTMLElement;
  private stateManager: StateManager;
  private progressManager: ProgressManager;
  private audioManager: AudioManager;
  private cutsceneDirector: CutsceneDirector;
  private content: EpisodeContent;

  private dialoguePanel: DialoguePanel;
  private puzzlePanel: PuzzlePanel;
  private journalPanel: JournalPanel;
  private settingsPanel: SettingsPanel;
  private subtitlePanel: SubtitlePanel;

  private hudElement!: HTMLElement;
  private promptElement!: HTMLElement;
  private videoModalElement!: HTMLElement;
  private videoElement!: HTMLVideoElement;
  private onTriggerInteract?: () => void;

  constructor(
    root: HTMLElement,
    stateManager: StateManager,
    progressManager: ProgressManager,
    audioManager: AudioManager,
    content: EpisodeContent
  ) {
    this.root = root;
    this.stateManager = stateManager;
    this.progressManager = progressManager;
    this.audioManager = audioManager;
    this.content = content;

    this.cutsceneDirector = new CutsceneDirector({
      durationSeconds: content.cinematic.durationSeconds,
      fallbackSummary: content.cinematic.fallbackSummary
    });

    this.setupHUD();
    this.setupPrompt();
    this.setupVideoModal();

    this.dialoguePanel = new DialoguePanel(this.root);
    this.puzzlePanel = new PuzzlePanel(this.root, content.puzzle);
    this.journalPanel = new JournalPanel(this.root, content);
    this.settingsPanel = new SettingsPanel(this.root);
    this.subtitlePanel = new SubtitlePanel(this.root);

    this.bindEvents();
    this.updateHUD();
  }

  public setInteractTrigger(callback: () => void): void {
    this.onTriggerInteract = callback;
  }

  private setupHUD(): void {
    this.hudElement = document.createElement('header');
    this.hudElement.className = 'game-hud';
    this.hudElement.innerHTML = `
      <div class="hud-left">
        <span class="hud-badge">Episódio 1</span>
        <h1 class="hud-title">Ainda Estou Aqui: Opportunity</h1>
      </div>
      <div class="hud-right">
        <button class="btn btn-hud" id="hud-btn-sound" title="Alternar Som">
          ${this.audioManager.isMuted() ? '🔇 Mudo' : '🔊 Som'}
        </button>
        <button class="btn btn-hud" id="hud-btn-journal" title="Abrir Caderno de Bordo">
          📖 Ficha & Fontes
        </button>
        <button class="btn btn-hud" id="hud-btn-settings" title="Instruções e Opções">
          ⚙ Opções
        </button>
      </div>
    `;
    this.root.appendChild(this.hudElement);
  }

  private setupPrompt(): void {
    this.promptElement = document.createElement('div');
    this.promptElement.className = 'interaction-prompt hidden';
    this.promptElement.id = 'interaction-prompt';
    this.promptElement.innerHTML = `
      <button class="btn btn-interact" id="btn-interact-action">
        <span class="key-badge">E</span> <span id="prompt-label">Interagir</span>
      </button>
    `;
    this.root.appendChild(this.promptElement);
  }

  private setupVideoModal(): void {
    this.videoModalElement = document.createElement('div');
    this.videoModalElement.className = 'video-modal-overlay hidden';
    this.videoModalElement.id = 'video-modal';
    this.videoModalElement.innerHTML = `
      <div class="video-modal-card">
        <div class="video-header">
          <div class="video-tag">Arquivo Histórico da NASA — Missão Opportunity</div>
          <button class="btn-close" id="btn-video-close">✕</button>
        </div>
        <div class="video-player-container" id="video-container">
          <video id="mission-video" playsinline preload="auto">
            <source src="${this.content.cinematic.videoSrc}" type="video/mp4">
            <track src="${this.content.cinematic.captionSrc}" kind="subtitles" srclang="pt" label="Português" default>
            O seu navegador não suporta a reprodução deste vídeo.
          </video>
          <div class="video-fallback-box hidden" id="video-fallback-box">
            <h3>Memória do Opportunity (Modo Storyboard)</h3>
            <div class="fallback-slides">
              ${this.content.cinematic.fallbackSummary.map((s) => `<p>▶ ${s}</p>`).join('')}
            </div>
          </div>
        </div>
        <div class="video-controls">
          <button class="btn btn-secondary" id="btn-video-playpause">▶ Reproduzir</button>
          <button class="btn btn-secondary" id="btn-video-replay">↺ Reiniciar Vídeo</button>
          <button class="btn btn-outline" id="btn-video-fallback">Alternar Storyboard</button>
          <button class="btn btn-primary" id="btn-video-skip">Continuar para o Enigma →</button>
        </div>
      </div>
    `;
    this.root.appendChild(this.videoModalElement);
    this.videoElement = this.videoModalElement.querySelector('#mission-video') as HTMLVideoElement;
  }

  private bindEvents(): void {
    const soundBtn = this.hudElement.querySelector('#hud-btn-sound') as HTMLButtonElement;
    soundBtn.onclick = () => {
      const muted = this.audioManager.toggleMute();
      this.progressManager.setAudioMuted(muted);
      soundBtn.innerHTML = muted ? '🔇 Mudo' : '🔊 Som';
    };

    const journalBtn = this.hudElement.querySelector('#hud-btn-journal') as HTMLButtonElement;
    journalBtn.onclick = () => {
      this.openJournal();
    };

    const settingsBtn = this.hudElement.querySelector('#hud-btn-settings') as HTMLButtonElement;
    settingsBtn.onclick = () => {
      this.openSettings();
    };

    const promptBtn = this.promptElement.querySelector('#btn-interact-action') as HTMLButtonElement;
    promptBtn.onclick = () => {
      if (this.onTriggerInteract) {
        this.onTriggerInteract();
      }
    };

    // Video modal buttons
    const playPauseBtn = this.videoModalElement.querySelector('#btn-video-playpause') as HTMLButtonElement;
    playPauseBtn.onclick = () => {
      if (this.videoElement.paused) {
        this.videoElement.play().catch(() => {
          this.showVideoFallback();
        });
        playPauseBtn.textContent = '⏸ Pausar';
      } else {
        this.videoElement.pause();
        playPauseBtn.textContent = '▶ Reproduzir';
      }
    };

    const replayBtn = this.videoModalElement.querySelector('#btn-video-replay') as HTMLButtonElement;
    replayBtn.onclick = () => {
      this.videoElement.currentTime = 0;
      this.videoElement.play().catch(() => {});
      this.cutsceneDirector.replay();
      playPauseBtn.textContent = '⏸ Pausar';
    };

    const fallbackBtn = this.videoModalElement.querySelector('#btn-video-fallback') as HTMLButtonElement;
    fallbackBtn.onclick = () => {
      this.toggleVideoFallback();
    };

    const skipBtn = this.videoModalElement.querySelector('#btn-video-skip') as HTMLButtonElement;
    skipBtn.onclick = () => {
      this.closeVideoAndProceedToPuzzle();
    };

    const closeVideoBtn = this.videoModalElement.querySelector('#btn-video-close') as HTMLButtonElement;
    closeVideoBtn.onclick = () => {
      this.closeVideoAndProceedToPuzzle();
    };

    // Video events
    this.videoElement.onended = () => {
      this.cutsceneDirector.finish();
      this.progressManager.setCinematicViewed(true);
      skipBtn.textContent = 'Ir para o Enigma Científico →';
      playPauseBtn.textContent = '▶ Reproduzir';
    };

    this.videoElement.onerror = () => {
      this.showVideoFallback();
    };

    // Global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        const muted = this.audioManager.toggleMute();
        this.progressManager.setAudioMuted(muted);
        soundBtn.innerHTML = muted ? '🔇 Mudo' : '🔊 Som';
      } else if (e.key === 'j' || e.key === 'J') {
        if (!this.dialoguePanel.isVisible() && !this.puzzlePanel.isVisible()) {
          this.openJournal();
        }
      }
    });
  }

  public showInteractionPrompt(promptText: string | null): void {
    if (!promptText || this.stateManager.getState() !== 'exploration') {
      this.promptElement.classList.add('hidden');
    } else {
      const label = this.promptElement.querySelector('#prompt-label');
      if (label) label.textContent = promptText;
      this.promptElement.classList.remove('hidden');
    }
  }

  public startIntroDialogue(onDone?: () => void): void {
    this.stateManager.transition('dialogue');
    this.audioManager.playCue('bip');
    this.dialoguePanel.show(this.content.introLines, () => {
      this.stateManager.transition('exploration');
      if (onDone) onDone();
    });
  }

  public startClueDialogue(onDone?: () => void): void {
    this.stateManager.transition('dialogue');
    this.audioManager.playCue('clue');
    this.progressManager.setClueDiscovered(true);

    const clueLines = [
      {
        id: 'clue_nayla',
        speaker: 'nayla' as const,
        text: 'Olha Bip! Estão aqui umas bolinhas azuis-acinzentadas misturadas na rocha vermelha!'
      },
      {
        id: 'clue_bip',
        speaker: 'bip' as const,
        text: 'Excelente observação! São esférulas de hematite, conhecidas informalmente como "mirtilos marcianos". Formaram-se pela presença de água subterrânea no passado distante.'
      },
      {
        id: 'clue_nayla_2',
        speaker: 'nayla' as const,
        text: 'Isto é uma evidência real! Vamos levar este registo até ao Opportunity logo à frente.'
      }
    ];

    this.dialoguePanel.show(clueLines, () => {
      this.stateManager.transition('exploration');
      this.updateHUD();
      if (onDone) onDone();
    });
  }

  public startRoverDialogue(): void {
    this.stateManager.transition('dialogue');
    this.audioManager.playCue('bip');
    this.progressManager.setRoverContacted(true);

    this.dialoguePanel.show(this.content.roverDialogue, () => {
      this.openCinematic();
    });
  }

  public closeDialogue(): void {
    this.dialoguePanel.hide();
  }

  public openCinematic(): void {
    this.stateManager.transition('cinematic');
    this.videoModalElement.classList.remove('hidden');
    this.videoElement.currentTime = 0;
    this.videoElement.play().catch(() => {
      // Auto-play was prevented by browser policy or missing codec
      this.showVideoFallback();
    });
    this.cutsceneDirector.play();
  }

  private showVideoFallback(): void {
    const box = this.videoModalElement.querySelector('#video-fallback-box') as HTMLElement;
    if (box) box.classList.remove('hidden');
    this.cutsceneDirector.triggerFallback();
  }

  private toggleVideoFallback(): void {
    const box = this.videoModalElement.querySelector('#video-fallback-box') as HTMLElement;
    if (box) box.classList.toggle('hidden');
  }

  private closeVideoAndProceedToPuzzle(): void {
    this.videoElement.pause();
    this.videoModalElement.classList.add('hidden');
    this.progressManager.setCinematicViewed(true);
    this.openPuzzle();
  }

  public openPuzzle(): void {
    this.stateManager.transition('puzzle');
    this.puzzlePanel.show(
      () => {
        // Solved
        this.progressManager.setPuzzleSolved(true);
        this.audioManager.playCue('success');
        this.openJournal();
      },
      () => {
        // Closed/back
        this.stateManager.transition('exploration');
      }
    );
  }

  public openJournal(): void {
    const prev = this.stateManager.getState();
    const canComplete = this.progressManager.isReadyToComplete();

    if (canComplete) {
      this.progressManager.completeEpisode();
      this.stateManager.transition('complete', {
        roverContacted: true,
        puzzleSolved: true
      });
    } else {
      this.stateManager.transition('journal');
    }

    this.journalPanel.show({
      onClose: () => {
        this.stateManager.transition(prev === 'complete' ? 'complete' : 'exploration');
      },
      onReplayVideo: () => {
        this.openCinematic();
      },
      onReset: () => {
        this.resetEpisode();
      }
    });
    this.updateHUD();
  }

  public openSettings(): void {
    this.stateManager.pause();
    this.settingsPanel.show(this.progressManager.getData(), {
      onClose: () => {
        this.stateManager.resume();
      },
      onMuteToggle: () => {
        const muted = this.audioManager.toggleMute();
        this.progressManager.setAudioMuted(muted);
        this.updateHUD();
        this.settingsPanel.show(this.progressManager.getData(), {
          onClose: () => this.stateManager.resume(),
          onMuteToggle: () => {},
          onReset: () => {}
        });
      },
      onReset: () => {
        this.resetEpisode();
      }
    });
  }

  public resetEpisode(): void {
    this.progressManager.reset();
    this.stateManager.reset();
    this.dialoguePanel.hide();
    this.puzzlePanel.hide();
    this.journalPanel.hide();
    this.settingsPanel.hide();
    this.videoModalElement.classList.add('hidden');
    this.videoElement.pause();
    window.location.reload();
  }

  public updateHUD(): void {
    const soundBtn = this.hudElement.querySelector('#hud-btn-sound') as HTMLButtonElement;
    if (soundBtn) {
      soundBtn.innerHTML = this.audioManager.isMuted() ? '🔇 Mudo' : '🔊 Som';
    }
  }
}
