import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('example-accordion')
export class ExampleAccordion extends LitElement {
  createRenderRoot() { return this; }

  @state()
  private openIndex: number | null = 0;

  private _handleToggle(e: CustomEvent) {
    const items = Array.from(this.querySelectorAll('example-accordion-item'));
    const index = items.indexOf(e.target as Element);
    this.openIndex = this.openIndex === index ? null : index;
  }

  render() {
    return html`
      <div class="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <slot @toggle-item=${this._handleToggle}></slot>
      </div>
    `;
  }

  updated() {
    this.querySelectorAll('example-accordion-item').forEach((item, i) => {
      (item as any).open = i === this.openIndex;
    });
  }
}
