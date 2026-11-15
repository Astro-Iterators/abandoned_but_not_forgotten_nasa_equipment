import * as Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Loading visual feedback
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 45,
      text: 'A carregar Arquivo de Memórias...',
      style: {
        font: '16px monospace',
        color: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xeb6822, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load spritesheets
    this.load.spritesheet('nayla', '/assets/sprites/nayla.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('bip', '/assets/sprites/bip.png', {
      frameWidth: 24,
      frameHeight: 24
    });
    this.load.image('opportunity', '/assets/sprites/opportunity.png');
    this.load.image('blueberries', '/assets/sprites/blueberries.png');
    this.load.spritesheet('mars_tiles', '/assets/tilesets/mars_tiles.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    // Load map json
    this.load.json('opportunity_map', '/assets/maps/opportunity_map.json');
  }

  create(): void {
    // Register animations
    // Nayla walk animations (down: 0-2, left: 3-5, right: 6-8, up: 9-11)
    this.anims.create({
      key: 'nayla_walk_down',
      frames: this.anims.generateFrameNumbers('nayla', { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'nayla_idle_down',
      frames: [{ key: 'nayla', frame: 0 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'nayla_walk_left',
      frames: this.anims.generateFrameNumbers('nayla', { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'nayla_idle_left',
      frames: [{ key: 'nayla', frame: 3 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'nayla_walk_right',
      frames: this.anims.generateFrameNumbers('nayla', { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'nayla_idle_right',
      frames: [{ key: 'nayla', frame: 6 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'nayla_walk_up',
      frames: this.anims.generateFrameNumbers('nayla', { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'nayla_idle_up',
      frames: [{ key: 'nayla', frame: 9 }],
      frameRate: 1
    });

    // Bip hover animation
    this.anims.create({
      key: 'bip_hover',
      frames: this.anims.generateFrameNumbers('bip', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });

    this.scene.start('OpportunityScene');
  }
}
