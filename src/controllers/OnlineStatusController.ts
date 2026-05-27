import type { ReactiveController } from 'lit';

export class OnlineStatusController implements ReactiveController {
  public isOnline = navigator.onLine;
  private host: any;

  constructor(host: any) {
    this.host = host;
  }

  hostConnected() {
    window.addEventListener('online', this._handleStatusChange);
    window.addEventListener('offline', this._handleStatusChange);
  }

  hostDisconnected() {
    window.removeEventListener('online', this._handleStatusChange);
    window.removeEventListener('offline', this._handleStatusChange);
  }

  private _handleStatusChange = () => {
    this.isOnline = navigator.onLine;
    this.host.requestUpdate();
  };
}
