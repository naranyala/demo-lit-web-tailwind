import type { ReactiveController } from 'lit';

export class LocalStorageController<T> implements ReactiveController {
  private host: any;

  constructor(
    private hostElement: any,
    private key: string,
    private initialValue: T
  ) {
    this.host = hostElement;
  }

  hostConnected() {
    // Initialization logic if needed
  }

  hostUpdated() {
    // Logic after host update
  }

  getValue(): T {
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : this.initialValue;
  }

  setValue(value: T) {
    localStorage.setItem(this.key, JSON.stringify(value));
    this.host.requestUpdate();
  }
}
