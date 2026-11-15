export class SubtitlePanel {
  private container: HTMLElement;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'subtitle-overlay hidden';
    this.container.id = 'subtitle-panel';
    parent.appendChild(this.container);
  }

  public setSubtitle(text: string | null): void {
    if (!text || text.trim() === '') {
      this.container.classList.add('hidden');
      this.container.textContent = '';
    } else {
      this.container.textContent = text;
      this.container.classList.remove('hidden');
    }
  }

  public hide(): void {
    this.container.classList.add('hidden');
    this.container.textContent = '';
  }
}
