import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('example-button')
export class ExampleButton extends LitElement {
  static styles = css`
    button {
      background-color: #4f46e5;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #4338ca;
    }
  `;

  render() {
    return html`<button><slot></slot></button>`;
  }
}
