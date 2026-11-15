import * as THREE from 'three';

export class EarthBase {
  public group: THREE.Group;
  private disposables: (THREE.BufferGeometry | THREE.Material)[] = [];
  private hologramMesh: THREE.Mesh;
  private holoDataMesh: THREE.Mesh;
  private holoTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'EarthBase';

    // 1. Bright High-Tech Robotics Laboratory Floor (Gleaming white/light gray ceramic)
    const floorGeo = new THREE.CylinderGeometry(9.0, 9.0, 0.4, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // pristine cleanroom white/light gray
      roughness: 0.15,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.2;
    floorMesh.receiveShadow = true;
    this.group.add(floorMesh);
    this.disposables.push(floorGeo, floorMat);

    // Floor navigation guide lines (Vibrant cyan & safety amber)
    const guideLineGeo = new THREE.TorusGeometry(8.8, 0.06, 12, 64);
    const guideLineMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });
    const guideLine = new THREE.Mesh(guideLineGeo, guideLineMat);
    guideLine.rotation.x = Math.PI / 2;
    guideLine.position.y = 0.01;
    this.group.add(guideLine);
    this.disposables.push(guideLineGeo, guideLineMat);

    // 2. Prototyping Assembly Workbench (Where Bip is being calibrated)
    const benchGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.6, 24);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.6,
      roughness: 0.25,
    });
    const benchMesh = new THREE.Mesh(benchGeo, benchMat);
    benchMesh.position.set(0, 0.3, 0);
    this.group.add(benchMesh);
    this.disposables.push(benchGeo, benchMat);

    // Assembly cradle ring around Bip
    const cradleGeo = new THREE.TorusGeometry(0.75, 0.04, 12, 32);
    const cradleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
    const cradleMesh = new THREE.Mesh(cradleGeo, cradleMat);
    cradleMesh.rotation.x = Math.PI / 2;
    cradleMesh.position.set(0, 0.62, 0);
    this.group.add(cradleMesh);
    this.disposables.push(cradleGeo, cradleMat);

    // 3. Human Engineers Prototyping Bip (Stylized cleanroom scientists)
    // Engineer 1: Lead Scientist holding diagnostic tablet beside Bip
    const eng1 = this.createStylizedEngineer(0x0284c7); // blue cleanroom suit
    eng1.position.set(1.4, 0, 0.4);
    eng1.rotation.y = -Math.PI / 3; // looking towards Bip
    this.group.add(eng1);

    // Tablet in hand
    const tabletGeo = new THREE.BoxGeometry(0.3, 0.02, 0.2);
    const tabletMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const tablet = new THREE.Mesh(tabletGeo, tabletMat);
    tablet.position.set(1.15, 1.1, 0.4);
    tablet.rotation.set(0.3, -Math.PI / 3, 0);
    this.group.add(tablet);
    this.disposables.push(tabletGeo, tabletMat);

    // Engineer 2: Systems Technician at terminal console
    const eng2 = this.createStylizedEngineer(0x059669); // emerald cleanroom suit
    eng2.position.set(-1.8, 0, -1.0);
    eng2.rotation.y = Math.PI / 4;
    this.group.add(eng2);

    // Computer terminal desk for Engineer 2
    const deskGeo = new THREE.BoxGeometry(1.2, 0.9, 0.6);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(-1.8, 0.45, -0.4);
    this.group.add(desk);
    this.disposables.push(deskGeo, deskMat);

    const screenGeo = new THREE.PlaneGeometry(0.8, 0.45);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-1.8, 1.1, -0.4);
    screen.rotation.y = Math.PI / 1.1;
    this.group.add(screen);
    this.disposables.push(screenGeo, screenMat);

    // Engineer 3: Robotics specialist checking gantry in background
    const eng3 = this.createStylizedEngineer(0xd97706); // amber suit
    eng3.position.set(-0.8, 0, 2.2);
    eng3.rotation.y = Math.PI * 0.85;
    this.group.add(eng3);

    // 4. Large Coastal Window with Vibrant Daytime Earth Sky & Ocean
    // Sky cylinder: bright daylight sky with gradient to turquoise sea
    const skyGeo = new THREE.CylinderGeometry(28, 28, 24, 32, 1, true, Math.PI * 0.7, Math.PI * 1.6);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // vibrant clear daylight Earth sky
      side: THREE.BackSide,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.y = 8;
    this.group.add(skyMesh);
    this.disposables.push(skyGeo, skyMat);

    // Coastal Ocean horizon line visible through glass
    const seaGeo = new THREE.PlaneGeometry(50, 20);
    const seaMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 }); // deep turquoise ocean
    const seaMesh = new THREE.Mesh(seaGeo, seaMat);
    seaMesh.position.set(0, 0, -22);
    this.group.add(seaMesh);
    this.disposables.push(seaGeo, seaMat);

    // Bright Sun shining through laboratory window
    const sunGeo = new THREE.CircleGeometry(2.5, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(8, 14, -20);
    sunMesh.lookAt(0, 4, 0);
    this.group.add(sunMesh);
    this.disposables.push(sunGeo, sunMat);

    // 5. Floating Diagnostic Hologram (Bip Wireframe + Mission Blueprint)
    const holoGeo = new THREE.SphereGeometry(0.42, 18, 14);
    const holoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    this.hologramMesh = new THREE.Mesh(holoGeo, holoMat);
    this.hologramMesh.position.set(0, 2.0, 0);
    this.group.add(this.hologramMesh);
    this.disposables.push(holoGeo, holoMat);

    // Orbiting data ring around the hologram
    const dataRingGeo = new THREE.TorusGeometry(0.68, 0.02, 8, 32);
    const dataRingMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true });
    this.holoDataMesh = new THREE.Mesh(dataRingGeo, dataRingMat);
    this.holoDataMesh.position.set(0, 2.0, 0);
    this.group.add(this.holoDataMesh);
    this.disposables.push(dataRingGeo, dataRingMat);

    // 6. Vibrant Laboratory Lighting (Bright, Uplifting, Daylight feel)
    const daylightSun = new THREE.DirectionalLight(0xffedd5, 3.8); // Sunlight through window
    daylightSun.position.set(10, 16, -10);
    daylightSun.castShadow = true;
    this.group.add(daylightSun);

    const labOverheadLight = new THREE.PointLight(0xffffff, 4.0, 18);
    labOverheadLight.position.set(0, 4.5, 0);
    this.group.add(labOverheadLight);

    const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.4); // bright daytime sky ambient
    this.group.add(ambientLight);
  }

  // Helper to create a stylized human engineer in cleanroom suit
  private createStylizedEngineer(suitColor: number): THREE.Group {
    const eng = new THREE.Group();

    // Body / Coat (Torso)
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.9, 12);
    const torsoMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.4 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.95;
    torso.castShadow = true;
    eng.add(torso);
    this.disposables.push(torsoGeo, torsoMat);

    // Head / Visor (Cleanroom helmet)
    const headGeo = new THREE.SphereGeometry(0.18, 16, 12);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.55;
    eng.add(head);
    this.disposables.push(headGeo, headMat);

    const visorGeo = new THREE.BoxGeometry(0.2, 0.08, 0.12);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.55, 0.14);
    eng.add(visor);
    this.disposables.push(visorGeo, visorMat);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.8, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-0.12, 0.4, 0);
    eng.add(legL);

    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(0.12, 0.4, 0);
    eng.add(legR);
    this.disposables.push(legGeo, legMat);

    return eng;
  }

  public update(deltaSec: number): void {
    this.holoTime += deltaSec;
    this.hologramMesh.rotation.y = this.holoTime * 0.8;
    this.holoDataMesh.rotation.x = this.holoTime * 0.5;
    this.holoDataMesh.rotation.y = this.holoTime * 1.2;
    this.hologramMesh.position.y = 2.0 + Math.sin(this.holoTime * 2.0) * 0.08;
    this.holoDataMesh.position.y = 2.0 + Math.sin(this.holoTime * 2.0) * 0.08;
  }

  public dispose(): void {
    for (const item of this.disposables) {
      item.dispose();
    }
  }
}
