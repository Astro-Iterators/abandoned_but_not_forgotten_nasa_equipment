export class BipVisorHud {
  private element: HTMLElement;
  private distanceLabel: HTMLElement;
  private lockonIndicator: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'bip-visor-hud';
    this.element.style.display = 'none';

    this.element.innerHTML = `
      <div class="visor-frame-top">
        <span class="visor-tag">SISTEMA VISUAL DO BIP • SENSOR LUNAR</span>
        <span class="visor-status">ONLINE 100%</span>
      </div>

      <div class="visor-reticle">
        <div class="reticle-circle"></div>
        <div class="reticle-crosshair"></div>
        <div class="reticle-lock" id="reticle-lock">ALVO DETECTADO</div>
      </div>

      <div class="visor-frame-bottom">
        <div class="telemetry-box">
          <span class="telemetry-label">RADAR DE SUPERFÍCIE:</span>
          <span class="telemetry-val" id="visor-distance">PROCURANDO VESTÍGIOS...</span>
        </div>
      </div>
    `;

    this.distanceLabel = this.element.querySelector('#visor-distance')!;
    this.lockonIndicator = this.element.querySelector('#reticle-lock')!;

    container.appendChild(this.element);
  }

  public show(): void {
    this.element.style.display = 'flex';
  }

  public hide(): void {
    this.element.style.display = 'none';
  }

  public updateTelemetry(distanceMeters: number, isLocked: boolean): void {
    this.distanceLabel.textContent = `DISTÂNCIA AO VESTÍGIO: ${distanceMeters.toFixed(1)} m`;
    if (isLocked) {
      this.lockonIndicator.classList.add('locked');
      this.lockonIndicator.textContent = 'ALVO FIXADO! PREMIR ANALISAR';
    } else {
      this.lockonIndicator.classList.remove('locked');
      this.lockonIndicator.textContent = 'APROXIMAÇÃO EM CURSO';
    }
  }

  public dispose(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
