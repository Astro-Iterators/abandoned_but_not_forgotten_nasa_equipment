import * as Phaser from 'phaser';
import { MovementSystem } from '../systems/MovementSystem';
import { InteractionSystem } from '../systems/InteractionSystem';

export interface SceneBridge {
  onClueInteract: () => void;
  onRoverInteract: () => void;
  onTargetChange: (prompt: string | null) => void;
  onStepSound: () => void;
}

export class OpportunityScene extends Phaser.Scene {
  private playerSprite!: Phaser.Physics.Arcade.Sprite;
  private bipSprite!: Phaser.GameObjects.Sprite;
  private roverSprite!: Phaser.GameObjects.Sprite;
  private clueSprite!: Phaser.GameObjects.Sprite;

  private movementSystem!: MovementSystem;
  private interactionSystem!: InteractionSystem;
  private bridge?: SceneBridge;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private stepTimer = 0;

  constructor() {
    super({ key: 'OpportunityScene' });
  }

  public setBridge(bridge: SceneBridge): void {
    this.bridge = bridge;
  }

  public getMovementSystem(): MovementSystem {
    return this.movementSystem;
  }

  create(): void {
    const mapData = this.cache.json.get('opportunity_map') || {
      width: 25,
      height: 20,
      tilewidth: 32,
      tileheight: 32,
      pixelWidth: 800,
      pixelHeight: 640,
      spawns: {
        player: { x: 120, y: 300 },
        bip: { x: 80, y: 280 },
        clue: { x: 280, y: 380, radius: 45 },
        rover: { x: 620, y: 280, radius: 60 }
      },
      colliders: [
        { x: 0, y: 0, width: 800, height: 32 },
        { x: 0, y: 608, width: 800, height: 32 },
        { x: 0, y: 0, width: 32, height: 640 },
        { x: 768, y: 0, width: 32, height: 640 },
        { x: 400, y: 80, width: 64, height: 128 },
        { x: 420, y: 420, width: 96, height: 64 },
        { x: 180, y: 140, width: 80, height: 64 }
      ]
    };

    // Render Martian ground tiles across 25x20 grid
    for (let ty = 0; ty < mapData.height; ty++) {
      for (let tx = 0; tx < mapData.width; tx++) {
        let frame = 0;
        // Border boundaries
        if (tx === 0 || tx === mapData.width - 1 || ty === 0 || ty === mapData.height - 1) {
          frame = 3;
        } else if ((tx * 3 + ty * 7) % 11 === 0) {
          frame = 1; // Pebbles & hematite flecks
        } else if (tx > 8 && tx < 18 && ty === 10) {
          frame = 2; // Rover tracks in sand
        }
        this.add.sprite(tx * 32 + 16, ty * 32 + 16, 'mars_tiles', frame);
      }
    }

    // Render rocks / colliders visually
    for (const c of mapData.colliders) {
      if (c.width > 32 && c.height > 32) {
        const rockGfx = this.add.graphics();
        rockGfx.fillStyle(0x692d19, 0.85);
        rockGfx.fillRoundedRect(c.x, c.y, c.width, c.height, 8);
        rockGfx.lineStyle(2, 0x9e4324, 1);
        rockGfx.strokeRoundedRect(c.x, c.y, c.width, c.height, 8);
      }
    }

    // Add Blueberries Clue Outcrop
    this.clueSprite = this.add.sprite(mapData.spawns.clue.x, mapData.spawns.clue.y, 'blueberries');
    this.clueSprite.setOrigin(0.5, 0.5);
    // Subtle pulsing animation on the clue
    this.tweens.add({
      targets: this.clueSprite,
      scaleX: 1.15,
      scaleY: 1.15,
      yoyo: true,
      repeat: -1,
      duration: 1200
    });

    // Add Opportunity Rover Sprite
    this.roverSprite = this.add.sprite(mapData.spawns.rover.x, mapData.spawns.rover.y, 'opportunity');
    this.roverSprite.setOrigin(0.5, 0.5);

    // Rover plaque indicator
    const roverLabel = this.add.text(mapData.spawns.rover.x, mapData.spawns.rover.y - 36, 'Opportunity (MER-B)', {
      font: '12px sans-serif',
      color: '#ffddbb',
      backgroundColor: '#2a1a14',
      padding: { x: 4, y: 2 }
    });
    roverLabel.setOrigin(0.5, 0.5);

    // Initialize Systems
    this.movementSystem = new MovementSystem(mapData.spawns.player, mapData.spawns.bip, mapData.colliders);

    this.interactionSystem = new InteractionSystem([
      {
        id: 'clue',
        name: 'Afloramento de Hematite ("Mirtilos")',
        x: mapData.spawns.clue.x,
        y: mapData.spawns.clue.y,
        radius: mapData.spawns.clue.radius || 45,
        actionPrompt: 'Pressiona [E] ou toca aqui para examinar a pista'
      },
      {
        id: 'rover',
        name: 'Rover Opportunity',
        x: mapData.spawns.rover.x,
        y: mapData.spawns.rover.y,
        radius: mapData.spawns.rover.radius || 60,
        actionPrompt: 'Pressiona [E] ou toca aqui para ouvir a memória do Opportunity'
      }
    ]);

    this.interactionSystem.onInteract((targetId: string) => {
      if (targetId === 'clue' && this.bridge) {
        this.bridge.onClueInteract();
      } else if (targetId === 'rover' && this.bridge) {
        this.bridge.onRoverInteract();
      }
    });

    // Add Player (Nayla) and Bip sprites
    this.playerSprite = this.physics.add.sprite(mapData.spawns.player.x, mapData.spawns.player.y, 'nayla', 0);
    this.playerSprite.setCollideWorldBounds(true);
    this.playerSprite.setSize(20, 24);
    this.playerSprite.setOffset(6, 8);

    this.bipSprite = this.add.sprite(mapData.spawns.bip.x, mapData.spawns.bip.y, 'bip');
    this.bipSprite.play('bip_hover');

    // Camera setup
    this.cameras.main.setBounds(0, 0, mapData.pixelWidth, mapData.pixelHeight);
    this.cameras.main.startFollow(this.playerSprite, true, 0.08, 0.08);

    // Keyboard inputs
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
      };
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

      this.interactKey.on('down', () => {
        this.interactionSystem.triggerInteract();
      });

      // Space and Enter also trigger interact
      const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      spaceKey.on('down', () => {
        this.interactionSystem.triggerInteract();
      });

      // Window blur cancels inputs
      window.addEventListener('blur', () => {
        this.movementSystem.resetKeys();
      });
    }
  }

  update(_time: number, delta: number): void {
    const deltaSeconds = delta / 1000;

    // Read keyboard state into movementSystem
    if (this.cursors && this.wasdKeys) {
      const up = this.cursors.up.isDown || this.wasdKeys.w.isDown;
      const down = this.cursors.down.isDown || this.wasdKeys.s.isDown;
      const left = this.cursors.left.isDown || this.wasdKeys.a.isDown;
      const right = this.cursors.right.isDown || this.wasdKeys.d.isDown;

      if (up) this.movementSystem.handleKeyDown('w');
      else this.movementSystem.handleKeyUp('w');

      if (down) this.movementSystem.handleKeyDown('s');
      else this.movementSystem.handleKeyUp('s');

      if (left) this.movementSystem.handleKeyDown('a');
      else this.movementSystem.handleKeyUp('a');

      if (right) this.movementSystem.handleKeyDown('d');
      else this.movementSystem.handleKeyUp('d');
    }

    this.movementSystem.update(deltaSeconds);

    const pos = this.movementSystem.getPlayerPosition();
    this.playerSprite.setPosition(pos.x, pos.y);

    const bipPos = this.movementSystem.getBipPosition();
    this.bipSprite.setPosition(bipPos.x, bipPos.y);

    // Update animations
    const isMoving = this.movementSystem.getIsMoving();
    const dir = this.movementSystem.getDirection();
    const animKey = isMoving ? `nayla_walk_${dir}` : `nayla_idle_${dir}`;
    if (this.playerSprite.anims.currentAnim?.key !== animKey) {
      this.playerSprite.play(animKey);
    }

    // Footstep audio cues
    if (isMoving) {
      this.stepTimer += deltaSeconds;
      if (this.stepTimer > 0.35) {
        this.stepTimer = 0;
        if (this.bridge) {
          this.bridge.onStepSound();
        }
      }
    } else {
      this.stepTimer = 0;
    }

    // Check interactive targets
    const activeTarget = this.interactionSystem.update(pos);
    if (this.bridge) {
      this.bridge.onTargetChange(activeTarget ? activeTarget.actionPrompt : null);
    }
  }

  public triggerInteract(): boolean {
    return this.interactionSystem.triggerInteract();
  }
}
