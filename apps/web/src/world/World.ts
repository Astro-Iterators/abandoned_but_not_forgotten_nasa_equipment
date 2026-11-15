import * as THREE from 'three';
import { Bip } from './actors/Bip';
import { Rocket } from './actors/Rocket';
import { BipController, type MoveInput } from './actors/BipController';
import { EarthBase } from './environments/EarthBase';
import { LaunchPad } from './environments/LaunchPad';
import { SpaceTransit } from './environments/SpaceTransit';
import { MoonSite } from './environments/MoonSite';
import { MemoryStage } from './environments/MemoryStage';
import type { EvaluatedShotState, EnvironmentType } from '../director/types';

export type CameraViewMode = 'cinematic' | 'followBip' | 'bipPOV';

export class World {
  public renderer!: THREE.WebGLRenderer;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;

  public bip: Bip;
  public rocket: Rocket;
  public bipController: BipController;

  public earthBase: EarthBase;
  public launchPad: LaunchPad;
  public spaceTransit: SpaceTransit;
  public moonSite: MoonSite;
  public memoryStage: MemoryStage;

  private isWebGLAvailable: boolean = true;
  private container: HTMLElement;
  private resizeObserver?: ResizeObserver;
  private cameraMode: CameraViewMode = 'cinematic';

  constructor(container: HTMLElement) {
    this.container = container;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        this.isWebGLAvailable = false;
      }
    } catch {
      this.isWebGLAvailable = false;
    }

    if (!this.isWebGLAvailable) {
      this.showWebGLFallback();
      this.bip = {} as Bip;
      this.rocket = {} as Rocket;
      this.bipController = {} as BipController;
      this.earthBase = {} as EarthBase;
      this.launchPad = {} as LaunchPad;
      this.spaceTransit = {} as SpaceTransit;
      this.moonSite = {} as MoonSite;
      this.memoryStage = {} as MemoryStage;
      return;
    }

    // 1. Three.js Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    container.appendChild(this.renderer.domElement);

    // 2. Scene and Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // bright slate navy

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x475569, 0.75);
    this.scene.add(hemiLight);

    const aspect =
      (container.clientWidth || window.innerWidth) /
      (container.clientHeight || window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 300);
    this.scene.add(this.camera);

    // 3. Actors & Controller
    this.bip = new Bip();
    this.scene.add(this.bip.group);
    this.bipController = new BipController(this.bip);

    this.rocket = new Rocket();
    this.scene.add(this.rocket.group);

    // 4. Environments
    this.earthBase = new EarthBase();
    this.scene.add(this.earthBase.group);

    this.launchPad = new LaunchPad();
    this.scene.add(this.launchPad.group);

    this.spaceTransit = new SpaceTransit();
    this.scene.add(this.spaceTransit.group);

    this.moonSite = new MoonSite();
    this.scene.add(this.moonSite.group);

    this.memoryStage = new MemoryStage();
    this.scene.add(this.memoryStage.group);

    this.setEnvironment('earthBase');
    this.setupResizeHandler();
  }

  public setCameraMode(mode: CameraViewMode): void {
    this.cameraMode = mode;
  }

  public getCameraMode(): CameraViewMode {
    return this.cameraMode;
  }

  public setEnvironment(env: EnvironmentType): void {
    if (!this.isWebGLAvailable) return;

    this.earthBase.group.visible = env === 'earthBase';
    this.launchPad.group.visible = env === 'launchPad';
    this.spaceTransit.group.visible = env === 'spaceTransit';
    this.moonSite.group.visible = env === 'moonSite';
    this.memoryStage.group.visible = env === 'memoryStage';

    this.rocket.group.visible = env === 'launchPad';
  }

  public updateAndRender(
    state: EvaluatedShotState,
    deltaSec: number,
    manualInput?: MoveInput
  ): void {
    if (!this.isWebGLAvailable) return;

    const { shot, camera, bipPose, progress } = state;
    this.setEnvironment(shot.environment);

    // 1. Process player manual driving input if active
    if (this.bipController.isControllable && manualInput) {
      this.bipController.update(deltaSec, manualInput);
    } else {
      // Directed actor posing
      if (shot.isFlashback) {
        this.bip.group.visible = false;
        this.memoryStage.configureFlashback(shot.id, state.shotLocalTime, shot.durationSec);
      } else {
        this.bip.group.visible = true;
        if (bipPose) {
          this.bip.setPose(bipPose);
        }
        this.bip.updateIdle(deltaSec);

        if (shot.id === 'S05' || shot.id === 'S07') {
          this.bip.setScannerActive(progress > 0.6);
        } else {
          this.bip.setScannerActive(false);
        }
      }
    }

    // 2. Camera positioning based on mode
    if (this.cameraMode === 'bipPOV') {
      // First-person perspective through Bip's visor looking forward
      const pos = this.bip.group.position;
      const heading = this.bip.group.rotation.y;
      this.camera.position.set(pos.x, pos.y + 0.32, pos.z + 0.15);
      const lookDist = 6.0;
      this.camera.lookAt(
        pos.x + Math.sin(heading) * lookDist,
        pos.y + 0.15,
        pos.z - Math.cos(heading) * lookDist
      );
      this.camera.fov = 65;
      this.camera.updateProjectionMatrix();
    } else if (this.cameraMode === 'followBip') {
      // Third-person chase camera behind Bip
      const pos = this.bip.group.position;
      this.camera.position.set(pos.x, pos.y + 2.2, pos.z + 4.2);
      this.camera.lookAt(pos.x, pos.y + 0.5, pos.z);
      this.camera.fov = 50;
      this.camera.updateProjectionMatrix();
    } else {
      // Cinematic directed camera
      this.camera.position.set(camera.position[0], camera.position[1], camera.position[2]);
      this.camera.lookAt(camera.lookAt[0], camera.lookAt[1], camera.lookAt[2]);
      if (camera.fov && this.camera.fov !== camera.fov) {
        this.camera.fov = camera.fov;
        this.camera.updateProjectionMatrix();
      }
    }

    // Specific shot animations
    if (shot.id === 'S02') {
      this.rocket.setThrusterActive(progress > 0.25);
      this.rocket.group.position.y = progress > 0.25 ? (progress - 0.25) * 28 : 0;
      this.rocket.update(deltaSec);
    } else {
      this.rocket.setThrusterActive(false);
    }

    if (shot.id === 'S12') {
      this.spaceTransit.setMarsVisible(true);
    } else {
      this.spaceTransit.setMarsVisible(false);
    }

    // Update active environment animations
    if (this.earthBase.group.visible) this.earthBase.update(deltaSec);
    if (this.spaceTransit.group.visible) this.spaceTransit.update(deltaSec);
    if (this.moonSite.group.visible) {
      this.moonSite.update(deltaSec);
      if (shot.id === 'S05') this.moonSite.highlightClue('clueA');
      else if (shot.id === 'S07') this.moonSite.highlightClue('clueB');
      else if (shot.id === 'S09') this.moonSite.highlightClue('clueC');
      else this.moonSite.highlightClue(null);
    }
    if (this.memoryStage.group.visible) this.memoryStage.update(deltaSec);

    // Render frame
    this.renderer.render(this.scene, this.camera);
  }

  private setupResizeHandler(): void {
    const handleResize = () => {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(handleResize);
      this.resizeObserver.observe(this.container);
    }
  }

  private showWebGLFallback(): void {
    const banner = document.createElement('div');
    banner.className = 'webgl-fallback';
    banner.innerHTML = `
      <div class="webgl-fallback-card">
        <h2>Aviso Gráfico</h2>
        <p>O seu navegador ou dispositivo não tem suporte a WebGL activo.</p>
        <p>A narrativa do episódio 1 pode ser acompanhada através do resumo e texto.</p>
      </div>
    `;
    this.container.appendChild(banner);
  }

  public dispose(): void {
    if (!this.isWebGLAvailable) return;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.bip.dispose();
    this.rocket.dispose();
    this.earthBase.dispose();
    this.launchPad.dispose();
    this.spaceTransit.dispose();
    this.moonSite.dispose();
    this.memoryStage.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
