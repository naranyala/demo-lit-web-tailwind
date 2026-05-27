import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('slide-drawer')
export class SlideDrawer extends LitElement {
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
        }, 500);
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
              >Open Drawer</button
            >`}
      </span>

      ${this._active
        ? html`
            <div
              class="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${this._visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}"
              @click=${this._close}
            ></div>

            <div
              class="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] transition-transform duration-500 ease-out ${this._visible ? '' : 'translate-y-full'}"
              ?inert=${!this._visible}
              role="dialog"
              aria-modal="true"
              aria-label="Slide drawer"
            >
              <div class="flex justify-center pt-3 pb-1 shrink-0">
                <div class="w-10 h-1 rounded-full bg-slate-300"></div>
              </div>

              <div class="flex items-center justify-end px-4 pb-2 shrink-0">
                <button
                  class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors text-slate-400"
                  @click=${this._close}
                  aria-label="Close drawer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="overflow-y-auto px-6 pb-6 min-h-0">
                ${this._contentHtml ? unsafeHTML(this._contentHtml) : ''}
              </div>
            </div>
          `
        : ''}
    `;
  }
}
