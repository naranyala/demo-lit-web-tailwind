import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property } from 'lit/decorators.js';

interface Item {
  title: string;
  content: string;
}

@customElement('demo-accordion')
export class DemoAccordion extends LitElement {
  @property({ type: Number })
  index = 0;

  private _items: Item[] = [];

  createRenderRoot() { return this; }

  connectedCallback() {
    if (this._items.length === 0) {
      for (const child of this.children) {
        const title = child.getAttribute('title') ?? '';
        const content = child.innerHTML;
        if (content.trim()) {
          this._items.push({ title, content });
        }
      }
      this.innerHTML = '';
    }
    super.connectedCallback();
  }

  private _toggle(i: number) {
    this.index = this.index === i ? -1 : i;
  }

  render() {
    return html`
      <div class="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        ${this._items.map(
          (item, i) => html`
            <div class="${i < this._items.length - 1 ? 'border-b border-slate-200' : ''}">
              <div
                class="flex items-center justify-between p-4 cursor-pointer select-none bg-white hover:bg-slate-50 transition-colors"
                @click=${() => this._toggle(i)}
              >
                <span class="font-medium text-slate-700">${item.title}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-4 h-4 text-slate-400 transition-transform duration-300 ${this.index === i ? 'rotate-180' : ''}"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <div
                class="grid transition-all duration-300"
                style="grid-template-rows: ${this.index === i ? '1fr' : '0fr'}"
              >
                <div class="overflow-hidden">
                  <div class="p-4 bg-slate-50/50 text-slate-600 leading-relaxed border-t border-slate-100">
                    ${unsafeHTML(item.content)}
                  </div>
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}
