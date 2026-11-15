import * as THREE from 'three';
import { Ranger7 } from '../actors/Ranger7';

export class MemoryStage {
  public group: THREE.Group;
  public ranger7: Ranger7;
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];
  private moonTarget: THREE.Mesh;
  private earthDepart: THREE.Mesh;
  private memoryGrid: THREE.GridHelper;
  private scanlineRing: THREE.Mesh;
  private mosaicCards: THREE.InstancedMesh;
  private stageTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'MemoryStage';

    // 1. Ranger 7 historical spacecraft instance
    this.ranger7 = new Ranger7();
    this.ranger7.group.position.set(0, 1.2, 0);
    this.group.add(this.ranger7.group);

    // 2. Vintage Reconstructed Memory Stage Lighting (Warm amber / documentary tone)
    const memoryKeyLight = new THREE.DirectionalLight(0xfef08a, 2.2);
    memoryKeyLight.position.set(5, 8, 5);
    this.group.add(memoryKeyLight);

    const memoryFillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    memoryFillLight.position.set(-6, -2, -4);
    this.group.add(memoryFillLight);

    const memoryAmbient = new THREE.AmbientLight(0x18181b, 0.7);
    this.group.add(memoryAmbient);

    // 3. Coordinate archive grid helper below
    this.memoryGrid = new THREE.GridHelper(30, 30, 0x0284c7, 0x1e293b);
    this.memoryGrid.position.y = -1.5;
    this.group.add(this.memoryGrid);

    // 4. Target Moon Sphere (for S08 and S10 approach)
    const moonGeo = new THREE.SphereGeometry(6.0, 32, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.9,
    });
    this.moonTarget = new THREE.Mesh(moonGeo, moonMat);
    this.moonTarget.position.set(0, 0, -18);
    this.group.add(this.moonTarget);
    this.disposables.push(moonGeo, moonMat);

    // 5. Earth in distance for S06 (1964 departure)
    const earthGeo = new THREE.SphereGeometry(2.0, 24, 20);
    const earthMat = new THREE.MeshBasicMaterial({ color: 0x2563eb });
    this.earthDepart = new THREE.Mesh(earthGeo, earthMat);
    this.earthDepart.position.set(-8, 6, -14);
    this.group.add(this.earthDepart);
    this.disposables.push(earthGeo, earthMat);

    // 6. Photographic Transmission Scanline Ring (simulating TV Vidicon lines)
    const scanGeo = new THREE.TorusGeometry(3.5, 0.04, 8, 48);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });
    this.scanlineRing = new THREE.Mesh(scanGeo, scanMat);
    this.scanlineRing.rotation.x = Math.PI / 2;
    this.group.add(this.scanlineRing);
    this.disposables.push(scanGeo, scanMat);

    // 7. Mosaic Wall of Transmitted Images (representing the >4,000 photos for S10)
    const cardCount = 64;
    const cardGeo = new THREE.PlaneGeometry(0.6, 0.45);
    const cardMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    this.mosaicCards = new THREE.InstancedMesh(cardGeo, cardMat, cardCount);
    const dummy = new THREE.Object3D();
    let idx = 0;
    for (let r = -4; r < 4; r++) {
      for (let c = -4; c < 4; c++) {
        dummy.position.set(c * 0.9, r * 0.7 + 1.2, -6 + Math.random() * 0.4);
        dummy.rotation.z = (Math.random() - 0.5) * 0.1;
        dummy.updateMatrix();
        this.mosaicCards.setMatrixAt(idx++, dummy.matrix);
      }
    }
    this.mosaicCards.instanceMatrix.needsUpdate = true;
    this.group.add(this.mosaicCards);
    this.disposables.push(cardGeo, cardMat);
  }

  public configureFlashback(shotId: string, localTime: number, durationSec: number): void {
    const progress = durationSec > 0 ? localTime / durationSec : 0;

    if (shotId === 'S06') {
      // 1964 Departure
      this.earthDepart.visible = true;
      this.moonTarget.visible = false;
      this.scanlineRing.visible = false;
      (this.mosaicCards.material as THREE.MeshBasicMaterial).opacity = 0.0;

      // Gentle tumble/attitude orientation
      this.ranger7.group.position.set(0, 1.2, 0);
      this.ranger7.group.rotation.set(0.1, localTime * 0.08, -0.05);
    } else if (shotId === 'S08') {
      // Rapid Lunar Approach & Transmission
      this.earthDepart.visible = false;
      this.moonTarget.visible = true;
      this.scanlineRing.visible = true;
      (this.mosaicCards.material as THREE.MeshBasicMaterial).opacity = 0.0;

      // Moon grows in view
      const moonZ = -22 + progress * 14;
      this.moonTarget.position.set(0, -2, moonZ);
      this.ranger7.group.position.set(0, 1.0, -1.0 + progress * 0.5);
      this.ranger7.group.rotation.set(-0.2, 0.1, 0);
    } else if (shotId === 'S10') {
      // Impact & Knowledge Preserved Mosaic
      this.earthDepart.visible = false;
      this.moonTarget.visible = true;
      this.scanlineRing.visible = true;

      // In second half of S10, mosaic illuminates
      const mosaicOpacity = progress > 0.4 ? Math.min(0.85, (progress - 0.4) * 2.5) : 0.0;
      (this.mosaicCards.material as THREE.MeshBasicMaterial).opacity = mosaicOpacity;

      if (progress > 0.35) {
        // Spacecraft has impacted; target surface is close and still
        this.ranger7.group.visible = false;
      } else {
        this.ranger7.group.visible = true;
        this.ranger7.group.position.set(0, 0.8 - progress * 1.5, -progress * 3.0);
      }
    }
  }

  public update(deltaSec: number): void {
    this.stageTime += deltaSec;
    this.scanlineRing.position.y = Math.sin(this.stageTime * 2) * 0.8 + 1.2;
  }

  public dispose(): void {
    this.ranger7.dispose();
    for (const item of this.disposables) {
      item.dispose();
    }
  }
}
