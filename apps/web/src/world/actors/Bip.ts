import * as THREE from 'three';
import type { ActorPose } from '../../director/types';

export class Bip {
  public group: THREE.Group;
  private bodyMesh: THREE.Mesh;
  private accentRingMesh: THREE.Mesh;
  private accentCapMesh: THREE.Mesh;
  private earLeftMesh: THREE.Mesh;
  private earRightMesh: THREE.Mesh;
  private eyeLeftMesh: THREE.Mesh;
  private eyeRightMesh: THREE.Mesh;
  private eyePupilLeft: THREE.Mesh;
  private eyePupilRight: THREE.Mesh;
  private eyeMaterial: THREE.MeshBasicMaterial;
  private pupilMaterial: THREE.MeshBasicMaterial;
  private antennaMesh: THREE.Mesh;
  private antennaTipMesh: THREE.Mesh;
  private antennaTipMaterial: THREE.MeshBasicMaterial;
  private scannerCone: THREE.Mesh;
  private scannerMaterial: THREE.MeshBasicMaterial;
  private hoverLight: THREE.PointLight;

  private currentEyeColor: string = '#38bdf8';
  private bobTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Bip';

    // 1. Body: Pearlescent gleaming sphere
    const bodyGeo = new THREE.SphereGeometry(0.5, 32, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // bright gleaming pearl white
      roughness: 0.25,
      metalness: 0.1,
    });
    this.bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    this.bodyMesh.castShadow = true;
    this.bodyMesh.receiveShadow = true;
    this.group.add(this.bodyMesh);

    // 2. Cheerful Golden-Yellow Decorative Equator Ring (joyful accent)
    const ringGeo = new THREE.TorusGeometry(0.5, 0.025, 12, 48);
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // cheerful warm vibrant amber/yellow
      roughness: 0.3,
      metalness: 0.3,
    });
    this.accentRingMesh = new THREE.Mesh(ringGeo, accentMat);
    this.accentRingMesh.rotation.x = Math.PI / 2;
    this.group.add(this.accentRingMesh);

    // 3. Cheerful Top Dome Accent Cap (friendly dual-tone)
    const capGeo = new THREE.SphereGeometry(0.505, 32, 12, 0, Math.PI * 2, 0, Math.PI / 4.5);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // cheerful bright golden accent
      roughness: 0.3,
      metalness: 0.2,
    });
    this.accentCapMesh = new THREE.Mesh(capGeo, capMat);
    this.group.add(this.accentCapMesh);

    // 4. Cheerful Side Ear-caps (friendly robot headphone discs)
    const earGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 20);
    const earMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9, // joyful cyan contrast
      roughness: 0.3,
      metalness: 0.4,
    });
    this.earLeftMesh = new THREE.Mesh(earGeo, earMat);
    this.earLeftMesh.position.set(-0.48, 0.05, 0);
    this.earLeftMesh.rotation.z = Math.PI / 2;
    this.group.add(this.earLeftMesh);

    this.earRightMesh = new THREE.Mesh(earGeo, earMat);
    this.earRightMesh.position.set(0.48, 0.05, 0);
    this.earRightMesh.rotation.z = Math.PI / 2;
    this.group.add(this.earRightMesh);

    // 5. Expressive Joyful Luminous Eyes (with bright pupils)
    const eyeGeo = new THREE.CircleGeometry(0.09, 24);
    this.eyeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.currentEyeColor),
      side: THREE.DoubleSide,
    });

    this.eyeLeftMesh = new THREE.Mesh(eyeGeo, this.eyeMaterial);
    this.eyeLeftMesh.position.set(-0.16, 0.12, 0.47);
    this.eyeLeftMesh.rotation.y = -0.15;
    this.group.add(this.eyeLeftMesh);

    this.eyeRightMesh = new THREE.Mesh(eyeGeo, this.eyeMaterial);
    this.eyeRightMesh.position.set(0.16, 0.12, 0.47);
    this.eyeRightMesh.rotation.y = 0.15;
    this.group.add(this.eyeRightMesh);

    // Cheerful bright eye pupils (adds life and sparkle to Bip's expression)
    const pupilGeo = new THREE.CircleGeometry(0.035, 16);
    this.pupilMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff, // cheerful white glint of curiosity
      side: THREE.DoubleSide,
    });
    this.eyePupilLeft = new THREE.Mesh(pupilGeo, this.pupilMaterial);
    this.eyePupilLeft.position.set(-0.14, 0.14, 0.48);
    this.eyePupilLeft.rotation.y = -0.15;
    this.group.add(this.eyePupilLeft);

    this.eyePupilRight = new THREE.Mesh(pupilGeo, this.pupilMaterial);
    this.eyePupilRight.position.set(0.18, 0.14, 0.48);
    this.eyePupilRight.rotation.y = 0.15;
    this.group.add(this.eyePupilRight);

    // 6. Antenna: Polished chrome with bright glowing tip
    const antennaStemGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.22, 12);
    const antennaStemMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.8,
      roughness: 0.2,
    });
    this.antennaMesh = new THREE.Mesh(antennaStemGeo, antennaStemMat);
    this.antennaMesh.position.set(0, 0.58, -0.05);
    this.antennaMesh.rotation.x = -0.15;
    this.group.add(this.antennaMesh);

    const tipGeo = new THREE.SphereGeometry(0.05, 16, 12);
    this.antennaTipMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(this.currentEyeColor),
    });
    this.antennaTipMesh = new THREE.Mesh(tipGeo, this.antennaTipMaterial);
    this.antennaTipMesh.position.set(0, 0.69, -0.07);
    this.group.add(this.antennaTipMesh);

    // 7. Cheerful Soft Warm Hover Glow Light under Bip
    this.hoverLight = new THREE.PointLight(0x38bdf8, 1.2, 3.0);
    this.hoverLight.position.set(0, -0.3, 0);
    this.group.add(this.hoverLight);

    // 8. Holographic analysis scanner cone
    const scanGeo = new THREE.ConeGeometry(0.8, 1.8, 24, 1, true);
    scanGeo.translate(0, -0.9, 0);
    scanGeo.rotateX(Math.PI / 2);
    this.scannerMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.scannerCone = new THREE.Mesh(scanGeo, this.scannerMaterial);
    this.scannerCone.position.set(0, 0, 0.45);
    this.group.add(this.scannerCone);
  }

  public setPose(pose: ActorPose): void {
    this.group.position.set(pose.position[0], pose.position[1], pose.position[2]);
    if (pose.rotation) {
      this.group.rotation.set(pose.rotation[0], pose.rotation[1], pose.rotation[2]);
    }
    if (pose.scale) {
      this.group.scale.set(pose.scale[0], pose.scale[1], pose.scale[2]);
    }
    if (pose.eyeColor && pose.eyeColor !== this.currentEyeColor) {
      this.setEyeColor(pose.eyeColor);
    }
  }

  public setEyeColor(hexColor: string): void {
    this.currentEyeColor = hexColor;
    const color = new THREE.Color(hexColor);
    this.eyeMaterial.color = color;
    this.antennaTipMaterial.color = color;
    this.scannerMaterial.color = color;
    this.hoverLight.color = color;
  }

  public setScannerActive(active: boolean, intensity: number = 0.45): void {
    this.scannerMaterial.opacity = active ? intensity : 0.0;
  }

  public updateIdle(deltaSec: number): void {
    this.bobTime += deltaSec;
    // Gentle natural floating hovering
    const hoverOffset = Math.sin(this.bobTime * 2.2) * 0.04;
    this.bodyMesh.position.y = hoverOffset;
    this.accentRingMesh.position.y = hoverOffset;
    this.accentCapMesh.position.y = hoverOffset;
    this.earLeftMesh.position.y = 0.05 + hoverOffset;
    this.earRightMesh.position.y = 0.05 + hoverOffset;
    this.eyeLeftMesh.position.y = 0.12 + hoverOffset;
    this.eyeRightMesh.position.y = 0.12 + hoverOffset;
    this.eyePupilLeft.position.y = 0.14 + hoverOffset;
    this.eyePupilRight.position.y = 0.14 + hoverOffset;
    this.antennaMesh.position.y = 0.58 + hoverOffset;
    this.antennaTipMesh.position.y = 0.69 + hoverOffset;
    this.scannerCone.position.y = hoverOffset;

    // Cheerful gentle pulsing on the antenna tip and hover light
    const pulse = 1.0 + Math.sin(this.bobTime * 3.5) * 0.2;
    this.antennaTipMesh.scale.set(pulse, pulse, pulse);
    this.hoverLight.intensity = 1.0 + Math.sin(this.bobTime * 2.5) * 0.3;
  }

  public dispose(): void {
    this.bodyMesh.geometry.dispose();
    (this.bodyMesh.material as THREE.Material).dispose();

    this.accentRingMesh.geometry.dispose();
    (this.accentRingMesh.material as THREE.Material).dispose();

    this.accentCapMesh.geometry.dispose();
    (this.accentCapMesh.material as THREE.Material).dispose();

    this.earLeftMesh.geometry.dispose();
    (this.earLeftMesh.material as THREE.Material).dispose();

    this.earRightMesh.geometry.dispose();
    (this.earRightMesh.material as THREE.Material).dispose();

    this.eyeLeftMesh.geometry.dispose();
    this.eyeRightMesh.geometry.dispose();
    this.eyeMaterial.dispose();

    this.eyePupilLeft.geometry.dispose();
    this.eyePupilRight.geometry.dispose();
    this.pupilMaterial.dispose();

    this.antennaMesh.geometry.dispose();
    (this.antennaMesh.material as THREE.Material).dispose();

    this.antennaTipMesh.geometry.dispose();
    this.antennaTipMaterial.dispose();

    this.scannerCone.geometry.dispose();
    this.scannerMaterial.dispose();
  }
}
