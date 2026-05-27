import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('example-card')
export class ExampleCard extends LitElement {
  static styles = css`
    .card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      max-width: 350px;
    }
    h3 {
      margin-top: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    p {
      color: #6b7280;
      font-size: 0.875rem;
    }
  `;

  render() {
    return html`
      <div class="card">
        <slot name="title"><h3>Default Title</h3></slot>
        <slot name="content"><p>Default content goes here.</p></slot>
      </div>
    `;
  }
}
