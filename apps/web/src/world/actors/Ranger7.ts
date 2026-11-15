import * as THREE from 'three';

export class Ranger7 {
  public group: THREE.Group;
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Ranger7';

    // 1. Hexagonal Base Bus
    const busGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 6);
    const busMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8, // metallic silver/aluminum
      metalness: 0.7,
      roughness: 0.3,
    });
    const busMesh = new THREE.Mesh(busGeo, busMat);
    busMesh.castShadow = true;
    busMesh.receiveShadow = true;
    this.group.add(busMesh);
    this.disposables.push(busGeo, busMat);

    // 2. Conical Vidicon Television Camera Tower (F and P channels)
    const towerGeo = new THREE.CylinderGeometry(0.35, 0.75, 1.4, 16);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5, // white thermal shroud
      metalness: 0.2,
      roughness: 0.4,
    });
    const towerMesh = new THREE.Mesh(towerGeo, towerMat);
    towerMesh.position.y = 0.95;
    towerMesh.castShadow = true;
    this.group.add(towerMesh);
    this.disposables.push(towerGeo, towerMat);

    // 3. Camera Apertures (6 vidicon TV cameras: 2 full-scan F, 4 partial-scan P)
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    this.disposables.push(lensMat);
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const lensGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12);
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.position.set(Math.cos(angle) * 0.45, 0.9 + (i % 2) * 0.25, Math.sin(angle) * 0.45);
      lensMesh.rotation.z = Math.PI / 2;
      this.group.add(lensMesh);
      this.disposables.push(lensGeo);
    }

    // 4. Omnidirectional Antenna Mast on top
    const mastGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.8, 8);
    const mastMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.8 });
    const mastMesh = new THREE.Mesh(mastGeo, mastMat);
    mastMesh.position.y = 1.95;
    this.group.add(mastMesh);
    this.disposables.push(mastGeo, mastMat);

    const omniHeadGeo = new THREE.ConeGeometry(0.12, 0.25, 8);
    const omniHeadMesh = new THREE.Mesh(omniHeadGeo, mastMat);
    omniHeadMesh.position.y = 2.4;
    this.group.add(omniHeadMesh);
    this.disposables.push(omniHeadGeo);

    // 5. Two Solar Arrays (deployed wings)
    const panelGeo = new THREE.BoxGeometry(1.6, 0.04, 0.8);
    const panelFaceMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // deep solar cell blue
      metalness: 0.6,
      roughness: 0.2,
    });
    const panelBackMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // gold thermal kapton backing
      metalness: 0.8,
      roughness: 0.3,
    });

    // Panel materials (face, back, edges)
    const panelMaterials = [
      busMat,
      busMat,
      panelFaceMat,
      panelBackMat,
      busMat,
      busMat,
    ];
    this.disposables.push(panelGeo, panelFaceMat, panelBackMat);

    const leftPanel = new THREE.Mesh(panelGeo, panelMaterials);
    leftPanel.position.set(-1.6, 0, 0);
    leftPanel.castShadow = true;
    this.group.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeo, panelMaterials);
    rightPanel.position.set(1.6, 0, 0);
    rightPanel.castShadow = true;
    this.group.add(rightPanel);

    // 6. High-gain Parabolic Dish Antenna
    const dishGeo = new THREE.SphereGeometry(0.45, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      metalness: 0.3,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const dishMesh = new THREE.Mesh(dishGeo, dishMat);
    dishMesh.position.set(0, -0.4, 0.5);
    dishMesh.rotation.x = Math.PI / 3;
    this.group.add(dishMesh);
    this.disposables.push(dishGeo, dishMat);
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose();
    }
  }
}
