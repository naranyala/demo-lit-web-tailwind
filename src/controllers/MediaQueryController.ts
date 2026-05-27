import type { ReactiveController } from 'lit';

export class MediaQueryController implements ReactiveController {
  public matches = false;
  private mql: MediaQueryList;
  private host: any;

  constructor(host: any, private query: string) {
    this.host = host;
    this.mql = window.matchMedia(query);
    this.matches = this.mql.matches;
  }

  hostConnected() {
    this.mql.addEventListener('change', this._handleChange);
  }

  hostDisconnected() {
    this.mql.removeEventListener('change', this._handleChange);
  }

  private _handleChange = () => {
    this.matches = this.mql.matches;
    this.host.requestUpdate();
  };
}
