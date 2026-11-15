import type { ShotId, EpisodeMode, ClueId, SavedProgress } from './types';

export interface StateSnapshot {
  currentShotId: ShotId;
  mode: EpisodeMode;
  discoveredClues: ClueId[];
  completedFlashbacks: string[];
  verdictCorrect?: boolean;
  isSubtitlesEnabled: boolean;
  isMuted: boolean;
  summarySeen: boolean;
}

export class EpisodeStateManager {
  private currentShotId: ShotId = 'S01';
  private mode: EpisodeMode = 'ready';
  private discoveredClues: ClueId[] = [];
  private completedFlashbacks: string[] = [];
  private verdictCorrect?: boolean;
  private isSubtitlesEnabled: boolean = true;
  private isMuted: boolean = false;
  private summarySeen: boolean = false;

  public getState(): StateSnapshot {
    return {
      currentShotId: this.currentShotId,
      mode: this.mode,
      discoveredClues: [...this.discoveredClues],
      completedFlashbacks: [...this.completedFlashbacks],
      verdictCorrect: this.verdictCorrect,
      isSubtitlesEnabled: this.isSubtitlesEnabled,
      isMuted: this.isMuted,
      summarySeen: this.summarySeen,
    };
  }

  public setShot(shotId: ShotId): void {
    this.currentShotId = shotId;
  }

  public setMode(mode: EpisodeMode): void {
    this.mode = mode;
  }

  public discoverClue(clueId: ClueId): void {
    if (!this.discoveredClues.includes(clueId)) {
      this.discoveredClues.push(clueId);
    }
  }

  public completeFlashback(flashbackId: string): void {
    if (!this.completedFlashbacks.includes(flashbackId)) {
      this.completedFlashbacks.push(flashbackId);
    }
  }

  public setVerdict(correct: boolean): void {
    this.verdictCorrect = correct;
  }

  public toggleSubtitles(): boolean {
    this.isSubtitlesEnabled = !this.isSubtitlesEnabled;
    return this.isSubtitlesEnabled;
  }

  public setSubtitles(enabled: boolean): void {
    this.isSubtitlesEnabled = enabled;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public setSummarySeen(seen: boolean): void {
    this.summarySeen = seen;
  }

  public reset(): void {
    this.currentShotId = 'S01';
    this.mode = 'ready';
    this.discoveredClues = [];
    this.completedFlashbacks = [];
    this.verdictCorrect = undefined;
    this.summarySeen = false;
  }

  public exportProgress(): SavedProgress {
    return {
      schemaVersion: 1,
      shotId: this.currentShotId,
      discoveredClues: [...this.discoveredClues],
      completedFlashbacks: [...this.completedFlashbacks],
      verdictCorrect: this.verdictCorrect,
      summarySeen: this.summarySeen,
      timestamp: Date.now(),
    };
  }

  public restoreProgress(progress: SavedProgress): void {
    if (!progress || progress.schemaVersion !== 1) {
      return;
    }
    this.currentShotId = progress.shotId;
    this.discoveredClues = Array.isArray(progress.discoveredClues)
      ? [...progress.discoveredClues]
      : [];
    this.completedFlashbacks = Array.isArray(progress.completedFlashbacks)
      ? [...progress.completedFlashbacks]
      : [];
    this.verdictCorrect = progress.verdictCorrect;
    this.summarySeen = Boolean(progress.summarySeen);
  }
}
