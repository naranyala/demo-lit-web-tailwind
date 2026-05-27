import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('doc-page')
export class DocPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: String })
  content = '';

  render() {
    return html`
      <div class="w-full">
        ${this.content}
      </div>
    `;
  }
}
