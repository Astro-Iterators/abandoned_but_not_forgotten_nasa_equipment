import type { Shot, CameraPose, ActorPose, DialogueLine, EvaluatedShotState } from './types';

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export class ShotEvaluator {
  public static evaluate(shot: Shot, localTime: number): EvaluatedShotState {
    const clampedTime = Math.max(0, Math.min(shot.durationSec, localTime));
    const rawProgress = shot.durationSec > 0 ? clampedTime / shot.durationSec : 1;
    const progress = smoothstep(rawProgress);

    // Interpolate camera
    const cameraPos = lerpVec3(shot.cameraStart.position, shot.cameraEnd.position, progress);
    const cameraLookAt = lerpVec3(shot.cameraStart.lookAt, shot.cameraEnd.lookAt, progress);
    const cameraFov = lerp(
      shot.cameraStart.fov ?? 45,
      shot.cameraEnd.fov ?? (shot.cameraStart.fov ?? 45),
      progress
    );

    const camera: CameraPose = {
      position: cameraPos,
      lookAt: cameraLookAt,
      fov: cameraFov,
    };

    // Interpolate Bip actor if defined
    let bipPose: ActorPose | undefined = undefined;
    if (shot.bipStart && shot.bipEnd) {
      const pos = lerpVec3(shot.bipStart.position, shot.bipEnd.position, progress);
      const rot = lerpVec3(
        shot.bipStart.rotation ?? [0, 0, 0],
        shot.bipEnd.rotation ?? [0, 0, 0],
        progress
      );
      const glow = lerp(
        shot.bipStart.glowIntensity ?? 1.0,
        shot.bipEnd.glowIntensity ?? 1.0,
        progress
      );
      bipPose = {
        position: pos,
        rotation: rot,
        eyeColor: rawProgress > 0.5 ? shot.bipEnd.eyeColor : shot.bipStart.eyeColor,
        glowIntensity: glow,
      };
    } else if (shot.bipStart) {
      bipPose = { ...shot.bipStart };
    }

    // Determine active dialogue line
    let activeDialogue: DialogueLine | null = null;
    for (const d of shot.dialogues) {
      if (clampedTime >= d.startOffsetSec && clampedTime < d.startOffsetSec + d.durationSec) {
        activeDialogue = d;
        break;
      }
    }

    const isInteractionPending = Boolean(
      shot.interaction &&
        shot.interaction !== 'none' &&
        localTime >= shot.durationSec
    );

    return {
      shot,
      shotLocalTime: clampedTime,
      progress: rawProgress,
      camera,
      bipPose,
      activeDialogue,
      isInteractionPending,
    };
  }
}
