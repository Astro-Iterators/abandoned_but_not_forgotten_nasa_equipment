import * as Phaser from 'phaser';
import { gameConfig } from './game/config';
import { StateManager } from './game/state';
import { ProgressManager } from './game/progress';
import { AudioManager } from './game/systems/AudioManager';
import { UIController } from './ui/UIController';
import { CinematicPlayerUI } from './ui/CinematicPlayerUI';
import { OPPORTUNITY_EPISODE } from './content/opportunity';
import { OpportunityScene } from './game/scenes/OpportunityScene';

function initApp(): void {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('Elemento #app não encontrado no DOM');
  }

  // Core managers
  const stateManager = new StateManager('exploration');
  const progressManager = new ProgressManager();
  const audioManager = new AudioManager(progressManager.getData().audioMuted);

  // UI Controller (dialogue, puzzle, journal, video modal)
  const ui = new UIController(root, stateManager, progressManager, audioManager, OPPORTUNITY_EPISODE);

  // Cinematic Player UI (Film Director with Chapters inspired by A Solar Tale & Henry's Farm)
  let oppSceneRef: OpportunityScene | null = null;

  const cinemaPlayer = new CinematicPlayerUI(root, OPPORTUNITY_EPISODE, audioManager, {
    onActChange: (act) => {
      ui.closeDialogue();
      if (act.type === 'interactive_exploration') {
        stateManager.transition('exploration');
        if (!progressManager.getData().clueDiscovered && !progressManager.getData().roverContacted) {
          ui.startIntroDialogue();
        }
      } else {
        stateManager.transition('cinematic');
      }
    },
    onExploreStart: () => {
      cinemaPlayer.setActIndex(1); // Jump to Act 1: Exploration
    },
    onVideoStart: () => {
      ui.openCinematic();
    },
    onPuzzleStart: () => {
      ui.openPuzzle();
    },
    onJournalStart: () => {
      ui.openJournal();
    },
    onReset: () => {
      ui.resetEpisode();
    }
  });

  // Testing hooks
  window.addEventListener('test-open-puzzle', () => {
    ui.openPuzzle();
  });
  window.addEventListener('test-open-video', () => {
    ui.openCinematic();
  });

  // Initialize Phaser Game instance
  const game = new Phaser.Game(gameConfig);

  // Connect OpportunityScene bridge once the scene is ready
  const checkSceneInterval = setInterval(() => {
    const oppScene = game.scene.getScene('OpportunityScene') as OpportunityScene;
    if (oppScene && oppScene.scene.isActive()) {
      clearInterval(checkSceneInterval);
      oppSceneRef = oppScene;

      oppScene.setBridge({
        onClueInteract: () => {
          progressManager.setClueDiscovered(true);
          cinemaPlayer.setActIndex(2); // Jump to Act 2: Macro Scanner
        },
        onRoverInteract: () => {
          progressManager.setRoverContacted(true);
          cinemaPlayer.setActIndex(3); // Jump to Act 3: Golden Memory
          ui.openCinematic();
        },
        onTargetChange: (prompt) => {
          ui.showInteractionPrompt(prompt);
        },
        onStepSound: () => {
          audioManager.playCue('step');
        }
      });

      ui.setInteractTrigger(() => {
        oppScene.triggerInteract();
      });

      // Sync state manager changes with movement pause
      stateManager.onStateChange((_from, to) => {
        const moveSys = oppScene.getMovementSystem();
        if (moveSys) {
          moveSys.setPaused(to !== 'exploration');
        }
      });
    }
  }, 100);

  // Virtual Touch Controls setup
  setupTouchControls(game);
}

function setupTouchControls(game: Phaser.Game): void {
  const touchContainer = document.getElementById('touch-controls');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice && touchContainer) {
    touchContainer.classList.remove('hidden');

    const bindTouchDir = (id: string, key: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const oppScene = game.scene.getScene('OpportunityScene') as OpportunityScene;
        if (oppScene) oppScene.getMovementSystem()?.handleKeyDown(key);
      });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        const oppScene = game.scene.getScene('OpportunityScene') as OpportunityScene;
        if (oppScene) oppScene.getMovementSystem()?.handleKeyUp(key);
      });
    };

    bindTouchDir('touch-up', 'w');
    bindTouchDir('touch-down', 's');
    bindTouchDir('touch-left', 'a');
    bindTouchDir('touch-right', 'd');

    const actionBtn = document.getElementById('touch-action');
    if (actionBtn) {
      actionBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const oppScene = game.scene.getScene('OpportunityScene') as OpportunityScene;
        if (oppScene) oppScene.triggerInteract();
      });
    }
  }
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
