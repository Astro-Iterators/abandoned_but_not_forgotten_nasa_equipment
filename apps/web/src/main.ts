import './style.css';
import { episode01Shots } from './episode/episode01';
import { TimelineDirector } from './director/TimelineDirector';
import { EpisodeStateManager } from './director/EpisodeState';
import { ClueController } from './director/ClueController';
import { ProgressStore } from './director/ProgressStore';
import { World } from './world/World';
import { AudioManager } from './audio/AudioManager';
import { Controls } from './ui/Controls';
import { Subtitles } from './ui/Subtitles';
import { AnalysisPanel } from './ui/AnalysisPanel';
import { ImageSequencePanel } from './ui/ImageSequencePanel';
import { ReportPanel } from './ui/ReportPanel';
import { SourcesPanel } from './ui/SourcesPanel';
import { MobileGamepad } from './ui/MobileGamepad';
import { BipVisorHud } from './ui/BipVisorHud';
import * as THREE from 'three';

class App {
  private world: World;
  private director: TimelineDirector;
  private stateManager: EpisodeStateManager;
  private clueController: ClueController;
  private progressStore: ProgressStore;
  private audioManager: AudioManager;

  private controls: Controls;
  private subtitles: Subtitles;
  private analysisPanel: AnalysisPanel;
  private imageSequencePanel: ImageSequencePanel;
  private reportPanel: ReportPanel;
  private sourcesPanel: SourcesPanel;
  private gamepad: MobileGamepad;
  private visorHud: BipVisorHud;

  private lastTimeMs: number = 0;
  private isRunning: boolean = true;
  private lastSpokenDialogueId: string | null = null;
  private appRoot: HTMLElement;

  // Interactive gameplay stages
  private isDrivingToRocket: boolean = false;
  private isDrivingOnMoonPOV: boolean = false;
  private rocketTargetPos = new THREE.Vector3(0, 0, 4.5);
  private debrisATargetPos = new THREE.Vector3(0.8, 0.25, -2.5);

  constructor() {
    this.appRoot = document.getElementById('app')!;
    const canvasContainer = document.getElementById('canvas-container')!;
    const uiContainer = document.getElementById('ui-container')!;

    // 1. Core Systems
    this.director = new TimelineDirector(episode01Shots);
    this.stateManager = new EpisodeStateManager();
    this.clueController = new ClueController();
    this.progressStore = new ProgressStore();
    this.audioManager = new AudioManager();

    // 2. 3D World
    this.world = new World(canvasContainer);

    // 3. UI Layer
    this.subtitles = new Subtitles(uiContainer);
    this.visorHud = new BipVisorHud(uiContainer);

    this.analysisPanel = new AnalysisPanel(uiContainer);
    this.imageSequencePanel = new ImageSequencePanel(uiContainer);
    this.sourcesPanel = new SourcesPanel(uiContainer);

    // Mobile Gamepad for Driving Sections
    this.gamepad = new MobileGamepad(uiContainer, {
      onActionClick: () => this.handleGamepadAction(),
    });

    this.reportPanel = new ReportPanel(uiContainer, {
      onVerdictCompleted: () => {
        this.audioManager.playSuccessChime();
        this.triggerScreenShake();
        this.stateManager.setVerdict(true);
        this.director.completeInteraction();
      },
      onReplayEpisode: () => {
        this.director.replay();
        this.stateManager.reset();
        this.progressStore.clear();
      },
      onOpenSources: () => {
        this.sourcesPanel.show();
      },
    });

    this.controls = new Controls(uiContainer, {
      onTogglePlay: () => this.handleTogglePlay(),
      onReplay: () => this.handleReplayCurrentShot(),
      onSkip: () => this.handleSkipCurrentShot(),
      onToggleMute: () => this.audioManager.toggleMute(),
      onToggleSubtitles: () => {
        const enabled = this.stateManager.toggleSubtitles();
        this.subtitles.setVisible(enabled);
      },
      onOpenSources: () => this.sourcesPanel.show(),
    });

    // 4. Mobile Screen Tap on Viewport
    canvasContainer.addEventListener('click', () => {
      this.ensureAudioStarted();
      if (this.director.getMode() === 'ready') {
        this.director.start();
      }
    });

    // 5. Wire Director Shot & Mode Changes
    this.director.onShotChange((shot) => {
      this.handleShotChanged(shot.id);
    });

    this.director.onModeChange((mode) => {
      if (mode === 'awaitingInteraction') {
        this.triggerCurrentInteraction();
      } else if (mode === 'finished') {
        this.reportPanel.showFinalEpisodeCard();
      }
    });

    // 6. Restore Previous Save if available
    const saved = this.progressStore.load();
    if (saved && saved.shotId !== 'S01') {
      this.stateManager.restoreProgress(saved);
      console.log('Save restaurado:', saved.shotId);
    }

    // 7. Start Render Loop
    this.lastTimeMs = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  private ensureAudioStarted(): void {
    this.audioManager.init();
    this.audioManager.resumeContext();
    this.audioManager.startDynamicMusic();
  }

  public triggerScreenShake(): void {
    this.appRoot.classList.remove('screen-shake');
    // Force reflow
    void this.appRoot.offsetWidth;
    this.appRoot.classList.add('screen-shake');
  }

  private handleTogglePlay(): void {
    this.ensureAudioStarted();

    const mode = this.director.getMode();
    if (mode === 'ready') {
      this.director.start();
    } else if (mode === 'finished') {
      this.director.replay();
    } else {
      this.director.togglePause();
    }
  }

  private handleShotChanged(shotId: string): void {
    this.audioManager.playWhoosh();

    if (shotId === 'S01') {
      // S01: Earth Prototyping Laboratory
      this.world.setCameraMode('cinematic');
      this.isDrivingToRocket = false;
      this.isDrivingOnMoonPOV = false;
      this.world.bipController.isControllable = false;
      this.gamepad.hide();
      this.visorHud.hide();

      // At 5 seconds into S01, activate driving Bip to rocket!
      setTimeout(() => {
        if (this.director.getCurrentShot().id === 'S01') {
          this.startDrivingToRocket();
        }
      }, 5500);
    } else if (shotId === 'S02') {
      // S02: Rocket Liftoff
      this.endDrivingToRocket();
      this.world.setCameraMode('cinematic');
      this.audioManager.playRocketBlast();
      this.triggerScreenShake();
    } else if (shotId === 'S04') {
      // S04: Lunar Arrival -> Activate Bip Visor First-Person Driving!
      setTimeout(() => {
        if (this.director.getCurrentShot().id === 'S04') {
          this.startDrivingOnMoonPOV();
        }
      }, 4000);
    } else if (shotId === 'S06' || shotId === 'S08' || shotId === 'S10') {
      // Historical Flashbacks
      this.endDrivingOnMoonPOV();
      this.world.setCameraMode('cinematic');
    }
  }

  // --- Interactive Driving Section 1: Guide Bip to the Rocket ---
  private startDrivingToRocket(): void {
    this.isDrivingToRocket = true;
    this.world.bipController.isControllable = true;
    this.world.bipController.setBounds(-4, 4, -1, 5);
    this.world.setCameraMode('followBip');
    this.gamepad.show(
      '<strong>🕹 PILOTA O BIP:</strong> Conduz o bot até à rampa do foguetão!',
      'Embarcar',
      '🚀'
    );
  }

  private endDrivingToRocket(): void {
    this.isDrivingToRocket = false;
    this.world.bipController.isControllable = false;
    this.gamepad.hide();
  }

  // --- Interactive Driving Section 2: Moon Surface in Bip's Perspective ---
  private startDrivingOnMoonPOV(): void {
    this.isDrivingOnMoonPOV = true;
    this.world.bipController.isControllable = true;
    this.world.bipController.setBounds(-10, 10, -10, 4);
    this.world.setCameraMode('bipPOV'); // Visor First-Person Mode!
    this.visorHud.show();
    this.gamepad.show(
      '<strong>👁 PERSPECTIVA DO BIP:</strong> Conduz o bot e investiga o vestígio lunar!',
      'Analisar',
      '🔍'
    );
  }

  private endDrivingOnMoonPOV(): void {
    this.isDrivingOnMoonPOV = false;
    this.world.bipController.isControllable = false;
    this.visorHud.hide();
    this.gamepad.hide();
  }

  private handleGamepadAction(): void {
    this.audioManager.playDopaminePop(700);

    if (this.isDrivingToRocket) {
      // Boarding rocket
      this.audioManager.playRocketBlast();
      this.triggerScreenShake();
      this.endDrivingToRocket();
      this.director.skipToShot('S02');
    } else if (this.isDrivingOnMoonPOV) {
      // Scanning debris on moon
      this.audioManager.playScanChime();
      this.triggerScreenShake();
      this.endDrivingOnMoonPOV();
      this.director.skipToShot('S05');
    }
  }

  private handleReplayCurrentShot(): void {
    const currentShot = this.director.getCurrentShot();
    this.director.skipToShot(currentShot.id);
  }

  private handleSkipCurrentShot(): void {
    const currentIdx = this.director.getCurrentShotIndex();
    if (currentIdx < episode01Shots.length - 1) {
      const nextShot = episode01Shots[currentIdx + 1];
      this.director.skipToShot(nextShot.id);
    } else {
      this.reportPanel.showFinalEpisodeCard();
    }
  }

  private triggerCurrentInteraction(): void {
    const currentShot = this.director.getCurrentShot();

    if (currentShot.interaction === 'analyzeClueA') {
      const clue = this.clueController.getClue('clueA')!;
      this.analysisPanel.show(clue, () => {
        this.audioManager.playScanChime();
        this.triggerScreenShake();
        this.stateManager.discoverClue('clueA');
        this.saveCurrentProgress();
        this.director.completeInteraction();
      });
    } else if (currentShot.interaction === 'analyzeClueB') {
      const clue = this.clueController.getClue('clueB')!;
      this.analysisPanel.show(clue, () => {
        this.audioManager.playScanChime();
        this.triggerScreenShake();
        this.stateManager.discoverClue('clueB');
        this.saveCurrentProgress();
        this.director.completeInteraction();
      });
    } else if (currentShot.interaction === 'orderImages') {
      this.imageSequencePanel.show(() => {
        this.audioManager.playSuccessChime();
        this.triggerScreenShake();
        this.stateManager.discoverClue('clueC');
        this.saveCurrentProgress();
        this.director.completeInteraction();
      });
    } else if (currentShot.interaction === 'chooseVerdict') {
      this.reportPanel.showVerdictQuestion();
    }
  }

  private saveCurrentProgress(): void {
    this.stateManager.setShot(this.director.getCurrentShot().id);
    this.progressStore.save(this.stateManager.exportProgress());
  }

  private loop(nowMs: number): void {
    if (!this.isRunning) return;

    const deltaSec = Math.min((nowMs - this.lastTimeMs) / 1000, 0.1);
    this.lastTimeMs = nowMs;

    // Read manual player driving inputs if active
    const manualInput = this.gamepad.getInput();

    // Advance timeline
    const evaluated = this.director.update(deltaSec);

    // Audio cue check for Bip communicative chirps
    if (
      evaluated.activeDialogue &&
      evaluated.activeDialogue.id !== this.lastSpokenDialogueId
    ) {
      this.lastSpokenDialogueId = evaluated.activeDialogue.id;
      if (evaluated.activeDialogue.speaker === 'Bip') {
        this.audioManager.playBipChirp(920);
      }
    } else if (!evaluated.activeDialogue) {
      this.lastSpokenDialogueId = null;
    }

    // Render 3D scene with manual input
    this.world.updateAndRender(evaluated, deltaSec, manualInput);

    // Gameplay distance checks
    if (this.isDrivingToRocket) {
      const dist = this.world.bipController.getDistanceTo(this.rocketTargetPos);
      const isNear = dist < 2.2;
      this.gamepad.setActionEnabled(isNear);
    } else if (this.isDrivingOnMoonPOV) {
      const dist = this.world.bipController.getDistanceTo(this.debrisATargetPos);
      const isLocked = dist < 2.8;
      this.visorHud.updateTelemetry(dist, isLocked);
      this.gamepad.setActionEnabled(isLocked);
    }

    // Update Subtitles
    this.subtitles.update(
      evaluated.activeDialogue,
      evaluated.shot.isFlashback ? evaluated.shot.flashbackLabel : undefined
    );

    // Update Controls UI
    this.controls.updateState(
      this.director.getMode(),
      evaluated.shot,
      this.director.getCurrentShotIndex(),
      episode01Shots.length,
      evaluated.shotLocalTime,
      this.director.getElapsedDirectedTime(),
      this.director.getTotalDirectedDuration()
    );

    requestAnimationFrame((t) => this.loop(t));
  }

  public dispose(): void {
    this.isRunning = false;
    this.world.dispose();
    this.controls.dispose();
    this.subtitles.dispose();
    this.analysisPanel.dispose();
    this.imageSequencePanel.dispose();
    this.reportPanel.dispose();
    this.sourcesPanel.dispose();
    this.gamepad.dispose();
    this.visorHud.dispose();
    this.audioManager.dispose();
  }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
