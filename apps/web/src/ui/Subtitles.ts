import type { DialogueLine } from '../director/types';

export class Subtitles {
  private element: HTMLElement;
  private speakerEl: HTMLElement;
  private textEl: HTMLElement;
  private flashbackBannerEl: HTMLElement;
  private isVisible: boolean = true;

  constructor(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'subtitles-container';

    this.flashbackBannerEl = document.createElement('div');
    this.flashbackBannerEl.className = 'flashback-banner';
    this.flashbackBannerEl.style.display = 'none';

    this.speakerEl = document.createElement('span');
    this.speakerEl.className = 'subtitles-speaker';

    this.textEl = document.createElement('span');
    this.textEl.className = 'subtitles-text';

    const dialogueBox = document.createElement('div');
    dialogueBox.className = 'subtitles-box';
    dialogueBox.appendChild(this.speakerEl);
    dialogueBox.appendChild(this.textEl);

    this.element.appendChild(this.flashbackBannerEl);
    this.element.appendChild(dialogueBox);

    container.appendChild(this.element);
  }

  public setVisible(visible: boolean): void {
    this.isVisible = visible;
    this.element.style.display = visible ? 'flex' : 'none';
  }

  public update(dialogue: DialogueLine | null, flashbackLabel?: string): void {
    if (!this.isVisible) {
      this.element.style.display = 'none';
      return;
    }

    if (flashbackLabel) {
      this.flashbackBannerEl.style.display = 'block';
      this.flashbackBannerEl.textContent = flashbackLabel.toUpperCase();
    } else {
      this.flashbackBannerEl.style.display = 'none';
    }

    if (!dialogue) {
      this.element.classList.remove('active');
      return;
    }

    this.element.classList.add('active');
    this.element.style.display = 'flex';
    this.speakerEl.textContent = dialogue.speaker;
    this.speakerEl.setAttribute('data-speaker', dialogue.speaker);
    this.textEl.textContent = dialogue.text;
  }

  public dispose(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
