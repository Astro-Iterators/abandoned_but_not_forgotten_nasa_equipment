export type GameState =
  | 'menu'
  | 'exploration'
  | 'dialogue'
  | 'cinematic'
  | 'puzzle'
  | 'journal'
  | 'complete'
  | 'paused';

export interface DialogueLine {
  id: string;
  speaker: 'nayla' | 'bip' | 'opportunity' | 'narrador';
  text: string;
  isMemory?: boolean;
}

export interface DialogueSequence {
  id: string;
  title: string;
  lines: DialogueLine[];
}

export interface ClueItem {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  discovered: boolean;
}

export interface PuzzleOption {
  id: string;
  label: string;
  isEvidence: boolean;
  category: 'evidencia' | 'imaginacao';
  explanation: string;
  hint: string;
}

export interface PuzzleDefinition {
  id: string;
  title: string;
  prompt: string;
  clueHint: string;
  options: PuzzleOption[];
  correctOptionId: string;
}

export type ActId =
  | 'prologue'
  | 'act_1_mars_arrival'
  | 'act_2_blueberries_scanner'
  | 'act_3_golden_memory'
  | 'act_4_darkening_storm'
  | 'epilogue';

export type ActType =
  | 'cinematic_story'
  | 'interactive_exploration'
  | 'interactive_scanner'
  | 'cinematic_video'
  | 'interactive_journal'
  | 'cinematic_epilogue';

export interface CinematicAct {
  id: ActId;
  index: number;
  title: string;
  subtitle: string;
  type: ActType;
  narrationLines?: DialogueLine[];
  imageSrc?: string;
  isInteractive: boolean;
  interactiveGoal?: string;
}

export interface MissionFact {
  label: string;
  value: string;
  sourceNote: string;
}

export interface MissionSource {
  title: string;
  organization: string;
  url: string;
  description: string;
}

export interface EpisodeContent {
  id: string;
  title: string;
  targetEquipment: string;
  destination: string;
  acts: CinematicAct[];
  introLines: DialogueLine[];
  clueItem: ClueItem;
  roverDialogue: DialogueLine[];
  puzzle: PuzzleDefinition;
  cinematic: {
    videoSrc: string;
    captionSrc: string;
    durationSeconds: number;
    fallbackSummary: string[];
  };
  missionSheet: {
    title: string;
    launchDate: string;
    landingDate: string;
    lastContactDate: string;
    missionStatus: string;
    distanceTraveled: string;
    imagesReturned: string;
    facts: MissionFact[];
    sources: MissionSource[];
  };
}

export interface SaveStateData {
  version: number;
  clueDiscovered: boolean;
  roverContacted: boolean;
  cinematicViewed: boolean;
  puzzleSolved: boolean;
  episodeCompleted: boolean;
  audioMuted: boolean;
  updatedAt: string;
}
