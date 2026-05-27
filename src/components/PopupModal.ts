import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('popup-modal')
export class PopupModal extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  @state()
  private _active = false;

  @state()
  private _visible = false;

  private _triggerHtml = '';
  private _contentHtml = '';
  private _timer?: ReturnType<typeof setTimeout>;
  private _raf?: number;

  createRenderRoot() { return this; }

  private _open = () => { this.open = true; };
  private _close = () => { this.open = false; };

  private _onCardClick = (e: Event) => { e.stopPropagation(); };

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) this.open = false;
  };

  connectedCallback() {
    if (!this._triggerHtml) {
      const trigger = this.querySelector('[slot="trigger"]');
      this._triggerHtml = trigger?.innerHTML ?? '';
      const parts: string[] = [];
      for (const child of this.children) {
        if (child.getAttribute?.('slot') !== 'trigger') {
          parts.push((child as Element).outerHTML);
        }
      }
      this._contentHtml = parts.join('');
      this.innerHTML = '';
    }
    super.connectedCallback();
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKeydown);
    clearTimeout(this._timer);
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      clearTimeout(this._timer);
      if (this._raf) cancelAnimationFrame(this._raf);

      if (this.open) {
        this._active = true;
        this._raf = requestAnimationFrame(() => {
          this._raf = requestAnimationFrame(() => {
            this._visible = true;
          });
        });
      } else {
        this._visible = false;
        this._timer = setTimeout(() => {
          this._active = false;
        }, 200);
      }
    }
  }

  render() {
    return html`
      <span class="inline-block" @click=${this._open}>
        ${this._triggerHtml
          ? unsafeHTML(this._triggerHtml)
          : html`<button
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >Open Modal</button
            >`}
      </span>

      ${this._active
        ? html`
            <div
              class="fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 ${this._visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
            ></div>

            <div
              class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${this._visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
              @click=${this._close}
              ?inert=${!this._visible}
              role="dialog"
              aria-modal="true"
              aria-label="Modal dialog"
            >
              <div
                class="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col transition-transform duration-200 ${this._visible ? 'scale-100' : 'scale-95'}"
                @click=${this._onCardClick}
              >
                <div class="flex items-center justify-end px-5 pt-4 pb-0 shrink-0">
                  <button
                    class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors text-slate-400"
                    @click=${this._close}
                    aria-label="Close modal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div class="overflow-y-auto px-5 pb-5 pt-2 min-h-0">
                  ${this._contentHtml ? unsafeHTML(this._contentHtml) : ''}
                </div>
              </div>
            </div>
          `
        : ''}
    `;
  }
}
