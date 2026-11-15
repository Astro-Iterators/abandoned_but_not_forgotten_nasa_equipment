import * as THREE from 'three';

export class SpaceTransit {
  public group: THREE.Group;
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];
  private earthMesh: THREE.Mesh;
  private moonMesh: THREE.Mesh;
  private marsMesh: THREE.Mesh;
  private marsGroup: THREE.Group;
  private rotTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'SpaceTransit';

    // 1. Vast Luminous Starfield
    const starCount = 1000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 140;
      starPos[i + 1] = (Math.random() - 0.5) * 140;
      starPos[i + 2] = (Math.random() - 0.5) * 140;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
    const stars = new THREE.Points(starGeo, starMat);
    this.group.add(stars);
    this.disposables.push(starGeo, starMat);

    // 2. Earth Sphere (Luminous blue planet with clouds)
    const earthGeo = new THREE.SphereGeometry(3.6, 32, 24);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // bright vibrant ocean blue
      roughness: 0.4,
      metalness: 0.1,
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthMesh.position.set(-9, 4, -20);
    this.group.add(this.earthMesh);
    this.disposables.push(earthGeo, earthMat);

    // Earth Atmosphere Rim Glow
    const earthGlowGeo = new THREE.SphereGeometry(3.78, 32, 24);
    const earthGlowMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide,
    });
    const earthGlow = new THREE.Mesh(earthGlowGeo, earthGlowMat);
    this.earthMesh.add(earthGlow);
    this.disposables.push(earthGlowGeo, earthGlowMat);

    // 3. Moon Sphere (Clean silvery lunar gray)
    const moonGeo = new THREE.SphereGeometry(2.1, 32, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // bright silvery gray
      roughness: 0.75,
      metalness: 0.1,
    });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.position.set(5, -1, -12);
    this.group.add(this.moonMesh);
    this.disposables.push(moonGeo, moonMat);

    // 4. Mars (Red Planet for S12 epilogue — bright cheerful rust hues)
    this.marsGroup = new THREE.Group();
    this.marsGroup.position.set(0.6, 1.2, -3.5);
    this.marsGroup.visible = false;
    this.group.add(this.marsGroup);

    const marsGeo = new THREE.SphereGeometry(1.25, 32, 24);
    const marsMat = new THREE.MeshStandardMaterial({
      color: 0xea580c, // vivid warm rust-orange
      roughness: 0.6,
      metalness: 0.2,
    });
    this.marsMesh = new THREE.Mesh(marsGeo, marsMat);
    this.marsGroup.add(this.marsMesh);
    this.disposables.push(marsGeo, marsMat);

    // Mars atmospheric haze glow
    const marsHazeGeo = new THREE.SphereGeometry(1.32, 32, 24);
    const marsHazeMat = new THREE.MeshBasicMaterial({
      color: 0xfdba74,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide,
    });
    const marsHaze = new THREE.Mesh(marsHazeGeo, marsHazeMat);
    this.marsGroup.add(marsHaze);
    this.disposables.push(marsHazeGeo, marsHazeMat);

    // Holographic Orbit Ring around Mars
    const orbitGeo = new THREE.TorusGeometry(1.85, 0.025, 8, 48);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 3;
    this.marsGroup.add(orbitMesh);
    this.disposables.push(orbitGeo, orbitMat);

    // 5. Cockpit Cabin Frame (Light metallic frame with cheerful indicators)
    const frameGeo = new THREE.TorusGeometry(2.4, 0.14, 12, 32);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.7,
      roughness: 0.3,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, 0.6, 2.8);
    this.group.add(frameMesh);
    this.disposables.push(frameGeo, frameMat);

    // Sun directional lighting in space (Bright warm key)
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.0);
    sunLight.position.set(15, 8, 10);
    this.group.add(sunLight);

    // Generous ambient light so space isn't pitch black
    const ambientLight = new THREE.AmbientLight(0x334155, 0.85);
    this.group.add(ambientLight);
  }

  public setMarsVisible(visible: boolean): void {
    this.marsGroup.visible = visible;
    this.earthMesh.visible = !visible;
    this.moonMesh.visible = !visible;
  }

  public update(deltaSec: number): void {
    this.rotTime += deltaSec;
    this.earthMesh.rotation.y = this.rotTime * 0.05;
    this.moonMesh.rotation.y = this.rotTime * 0.02;
    this.marsMesh.rotation.y = this.rotTime * 0.08;
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose();
    }
  }
}
