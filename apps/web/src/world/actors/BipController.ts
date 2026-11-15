import * as THREE from 'three';
import type { Bip } from './Bip';

export interface MoveInput {
  forward: number; // -1 to 1
  turn: number;    // -1 to 1
}

export class BipController {
  private bip: Bip;
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private speed: number = 3.5;
  private currentHeading: number = 0;
  private bounds: { minX: number; maxX: number; minZ: number; maxZ: number } = {
    minX: -7,
    maxX: 7,
    minZ: -7,
    maxZ: 7,
  };

  public isControllable: boolean = false;

  constructor(bip: Bip) {
    this.bip = bip;
  }

  public setBounds(minX: number, maxX: number, minZ: number, maxZ: number): void {
    this.bounds = { minX, maxX, minZ, maxZ };
  }

  public update(deltaSec: number, input: MoveInput): void {
    if (!this.isControllable) return;

    // Movement calculation
    const moveX = input.turn;
    const moveZ = -input.forward;

    if (Math.abs(moveX) > 0.05 || Math.abs(moveZ) > 0.05) {
      // Rotate towards direction of movement
      const targetAngle = Math.atan2(moveX, moveZ);
      this.currentHeading = THREE.MathUtils.lerp(this.currentHeading, targetAngle, deltaSec * 10);

      // Target velocity
      const targetVel = new THREE.Vector3(moveX, 0, moveZ).normalize().multiplyScalar(this.speed);
      this.velocity.lerp(targetVel, deltaSec * 8);

      // Tilt body in direction of acceleration
      this.bip.group.rotation.y = this.currentHeading;
      this.bip.group.rotation.x = -input.forward * 0.15;
      this.bip.group.rotation.z = -input.turn * 0.15;
    } else {
      // Smooth deceleration to stop
      this.velocity.lerp(new THREE.Vector3(0, 0, 0), deltaSec * 10);
      this.bip.group.rotation.x = THREE.MathUtils.lerp(this.bip.group.rotation.x, 0, deltaSec * 8);
      this.bip.group.rotation.z = THREE.MathUtils.lerp(this.bip.group.rotation.z, 0, deltaSec * 8);
    }

    // Apply velocity
    this.bip.group.position.x += this.velocity.x * deltaSec;
    this.bip.group.position.z += this.velocity.z * deltaSec;

    // Clamp to area bounds
    this.bip.group.position.x = Math.max(
      this.bounds.minX,
      Math.min(this.bounds.maxX, this.bip.group.position.x)
    );
    this.bip.group.position.z = Math.max(
      this.bounds.minZ,
      Math.min(this.bounds.maxZ, this.bip.group.position.z)
    );

    // Natural hover bob
    this.bip.updateIdle(deltaSec);
  }

  public getPosition(): THREE.Vector3 {
    return this.bip.group.position;
  }

  public getDistanceTo(target: THREE.Vector3): number {
    return this.bip.group.position.distanceTo(target);
  }
}
