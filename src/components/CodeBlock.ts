import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('code-block')
export class CodeBlock extends LitElement {
  @property({ type: String })
  lang = '';

  @state()
  private _copied = false;

  private _codeHtml = '';
  private _timer?: ReturnType<typeof setTimeout>;

  createRenderRoot() { return this; }

  connectedCallback() {
    if (!this._codeHtml) {
      this._codeHtml = this.innerHTML;
      this.innerHTML = '';
    }
    super.connectedCallback();
  }

  private _copy() {
    const div = document.createElement('div');
    div.innerHTML = this._codeHtml;
    const text = div.textContent || '';
    navigator.clipboard.writeText(text).catch(() => {});
    this._copied = true;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      this._copied = false;
    }, 2000);
  }

  render() {
    return html`
      <div class="my-6 rounded-xl border border-slate-700 bg-[#0d1117] shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-slate-700">
          <div class="flex items-center gap-3">
            <div class="flex gap-1.5">
              <span class="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
              <span class="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
              <span class="w-3 h-3 rounded-full bg-[#27c93f]"></span>
            </div>
            ${this.lang ? html`<span class="text-xs text-slate-400 font-mono">${this.lang}</span>` : ''}
          </div>
          <button
            class="px-3 py-1 rounded text-xs font-medium transition-colors ${this._copied ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
            @click=${this._copy}
          >
            ${this._copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div class="overflow-x-auto p-4 [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent [&_code]:!p-0">
          ${this._codeHtml ? unsafeHTML(this._codeHtml) : ''}
        </div>
      </div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._timer);
  }
}
