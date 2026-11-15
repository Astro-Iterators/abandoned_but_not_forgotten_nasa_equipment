import type { Shot, ShotId, EpisodeMode, EvaluatedShotState } from './types';
import { ShotEvaluator } from './ShotEvaluator';

export type ShotChangeCallback = (shot: Shot, index: number) => void;
export type ModeChangeCallback = (mode: EpisodeMode) => void;

export class TimelineDirector {
  private shots: Shot[];
  private currentShotIndex: number = 0;
  private currentShotLocalTime: number = 0;
  private mode: EpisodeMode = 'ready';
  private elapsedDirectedTime: number = 0; // Honest accumulated playback time

  private onShotChangeListeners: ShotChangeCallback[] = [];
  private onModeChangeListeners: ModeChangeCallback[] = [];

  constructor(shots: Shot[]) {
    if (!shots || shots.length === 0) {
      throw new Error('TimelineDirector requires at least one Shot.');
    }
    this.shots = shots;
  }

  public getTotalDirectedDuration(): number {
    return this.shots.reduce((acc, shot) => acc + shot.durationSec, 0);
  }

  public getMode(): EpisodeMode {
    return this.mode;
  }

  public getCurrentShot(): Shot {
    return this.shots[this.currentShotIndex];
  }

  public getCurrentShotIndex(): number {
    return this.currentShotIndex;
  }

  public getCurrentShotLocalTime(): number {
    return this.currentShotLocalTime;
  }

  public getElapsedDirectedTime(): number {
    return this.elapsedDirectedTime;
  }

  public start(): void {
    if (this.mode === 'ready') {
      this.mode = 'playing';
      this.currentShotIndex = 0;
      this.currentShotLocalTime = 0;
      this.notifyModeChange();
      this.notifyShotChange();
    }
  }

  public pause(): void {
    if (this.mode === 'playing') {
      this.mode = 'paused';
      this.notifyModeChange();
    }
  }

  public resume(): void {
    if (this.mode === 'paused') {
      this.mode = 'playing';
      this.notifyModeChange();
    }
  }

  public togglePause(): void {
    if (this.mode === 'playing') {
      this.pause();
    } else if (this.mode === 'paused') {
      this.resume();
    }
  }

  public update(deltaSec: number): EvaluatedShotState {
    if (deltaSec <= 0 || this.mode !== 'playing') {
      return this.evaluateCurrent();
    }

    const currentShot = this.getCurrentShot();
    const remainingInShot = currentShot.durationSec - this.currentShotLocalTime;

    if (deltaSec < remainingInShot) {
      this.currentShotLocalTime += deltaSec;
      this.elapsedDirectedTime += deltaSec;
    } else {
      // Step to end of shot
      this.elapsedDirectedTime += remainingInShot;
      this.currentShotLocalTime = currentShot.durationSec;
      const leftover = deltaSec - remainingInShot;

      // Check if current shot requires player interaction before advancing
      if (currentShot.interaction && currentShot.interaction !== 'none') {
        this.mode = 'awaitingInteraction';
        this.notifyModeChange();
        return this.evaluateCurrent();
      }

      // Advance to next shot
      if (this.currentShotIndex < this.shots.length - 1) {
        this.currentShotIndex++;
        this.currentShotLocalTime = 0;
        this.notifyShotChange();

        // Recursively consume any leftover delta time
        if (leftover > 0) {
          return this.update(leftover);
        }
      } else {
        // Final shot complete
        this.mode = 'finished';
        this.notifyModeChange();
      }
    }

    return this.evaluateCurrent();
  }

  public completeInteraction(): void {
    if (this.mode === 'awaitingInteraction') {
      if (this.currentShotIndex < this.shots.length - 1) {
        this.currentShotIndex++;
        this.currentShotLocalTime = 0;
        this.mode = 'playing';
        this.notifyModeChange();
        this.notifyShotChange();
      } else {
        this.mode = 'finished';
        this.notifyModeChange();
      }
    }
  }

  public skipToShot(shotId: ShotId): void {
    const targetIdx = this.shots.findIndex((s) => s.id === shotId);
    if (targetIdx !== -1) {
      this.currentShotIndex = targetIdx;
      this.currentShotLocalTime = 0;
      this.mode = 'playing';
      this.notifyModeChange();
      this.notifyShotChange();
    }
  }

  public replay(): void {
    this.currentShotIndex = 0;
    this.currentShotLocalTime = 0;
    this.mode = 'playing';
    this.notifyModeChange();
    this.notifyShotChange();
  }

  public evaluateCurrent(): EvaluatedShotState {
    const currentShot = this.getCurrentShot();
    return ShotEvaluator.evaluate(currentShot, this.currentShotLocalTime);
  }

  public onShotChange(cb: ShotChangeCallback): () => void {
    this.onShotChangeListeners.push(cb);
    return () => {
      this.onShotChangeListeners = this.onShotChangeListeners.filter((fn) => fn !== cb);
    };
  }

  public onModeChange(cb: ModeChangeCallback): () => void {
    this.onModeChangeListeners.push(cb);
    return () => {
      this.onModeChangeListeners = this.onModeChangeListeners.filter((fn) => fn !== cb);
    };
  }

  private notifyShotChange(): void {
    const shot = this.getCurrentShot();
    const idx = this.currentShotIndex;
    for (const cb of this.onShotChangeListeners) {
      cb(shot, idx);
    }
  }

  private notifyModeChange(): void {
    const mode = this.mode;
    for (const cb of this.onModeChangeListeners) {
      cb(mode);
    }
  }
}
