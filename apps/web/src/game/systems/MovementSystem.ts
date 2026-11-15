export type Direction = 'down' | 'left' | 'right' | 'up';

export interface Position {
  x: number;
  y: number;
}

export interface BoxCollider {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class MovementSystem {
  private playerPos: Position = { x: 120, y: 300 };
  private bipPos: Position = { x: 80, y: 280 };
  private direction: Direction = 'down';
  private isMoving = false;
  private isPaused = false;
  private speed = 140; // Pixels per second
  private walkPhase = 0;
  private walkTimer = 0;

  private activeKeys = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  private colliders: BoxCollider[] = [];

  constructor(initialPlayer: Position, initialBip: Position, colliders: BoxCollider[] = []) {
    this.playerPos = { ...initialPlayer };
    this.bipPos = { ...initialBip };
    this.colliders = colliders;
  }

  public getPlayerPosition(): Position {
    return { ...this.playerPos };
  }

  public getBipPosition(): Position {
    return { ...this.bipPos };
  }

  public getDirection(): Direction {
    return this.direction;
  }

  public getIsMoving(): boolean {
    return this.isMoving && !this.isPaused;
  }

  public getWalkPhase(): number {
    return this.walkPhase;
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
    if (paused) {
      this.resetKeys();
    }
  }

  public resetKeys(): void {
    this.activeKeys = { up: false, down: false, left: false, right: false };
    this.isMoving = false;
  }

  public handleKeyDown(key: string): void {
    if (this.isPaused) return;

    switch (key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        this.activeKeys.up = true;
        break;
      case 'arrowdown':
      case 's':
        this.activeKeys.down = true;
        break;
      case 'arrowleft':
      case 'a':
        this.activeKeys.left = true;
        break;
      case 'arrowright':
      case 'd':
        this.activeKeys.right = true;
        break;
    }
  }

  public handleKeyUp(key: string): void {
    switch (key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        this.activeKeys.up = false;
        break;
      case 'arrowdown':
      case 's':
        this.activeKeys.down = false;
        break;
      case 'arrowleft':
      case 'a':
        this.activeKeys.left = false;
        break;
      case 'arrowright':
      case 'd':
        this.activeKeys.right = false;
        break;
    }
  }

  public setVirtualVector(vx: number, vy: number): void {
    if (this.isPaused) {
      this.resetKeys();
      return;
    }
    this.activeKeys.left = vx < -0.3;
    this.activeKeys.right = vx > 0.3;
    this.activeKeys.up = vy < -0.3;
    this.activeKeys.down = vy > 0.3;
  }

  public update(deltaSeconds: number): void {
    if (this.isPaused) {
      this.isMoving = false;
      return;
    }

    let dx = 0;
    let dy = 0;

    if (this.activeKeys.left) dx -= 1;
    if (this.activeKeys.right) dx += 1;
    if (this.activeKeys.up) dy -= 1;
    if (this.activeKeys.down) dy += 1;

    if (dx !== 0 && dy !== 0) {
      // Normalize diagonal movement
      dx *= 0.7071;
      dy *= 0.7071;
    }

    if (dx !== 0 || dy !== 0) {
      this.isMoving = true;
      if (Math.abs(dx) > Math.abs(dy)) {
        this.direction = dx > 0 ? 'right' : 'left';
      } else {
        this.direction = dy > 0 ? 'down' : 'up';
      }

      const nextX = this.playerPos.x + dx * this.speed * deltaSeconds;
      const nextY = this.playerPos.y + dy * this.speed * deltaSeconds;

      // Check collision
      if (!this.checkCollision(nextX, this.playerPos.y)) {
        this.playerPos.x = nextX;
      }
      if (!this.checkCollision(this.playerPos.x, nextY)) {
        this.playerPos.y = nextY;
      }

      // Walk cycle animation timer
      this.walkTimer += deltaSeconds;
      if (this.walkTimer > 0.18) {
        this.walkTimer = 0;
        this.walkPhase = (this.walkPhase + 1) % 4; // 0, 1, 2, 3 -> idle, walk1, idle, walk2
      }
    } else {
      this.isMoving = false;
      this.walkPhase = 0;
      this.walkTimer = 0;
    }

    // Companion Bip smooth follow lerp
    const targetBipX = this.playerPos.x + (this.direction === 'left' ? 28 : -28);
    const targetBipY = this.playerPos.y - 20;

    const lerpFactor = Math.min(1, 4 * deltaSeconds);
    this.bipPos.x += (targetBipX - this.bipPos.x) * lerpFactor;
    this.bipPos.y += (targetBipY - this.bipPos.y) * lerpFactor;
  }

  private checkCollision(x: number, y: number): boolean {
    const playerRadius = 12;
    for (const c of this.colliders) {
      if (
        x + playerRadius > c.x &&
        x - playerRadius < c.x + c.width &&
        y + playerRadius > c.y &&
        y - playerRadius < c.y + c.height
      ) {
        return true;
      }
    }
    return false;
  }
}
