import type { ReactiveController } from 'lit';

export class WindowSizeController implements ReactiveController {
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  private host: any;

  constructor(host: any) {
    this.host = host;
  }

  hostConnected() {
    window.addEventListener('resize', this._handleResize);
  }

  hostDisconnected() {
    window.removeEventListener('resize', this._handleResize);
  }

  private _handleResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.host.requestUpdate();
  };
}
