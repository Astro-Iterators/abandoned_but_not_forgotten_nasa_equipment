import type { SaveStateData } from './contracts';

const STORAGE_KEY = 'ainda_estou_aqui_progress_v1';
const CURRENT_VERSION = 1;

export class ProgressManager {
  private data: SaveStateData;
  private storageAvailable = true;

  constructor() {
    this.data = this.getDefaultState();
    this.load();
  }

  public getDefaultState(): SaveStateData {
    return {
      version: CURRENT_VERSION,
      clueDiscovered: false,
      roverContacted: false,
      cinematicViewed: false,
      puzzleSolved: false,
      episodeCompleted: false,
      audioMuted: false,
      updatedAt: new Date().toISOString()
    };
  }

  public getData(): Readonly<SaveStateData> {
    return { ...this.data };
  }

  public setClueDiscovered(discovered = true): void {
    this.data.clueDiscovered = discovered;
    this.save();
  }

  public setRoverContacted(contacted = true): void {
    this.data.roverContacted = contacted;
    this.save();
  }

  public setCinematicViewed(viewed = true): void {
    this.data.cinematicViewed = viewed;
    this.save();
  }

  public setPuzzleSolved(solved = true): void {
    this.data.puzzleSolved = solved;
    this.save();
  }

  public completeEpisode(): boolean {
    if (!this.data.puzzleSolved || !this.data.roverContacted) {
      return false;
    }
    this.data.episodeCompleted = true;
    this.save();
    return true;
  }

  public setAudioMuted(muted: boolean): void {
    this.data.audioMuted = muted;
    this.save();
  }

  public isReadyToComplete(): boolean {
    return this.data.puzzleSolved && this.data.roverContacted;
  }

  public isCompleted(): boolean {
    return this.data.episodeCompleted;
  }

  public reset(): void {
    this.data = this.getDefaultState();
    this.save();
  }

  public save(): boolean {
    this.data.updatedAt = new Date().toISOString();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        return true;
      }
    } catch {
      // Storage unavailable or permission denied, fallback gracefully in-memory
      this.storageAvailable = false;
    }
    return false;
  }

  public load(): boolean {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.version === CURRENT_VERSION) {
            this.data = {
              version: CURRENT_VERSION,
              clueDiscovered: Boolean(parsed.clueDiscovered),
              roverContacted: Boolean(parsed.roverContacted),
              cinematicViewed: Boolean(parsed.cinematicViewed),
              puzzleSolved: Boolean(parsed.puzzleSolved),
              episodeCompleted: Boolean(parsed.episodeCompleted),
              audioMuted: Boolean(parsed.audioMuted),
              updatedAt: parsed.updatedAt || new Date().toISOString()
            };
            return true;
          }
        }
      }
    } catch {
      // Corrupted storage data, reset gracefully
      this.data = this.getDefaultState();
    }
    return false;
  }

  public isStorageHealthy(): boolean {
    return this.storageAvailable;
  }
}
