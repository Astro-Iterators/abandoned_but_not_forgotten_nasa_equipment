import type { MoveInput } from '../world/actors/BipController';

export interface GamepadCallbacks {
  onActionClick: () => void;
}

export class MobileGamepad {
  private element: HTMLElement;
  private actionBtn: HTMLButtonElement;
  private objectiveBadge: HTMLElement;
  private currentInput: MoveInput = { forward: 0, turn: 0 };
  private callbacks: GamepadCallbacks;
  private isVisible: boolean = false;

  private keyState: { [key: string]: boolean } = {};

  constructor(container: HTMLElement, callbacks: GamepadCallbacks) {
    this.callbacks = callbacks;

    this.element = document.createElement('div');
    this.element.className = 'gamepad-overlay';
    this.element.style.display = 'none';

    // Objective Banner at top
    this.objectiveBadge = document.createElement('div');
    this.objectiveBadge.className = 'gamepad-objective-badge';
    this.objectiveBadge.innerHTML = '<strong>🕹 PILOTA O BIP:</strong> Guia o bot até ao foguetão!';
    this.element.appendChild(this.objectiveBadge);

    // Controls Row (Left D-Pad, Right Action Button)
    const controlsRow = document.createElement('div');
    controlsRow.className = 'gamepad-controls-row';

    // Virtual D-Pad (Large thumb-friendly directional touch targets)
    const dpadContainer = document.createElement('div');
    dpadContainer.className = 'virtual-dpad';

    dpadContainer.innerHTML = `
      <div class="dpad-row">
        <button class="dpad-btn dpad-up" data-dir="up" aria-label="Mover para a frente">▲</button>
      </div>
      <div class="dpad-row dpad-middle">
        <button class="dpad-btn dpad-left" data-dir="left" aria-label="Virar à esquerda">◀</button>
        <div class="dpad-center"></div>
        <button class="dpad-btn dpad-right" data-dir="right" aria-label="Virar à direita">▶</button>
      </div>
      <div class="dpad-row">
        <button class="dpad-btn dpad-down" data-dir="down" aria-label="Recuar">▼</button>
      </div>
    `;

    this.setupDpadEvents(dpadContainer);
    controlsRow.appendChild(dpadContainer);

    // Action Button on Right
    const actionContainer = document.createElement('div');
    actionContainer.className = 'gamepad-action-container';

    this.actionBtn = document.createElement('button');
    this.actionBtn.className = 'touch-btn action-circle-btn pulsing';
    this.actionBtn.setAttribute('aria-label', 'Acção de interacção');
    this.actionBtn.innerHTML = `
      <span class="action-icon">🚀</span>
      <span class="action-label">Embarcar</span>
    `;
    this.actionBtn.addEventListener('click', () => {
      this.callbacks.onActionClick();
    });

    actionContainer.appendChild(this.actionBtn);
    controlsRow.appendChild(actionContainer);

    this.element.appendChild(controlsRow);
    container.appendChild(this.element);

    this.setupKeyboardEvents();
  }

  public show(objectiveText: string, actionLabel: string, actionIcon: string = '🚀'): void {
    this.isVisible = true;
    this.objectiveBadge.innerHTML = objectiveText;
    this.actionBtn.innerHTML = `
      <span class="action-icon">${actionIcon}</span>
      <span class="action-label">${actionLabel}</span>
    `;
    this.element.style.display = 'flex';
  }

  public hide(): void {
    this.isVisible = false;
    this.element.style.display = 'none';
    this.currentInput = { forward: 0, turn: 0 };
  }

  public setActionEnabled(enabled: boolean): void {
    this.actionBtn.disabled = !enabled;
    this.actionBtn.classList.toggle('ready', enabled);
  }

  public getInput(): MoveInput {
    // Combine touch dpad and keyboard inputs
    let fwd = this.currentInput.forward;
    let trn = this.currentInput.turn;

    if (this.keyState['KeyW'] || this.keyState['ArrowUp']) fwd = 1.0;
    if (this.keyState['KeyS'] || this.keyState['ArrowDown']) fwd = -1.0;
    if (this.keyState['KeyA'] || this.keyState['ArrowLeft']) trn = -1.0;
    if (this.keyState['KeyD'] || this.keyState['ArrowRight']) trn = 1.0;

    return { forward: fwd, turn: trn };
  }

  private setupDpadEvents(dpad: HTMLElement): void {
    const handleDirPress = (dir: string, pressed: boolean) => {
      if (dir === 'up') this.currentInput.forward = pressed ? 1.0 : 0;
      if (dir === 'down') this.currentInput.forward = pressed ? -1.0 : 0;
      if (dir === 'left') this.currentInput.turn = pressed ? -1.0 : 0;
      if (dir === 'right') this.currentInput.turn = pressed ? 1.0 : 0;
    };

    const buttons = dpad.querySelectorAll('.dpad-btn');
    buttons.forEach((btn) => {
      const dir = btn.getAttribute('data-dir')!;

      // Touch events
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleDirPress(dir, true);
        btn.classList.add('active');
      });

      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleDirPress(dir, false);
        btn.classList.remove('active');
      });

      // Mouse events for desktop testing
      btn.addEventListener('mousedown', () => {
        handleDirPress(dir, true);
        btn.classList.add('active');
      });

      btn.addEventListener('mouseup', () => {
        handleDirPress(dir, false);
        btn.classList.remove('active');
      });

      btn.addEventListener('mouseleave', () => {
        handleDirPress(dir, false);
        btn.classList.remove('active');
      });
    });
  }

  private setupKeyboardEvents(): void {
    window.addEventListener('keydown', (e) => {
      if (!this.isVisible) return;
      this.keyState[e.code] = true;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onActionClick();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keyState[e.code] = false;
    });
  }

  public dispose(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
