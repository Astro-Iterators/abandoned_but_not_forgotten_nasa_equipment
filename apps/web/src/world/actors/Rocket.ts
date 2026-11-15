import * as THREE from 'three';

export class Rocket {
  public group: THREE.Group;
  private flameMesh: THREE.Mesh;
  private flameMaterial: THREE.MeshBasicMaterial;
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];
  private isLaunching: boolean = false;
  private launchTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Rocket';

    // 1. Rocket Body Cylinder
    const bodyGeo = new THREE.CylinderGeometry(0.8, 0.9, 5.0, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.2,
      roughness: 0.3,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.position.y = 2.5;
    this.group.add(bodyMesh);
    this.disposables.push(bodyGeo, bodyMat);

    // 2. Capsule / Nosecone (with view window for Bip)
    const coneGeo = new THREE.ConeGeometry(0.8, 2.0, 24);
    const coneMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // vibrant space cyan
      metalness: 0.3,
      roughness: 0.3,
    });
    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.y = 6.0;
    coneMesh.castShadow = true;
    this.group.add(coneMesh);
    this.disposables.push(coneGeo, coneMat);

    // Capsule Window
    const winGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 16);
    const winMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const winMesh = new THREE.Mesh(winGeo, winMat);
    winMesh.position.set(0, 5.2, 0.75);
    winMesh.rotation.x = Math.PI / 2.5;
    this.group.add(winMesh);
    this.disposables.push(winGeo, winMat);

    // 3. Four Aerodynamic Fins
    const finMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.4,
      roughness: 0.5,
    });
    this.disposables.push(finMat);

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const finGeo = new THREE.BoxGeometry(0.1, 1.2, 0.8);
      const finMesh = new THREE.Mesh(finGeo, finMat);
      finMesh.position.set(Math.cos(angle) * 1.0, 0.8, Math.sin(angle) * 1.0);
      finMesh.rotation.y = angle;
      this.group.add(finMesh);
      this.disposables.push(finGeo);
    }

    // 4. Exhaust Engine Bell
    const engineGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.6, 16);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.2,
    });
    const engineMesh = new THREE.Mesh(engineGeo, engineMat);
    engineMesh.position.y = -0.3;
    this.group.add(engineMesh);
    this.disposables.push(engineGeo, engineMat);

    // 5. Thruster Flame Cone
    const flameGeo = new THREE.ConeGeometry(0.65, 2.8, 16);
    flameGeo.translate(0, -1.4, 0);
    this.flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    });
    this.flameMesh = new THREE.Mesh(flameGeo, this.flameMaterial);
    this.flameMesh.position.y = -0.6;
    this.group.add(this.flameMesh);
    this.disposables.push(flameGeo, this.flameMaterial);
  }

  public setThrusterActive(active: boolean, intensity: number = 0.9): void {
    this.isLaunching = active;
    this.flameMaterial.opacity = active ? intensity : 0.0;
  }

  public update(deltaSec: number): void {
    if (this.isLaunching) {
      this.launchTime += deltaSec;
      // Flame flicker
      const scale = 1.0 + Math.sin(this.launchTime * 25) * 0.15;
      this.flameMesh.scale.set(scale, scale * (1 + Math.cos(this.launchTime * 30) * 0.1), scale);
      this.flameMaterial.color.setHex(Math.random() > 0.3 ? 0xf97316 : 0xfacc15);
    }
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose();
    }
  }
}
