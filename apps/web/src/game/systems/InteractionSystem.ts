import type { Position } from './MovementSystem';

export interface InteractiveTarget {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  actionPrompt: string;
}

export class InteractionSystem {
  private targets: InteractiveTarget[] = [];
  private activeTarget: InteractiveTarget | null = null;
  private onInteractCallback: ((targetId: string) => void) | null = null;

  constructor(targets: InteractiveTarget[]) {
    this.targets = targets;
  }

  public getActiveTarget(): InteractiveTarget | null {
    return this.activeTarget;
  }

  public onInteract(callback: (targetId: string) => void): void {
    this.onInteractCallback = callback;
  }

  public update(playerPos: Position): InteractiveTarget | null {
    let closest: InteractiveTarget | null = null;
    let minDistance = Infinity;

    for (const target of this.targets) {
      const dx = playerPos.x - target.x;
      const dy = playerPos.y - target.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= target.radius && dist < minDistance) {
        minDistance = dist;
        closest = target;
      }
    }

    this.activeTarget = closest;
    return closest;
  }

  public triggerInteract(): boolean {
    if (this.activeTarget && this.onInteractCallback) {
      this.onInteractCallback(this.activeTarget.id);
      return true;
    }
    return false;
  }
}
