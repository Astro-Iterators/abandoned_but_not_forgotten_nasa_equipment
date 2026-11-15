export type ShotId =
  | 'S01'
  | 'S02'
  | 'S03'
  | 'S04'
  | 'S05'
  | 'S06'
  | 'S07'
  | 'S08'
  | 'S09'
  | 'S10'
  | 'S11'
  | 'S12';

export type EpisodeMode =
  | 'ready'
  | 'playing'
  | 'paused'
  | 'awaitingInteraction'
  | 'report'
  | 'finished'
  | 'loadingError';

export type Speaker = 'Narrador' | 'Bip' | 'Arquivo' | 'Ranger 7';

export interface DialogueLine {
  id: string;
  speaker: Speaker;
  text: string;
  startOffsetSec: number;
  durationSec: number;
}

export interface CameraPose {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
}

export interface ActorPose {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  eyeColor?: string;
  glowIntensity?: number;
}

export type InteractionType =
  | 'none'
  | 'analyzeClueA'
  | 'analyzeClueB'
  | 'orderImages'
  | 'chooseVerdict';

export type EnvironmentType =
  | 'earthBase'
  | 'launchPad'
  | 'spaceTransit'
  | 'moonSite'
  | 'memoryStage';

export interface Shot {
  id: ShotId;
  title: string;
  durationSec: number;
  environment: EnvironmentType;
  isFlashback: boolean;
  flashbackLabel?: string;
  cameraStart: CameraPose;
  cameraEnd: CameraPose;
  bipStart?: ActorPose;
  bipEnd?: ActorPose;
  dialogues: DialogueLine[];
  interaction?: InteractionType;
  summary: string;
}

export type ClueId = 'clueA' | 'clueB' | 'clueC';

export interface Clue {
  id: ClueId;
  name: string;
  description: string;
  historicalContext: string;
  archiveFact: string;
  shotId: ShotId;
  flashbackShotId: ShotId;
}

export interface SavedProgress {
  schemaVersion: number;
  shotId: ShotId;
  discoveredClues: ClueId[];
  completedFlashbacks: string[];
  verdictCorrect?: boolean;
  summarySeen?: boolean;
  timestamp: number;
}

export interface EvaluatedShotState {
  shot: Shot;
  shotLocalTime: number;
  progress: number; // 0 to 1
  camera: CameraPose;
  bipPose?: ActorPose;
  activeDialogue: DialogueLine | null;
  isInteractionPending: boolean;
}
