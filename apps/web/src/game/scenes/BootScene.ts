import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Basic loading background setup if needed
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}
