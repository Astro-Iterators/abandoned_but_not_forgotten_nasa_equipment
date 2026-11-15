export type CutsceneStatus = 'idle' | 'playing' | 'paused' | 'skipped' | 'completed' | 'fallback_storyboard';

export interface CutsceneOptions {
  durationSeconds: number;
  fallbackSummary: string[];
  onComplete?: () => void;
  onFallback?: (summary: string[]) => void;
}

export class CutsceneDirector {
  private status: CutsceneStatus = 'idle';
  private currentTime = 0;
  private duration = 15;
  private fallbackSummary: string[] = [];
  private completionCallbacks: Array<() => void> = [];
  private hasTriggeredCompletion = false;

  constructor(options?: CutsceneOptions) {
    if (options) {
      this.duration = options.durationSeconds;
      this.fallbackSummary = options.fallbackSummary;
      if (options.onComplete) {
        this.completionCallbacks.push(options.onComplete);
      }
    }
  }

  public getStatus(): CutsceneStatus {
    return this.status;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getFallbackSummary(): string[] {
    return [...this.fallbackSummary];
  }

  public onCompleted(callback: () => void): () => void {
    this.completionCallbacks.push(callback);
    return () => {
      this.completionCallbacks = this.completionCallbacks.filter((cb) => cb !== callback);
    };
  }

  public play(): void {
    if (this.status === 'completed') return;
    this.status = 'playing';
  }

  public pause(): void {
    if (this.status === 'playing') {
      this.status = 'paused';
    }
  }

  public resume(): void {
    if (this.status === 'paused') {
      this.status = 'playing';
    }
  }

  public updateTime(seconds: number): void {
    if (this.status !== 'playing') return;

    this.currentTime = Math.min(seconds, this.duration);
    if (this.currentTime >= this.duration) {
      this.finish();
    }
  }

  public skip(): void {
    if (this.status === 'completed') return;
    this.currentTime = this.duration;
    this.status = 'skipped';
    this.notifyCompletionOnce();
  }

  public triggerFallback(): void {
    this.status = 'fallback_storyboard';
  }

  public replay(): void {
    this.status = 'playing';
    this.currentTime = 0;
    this.hasTriggeredCompletion = false;
  }

  public finish(): void {
    this.status = 'completed';
    this.notifyCompletionOnce();
  }

  private notifyCompletionOnce(): void {
    if (this.hasTriggeredCompletion) return;
    this.hasTriggeredCompletion = true;
    for (const cb of this.completionCallbacks) {
      cb();
    }
  }
}
