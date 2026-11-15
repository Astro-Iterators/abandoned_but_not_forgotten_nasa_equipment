import type { GameState } from './contracts';

export type StateChangeCallback = (from: GameState, to: GameState) => void;

export class StateManager {
  private currentState: GameState = 'menu';
  private previousState: GameState = 'menu';
  private listeners: StateChangeCallback[] = [];

  constructor(initialState: GameState = 'menu') {
    this.currentState = initialState;
    this.previousState = initialState;
  }

  public getState(): GameState {
    return this.currentState;
  }

  public getPreviousState(): GameState {
    return this.previousState;
  }

  public onStateChange(callback: StateChangeCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public canTransition(to: GameState, context?: { puzzleSolved?: boolean; roverContacted?: boolean }): boolean {
    if (to === this.currentState) return false;

    // Direct transition to complete is strictly forbidden unless the puzzle is solved
    if (to === 'complete') {
      if (!context?.puzzleSolved || !context?.roverContacted) {
        return false;
      }
    }

    switch (this.currentState) {
      case 'menu':
        return to === 'exploration';
      case 'exploration':
        return ['dialogue', 'cinematic', 'puzzle', 'journal', 'paused'].includes(to);
      case 'dialogue':
        return ['exploration', 'cinematic', 'puzzle', 'paused'].includes(to);
      case 'cinematic':
        return ['exploration', 'dialogue', 'puzzle', 'paused'].includes(to);
      case 'puzzle':
        return ['exploration', 'complete', 'paused'].includes(to);
      case 'journal':
        return ['exploration', 'paused'].includes(to);
      case 'complete':
        return ['menu', 'journal', 'cinematic'].includes(to);
      case 'paused':
        return true; // Can resume back to any valid state
      default:
        return false;
    }
  }

  public transition(to: GameState, context?: { puzzleSolved?: boolean; roverContacted?: boolean }): boolean {
    if (!this.canTransition(to, context)) {
      return false;
    }

    const from = this.currentState;
    this.previousState = from;
    this.currentState = to;

    for (const listener of this.listeners) {
      listener(from, to);
    }
    return true;
  }

  public pause(): boolean {
    if (this.currentState !== 'paused') {
      return this.transition('paused');
    }
    return false;
  }

  public resume(): boolean {
    if (this.currentState === 'paused') {
      const target = this.previousState !== 'paused' ? this.previousState : 'exploration';
      const from = this.currentState;
      this.currentState = target;
      for (const listener of this.listeners) {
        listener(from, target);
      }
      return true;
    }
    return false;
  }

  public reset(): void {
    const from = this.currentState;
    this.currentState = 'menu';
    this.previousState = 'menu';
    for (const listener of this.listeners) {
      listener(from, 'menu');
    }
  }
}
