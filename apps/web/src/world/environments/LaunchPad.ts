import * as THREE from 'three';

export class LaunchPad {
  public group: THREE.Group;
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'LaunchPad';

    // 1. Concrete Launch Pad Base (Clean architectural concrete gray)
    const padGeo = new THREE.CylinderGeometry(7.5, 8.5, 1.2, 32);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // bright concrete gray
      roughness: 0.7,
      metalness: 0.15,
    });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.y = -0.6;
    padMesh.receiveShadow = true;
    this.group.add(padMesh);
    this.disposables.push(padGeo, padMat);

    // Blast trench cutout ring
    const ringGeo = new THREE.TorusGeometry(3.2, 0.2, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.02;
    this.group.add(ringMesh);
    this.disposables.push(ringGeo, ringMat);

    // 2. Umbilical Service Tower (Vibrant red gantry with bright yellow accents)
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // vibrant orange/amber gantry
      metalness: 0.4,
      roughness: 0.5,
    });
    this.disposables.push(towerMat);

    // Tower main columns
    const colGeo = new THREE.BoxGeometry(0.32, 16.0, 0.32);
    this.disposables.push(colGeo);
    const colPositions = [
      [-2.4, 8.0, -1.8],
      [-1.4, 8.0, -1.8],
      [-2.4, 8.0, -2.8],
      [-1.4, 8.0, -2.8],
    ];
    for (const pos of colPositions) {
      const col = new THREE.Mesh(colGeo, towerMat);
      col.position.set(pos[0], pos[1], pos[2]);
      col.castShadow = true;
      this.group.add(col);
    }

    // Horizontal catwalk arms
    const armGeo = new THREE.BoxGeometry(1.6, 0.2, 1.2);
    this.disposables.push(armGeo);
    for (let h = 3; h <= 14; h += 3) {
      const arm = new THREE.Mesh(armGeo, towerMat);
      arm.position.set(-1.8, h, -1.5);
      this.group.add(arm);
    }

    // 3. Bright Launch Spotlights
    const spot1 = new THREE.SpotLight(0xffedd5, 12.0, 45, Math.PI / 4, 0.35, 1.0);
    spot1.position.set(7, 1.5, 7);
    spot1.target.position.set(0, 8, 0);
    this.group.add(spot1);
    this.group.add(spot1.target);

    const spot2 = new THREE.SpotLight(0x38bdf8, 8.0, 45, Math.PI / 3.5, 0.35, 1.0);
    spot2.position.set(-6, 1.5, 6);
    spot2.target.position.set(0, 10, 0);
    this.group.add(spot2);
    this.group.add(spot2.target);

    // Ambient fill light for pad
    const ambientLight = new THREE.AmbientLight(0x475569, 1.0);
    this.group.add(ambientLight);

    // Luminous ground steam mist layer
    const mistGeo = new THREE.PlaneGeometry(26, 26);
    const mistMat = new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mistMesh = new THREE.Mesh(mistGeo, mistMat);
    mistMesh.rotation.x = -Math.PI / 2;
    mistMesh.position.y = 0.15;
    this.group.add(mistMesh);
    this.disposables.push(mistGeo, mistMat);

    // Night sky with stars
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = Math.random() * 40 + 5;
      starPositions[i + 2] = (Math.random() - 0.5) * 80;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.55 });
    const stars = new THREE.Points(starsGeo, starsMat);
    this.group.add(stars);
    this.disposables.push(starsGeo, starsMat);
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose();
    }
  }
}
