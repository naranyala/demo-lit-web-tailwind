import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('example-accordion-item')
export class ExampleAccordionItem extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  createRenderRoot() { return this; }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent('toggle-item', { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div>
        <div
          class="flex justify-between items-center p-4 cursor-pointer bg-white hover:bg-slate-50 transition-colors select-none text-slate-800"
          @click=${this._handleClick}
        >
          <span class="font-medium text-slate-700">
            <slot name="title">Accordion Item</slot>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-4 h-4 text-slate-400 transition-transform duration-300 ${this.open ? 'rotate-180' : ''}"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        <div
          class="grid transition-all duration-300"
          style="grid-template-rows: ${this.open ? '1fr' : '0fr'}"
        >
          <div class="overflow-hidden">
            <div class="p-4 bg-slate-50/50 text-slate-600 leading-relaxed border-t border-slate-100">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
