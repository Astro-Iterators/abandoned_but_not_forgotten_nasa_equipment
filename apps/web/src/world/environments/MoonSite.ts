import * as THREE from 'three';

export class MoonSite {
  public group: THREE.Group;
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];
  public debrisAMesh: THREE.Group;
  public debrisBMesh: THREE.Group;
  public debrisCMesh: THREE.Group;
  private ringAMesh: THREE.Mesh;
  private ringBMesh: THREE.Mesh;
  private ringCMesh: THREE.Mesh;
  private pulseTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'MoonSite';

    // 1. Lunar Terrain (Mare Cognitum) — Bright, luminous silvery lunar gray
    const terrainGeo = new THREE.PlaneGeometry(40, 40, 56, 56);
    // Add procedural rolling hills and soft crater depressions
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 0.18) * 0.45 +
        Math.cos(y * 0.15) * 0.4 +
        Math.sin((x + y) * 0.28) * 0.18;
      pos.setZ(i, z);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa, // clear bright silvery lunar gray (cinzento lunar claro e luminoso)
      roughness: 0.8,
      metalness: 0.08,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = 0;
    terrain.receiveShadow = true;
    this.group.add(terrain);
    this.disposables.push(terrainGeo, terrainMat);

    // 2. Beautiful Earth in the Lunar Sky (reflecting blue light)
    const earthGeo = new THREE.SphereGeometry(1.6, 28, 24);
    const earthMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(-14, 11, -22);
    this.group.add(earth);
    this.disposables.push(earthGeo, earthMat);

    // Starfield in lunar sky with varied bright stars
    const starCount = 550;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 80;
      starPos[i + 1] = Math.random() * 40 + 2;
      starPos[i + 2] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.55 });
    const stars = new THREE.Points(starGeo, starMat);
    this.group.add(stars);
    this.disposables.push(starGeo, starMat);

    // 3. Debris A: Lens Mount Assembly (Vestígio A) — Gleaming silver and gold
    this.debrisAMesh = new THREE.Group();
    this.debrisAMesh.position.set(0.8, 0.28, -2.5);
    this.group.add(this.debrisAMesh);

    const lensHousingGeo = new THREE.CylinderGeometry(0.24, 0.3, 0.38, 20);
    const lensHousingMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // bright metallic silver
      metalness: 0.85,
      roughness: 0.2,
    });
    const lensHousing = new THREE.Mesh(lensHousingGeo, lensHousingMat);
    lensHousing.rotation.z = Math.PI / 4;
    lensHousing.castShadow = true;
    this.debrisAMesh.add(lensHousing);
    this.disposables.push(lensHousingGeo, lensHousingMat);

    const glassGeo = new THREE.CircleGeometry(0.2, 20);
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0.13, 0.13, 0);
    glass.rotation.y = Math.PI / 2;
    this.debrisAMesh.add(glass);
    this.disposables.push(glassGeo, glassMat);

    // Interactive glowing ring for Debris A
    const ringGeo = new THREE.RingGeometry(0.42, 0.54, 32);
    const ringMatA = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    this.ringAMesh = new THREE.Mesh(ringGeo, ringMatA);
    this.ringAMesh.rotation.x = -Math.PI / 2;
    this.ringAMesh.position.set(0.8, 0.06, -2.5);
    this.group.add(this.ringAMesh);
    this.disposables.push(ringGeo, ringMatA);

    // 4. Debris B: Impact Mark / Broken metal (Vestígio B)
    this.debrisBMesh = new THREE.Group();
    this.debrisBMesh.position.set(-0.5, 0.12, -5.0);
    this.group.add(this.debrisBMesh);

    const craterRingGeo = new THREE.TorusGeometry(0.85, 0.18, 12, 28);
    const craterRingMat = new THREE.MeshStandardMaterial({
      color: 0x71717a, // defined gray crater rim
      roughness: 0.85,
    });
    const craterRing = new THREE.Mesh(craterRingGeo, craterRingMat);
    craterRing.rotation.x = Math.PI / 2;
    this.debrisBMesh.add(craterRing);
    this.disposables.push(craterRingGeo, craterRingMat);

    // Broken metal struts in bright aluminum
    const strutGeo = new THREE.BoxGeometry(0.09, 0.65, 0.09);
    const strutMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.8, roughness: 0.2 });
    const strut1 = new THREE.Mesh(strutGeo, strutMat);
    strut1.position.set(0.2, 0.22, 0.1);
    strut1.rotation.set(0.4, 0.2, -0.6);
    this.debrisBMesh.add(strut1);
    this.disposables.push(strutGeo, strutMat);

    const ringMatB = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    this.ringBMesh = new THREE.Mesh(ringGeo, ringMatB);
    this.ringBMesh.rotation.x = -Math.PI / 2;
    this.ringBMesh.position.set(-0.5, 0.06, -5.0);
    this.group.add(this.ringBMesh);
    this.disposables.push(ringMatB);

    // 5. Debris C: Archive Projector Emitter (Vestígio C)
    this.debrisCMesh = new THREE.Group();
    this.debrisCMesh.position.set(-0.6, 0.22, -3.8);
    this.group.add(this.debrisCMesh);

    const projGeo = new THREE.CylinderGeometry(0.22, 0.32, 0.35, 18);
    const projMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
    const proj = new THREE.Mesh(projGeo, projMat);
    this.debrisCMesh.add(proj);
    this.disposables.push(projGeo, projMat);

    const ringMatC = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    this.ringCMesh = new THREE.Mesh(ringGeo, ringMatC);
    this.ringCMesh.rotation.x = -Math.PI / 2;
    this.ringCMesh.position.set(-0.6, 0.06, -3.8);
    this.group.add(this.ringCMesh);
    this.disposables.push(ringMatC);

    // 6. Bright, Clear, Non-Dark Lunar Illumination
    // Sun directional light (warm white key light)
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 3.0);
    sunLight.position.set(16, 12, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    this.group.add(sunLight);

    // Earthshine fill light (soft blue-white fill light from opposite angle, preventing pitch dark shadows)
    const earthshineLight = new THREE.DirectionalLight(0x93c5fd, 1.3);
    earthshineLight.position.set(-14, 10, -10);
    this.group.add(earthshineLight);

    // Generous ambient light so nothing is excessively dark
    const moonAmbient = new THREE.AmbientLight(0x475569, 0.85);
    this.group.add(moonAmbient);
  }

  public highlightClue(clueId: 'clueA' | 'clueB' | 'clueC' | null): void {
    (this.ringAMesh.material as THREE.MeshBasicMaterial).opacity = clueId === 'clueA' ? 0.85 : 0.0;
    (this.ringBMesh.material as THREE.MeshBasicMaterial).opacity = clueId === 'clueB' ? 0.85 : 0.0;
    (this.ringCMesh.material as THREE.MeshBasicMaterial).opacity = clueId === 'clueC' ? 0.85 : 0.0;
  }

  public update(deltaSec: number): void {
    this.pulseTime += deltaSec;
    const pulseScale = 1.0 + Math.sin(this.pulseTime * 3) * 0.12;
    this.ringAMesh.scale.set(pulseScale, pulseScale, pulseScale);
    this.ringBMesh.scale.set(pulseScale, pulseScale, pulseScale);
    this.ringCMesh.scale.set(pulseScale, pulseScale, pulseScale);
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose();
    }
  }
}
