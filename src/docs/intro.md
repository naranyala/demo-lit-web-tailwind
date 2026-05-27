# Introduction
Welcome to the **Demo Lit Web** documentation!

This project showcases the integration of:
- **Lit**: A lightweight library for building fast web components.
- **Tailwind CSS v4**: The latest utility-first CSS framework.
- **Vite**: Next generation frontend tooling.

## Quick Start
To get started, run:
```bash
bun install
bun run dev
```

## Your First Component

A basic Lit component with Tailwind:

```ts
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('hello-card')
export class HelloCard extends LitElement {
  @property({ type: String })
  name = 'World';

  createRenderRoot() { return this; }

  render() {
    return html`
      <div class="p-6 bg-white rounded-xl shadow-md border border-slate-200">
        <h2 class="text-lg font-semibold text-slate-800">Hello, ${this.name}!</h2>
        <p class="text-sm text-slate-600 mt-1">This component uses Lit + Tailwind.</p>
      </div>
    `;
  }
}
```

## Using the Component

Register and use it in any template:

```html
<hello-card name="Lit"></hello-card>
<hello-card name="Tailwind"></hello-card>
```
