import * as Phaser from 'phaser';

export class CinematicScene extends Phaser.Scene {
  private dustEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'CinematicScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Dark Martian dust storm background for cinematic atmosphere
    const bg = this.add.graphics();
    bg.fillStyle(0x1a0f0a, 0.95);
    bg.fillRect(0, 0, width, height);

    this.add.text(width / 2, 40, 'Arquivo de Memórias — Opportunity', {
      font: '18px monospace',
      color: '#ffbb77'
    }).setOrigin(0.5);
  }

  public stopCinematic(): void {
    if (this.dustEmitter) {
      this.dustEmitter.stop();
    }
    this.scene.stop();
  }
}
