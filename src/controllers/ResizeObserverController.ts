import type { ReactiveController } from 'lit';

export class ResizeObserverController implements ReactiveController {
  public width = 0;
  public height = 0;
  private observer: ResizeObserver | null = null;
  private host: any;

  constructor(host: any) {
    this.host = host;
  }

  async connect(element: HTMLElement) {
    this.observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      this.width = entry.contentRect.width;
      this.height = entry.contentRect.height;
      this.host.requestUpdate();
    });
    this.observer.observe(element);
  }

  hostConnected() {
    // Element must be provided via connect() call
  }

  hostDisconnected() {
    this.observer?.disconnect();
  }
}
