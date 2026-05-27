import type { ReactiveController } from 'lit';

export class UrlParamsController implements ReactiveController {
  private host: any;

  constructor(host: any) {
    this.host = host;
  }

  hostConnected() {
    window.addEventListener('popstate', this._handlePopState);
  }

  hostDisconnected() {
    window.removeEventListener('popstate', this._handlePopState);
  }

  getParam(key: string, defaultValue: string = ''): string {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || defaultValue;
  }

  setParam(key: string, value: string) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
    this.host.requestUpdate();
  }

  private _handlePopState = () => {
    this.host.requestUpdate();
  };
}
