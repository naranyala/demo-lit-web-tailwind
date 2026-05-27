# Architecture
This project uses a **Custom Element** based architecture.

## Project Structure

```
src/
├── components/       # Lit components
│   ├── CodeBlock.ts
│   ├── DemoAccordion.ts
│   ├── DocsLayout.ts
│   ├── PopupModal.ts
│   └── SlideDrawer.ts
├── docs/             # Markdown content pages
│   ├── intro.md
│   ├── architecture.md
│   └── examples/
│       ├── accordion.md
│       ├── slide-drawer.md
│       └── popup-modal.md
├── index.css         # Tailwind v4 entry
└── my-element.ts
```

## Component Structure

Every page is a Lit component. We use a `DocsLayout` component to wrap the content.

```ts
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('docs-layout')
export class DocsLayout extends LitElement {
  @state()
  private currentPageId = 'intro';

  createRenderRoot() { return this; }

  render() {
    return html`
      <aside><!-- sidebar navigation --></aside>
      <main>${this.currentPage.content}</main>
    `;
  }
}
```

## Markdown Pipeline

1. Write `.md` files in `src/docs/`.
2. `vite-plugin-markdown-lit` transforms them into `.ts` files exporting a Lit `html` template.
3. The `DocsLayout` imports and renders these templates.

### Plugin Configuration

```ts
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { markdownLitPlugin } from './vite-plugin-markdown-lit';

export default defineConfig({
  plugins: [
    tailwindcss(),
    markdownLitPlugin(),
  ],
});
```

### Importing Markdown

```ts
import introContent from '../docs/intro.md';
import accordionEx from '../docs/examples/accordion.md';

// Used directly in templates
html`${introContent}`
```

## Styling Strategy

Components use `createRenderRoot() { return this; }` to render into light DOM, which lets Tailwind classes cascade directly onto component elements without shadow DOM encapsulation.

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

.prose {
  max-width: 65ch;
}
```
