import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('code-block')
export class CodeBlock extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 1.5rem 0;
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      background: #1e293b;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      background: #0f172a;
      border-bottom: 1px solid #334155;
      color: #94a3b8;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }

    .copy-btn {
      padding: 0.25rem 0.5rem;
      background: #334155;
      color: #f1f5f9;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.7rem;
      transition: all 0.2s;
    }

    .copy-btn:hover {
      background: #475569;
    }

    .copy-btn.copied {
      background: #10b981;
      color: white;
    }

    .content {
      padding: 0;
      overflow-x: auto;
    }

    /* Ensure shiki styles work inside */
    pre {
      margin: 0 !important;
      padding: 1rem !important;
      background: transparent !important;
    }
  `;

  render() {
    return html`
      <div class="header">
        <span class="lang">${this.getAttribute('lang') || 'code'}</span>
        <button class="copy-btn" @click=${this._copy}>Copy</button>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `;
  }

  private async _copy(e: Event) {
    const btn = e.target as HTMLButtonElement;
    const code = this.querySelector('code')?.textContent || '';
    
    await navigator.clipboard.writeText(code);
    
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  }
}
