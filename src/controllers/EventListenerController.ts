import type { ReactiveController } from 'lit';

export class EventListenerController implements ReactiveController {
  private host: any;
  private listeners: Map<string, (() => void)[]> = new Map();

  constructor(host: any) {
    this.host = host;
  }

  hostConnected() {
    // Initialize if needed
  }

  hostDisconnected() {
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(cb => window.removeEventListener(event, cb));
    });
    this.listeners.clear();
  }

  addListener(event: string, callback: () => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    window.addEventListener(event, callback);
  }

  removeListener(event: string, callback: () => void) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        window.removeEventListener(event, callback);
      }
    }
  }
}
