import type { ReactiveController } from 'lit';

export class IntersectionObserverController implements ReactiveController {
  private observer: IntersectionObserver | null = null;
  public isIntersecting = false;
  private host: any;

  constructor(host: any, private options: IntersectionObserverInit = {}) {
    this.host = host;
  }

  async connect(element: HTMLElement) {
    this.observer = new IntersectionObserver(
      (entries) => {
        this.isIntersecting = entries[0].isIntersecting;
        this.host.requestUpdate();
      },
      this.options
    );
    this.observer.observe(element);
  }

  hostConnected() {
    // Element must be provided via connect() call in host's first_updated or similar
  }

  hostDisconnected() {
    this.observer?.disconnect();
  }
}
