# Architecture
This project uses a **Custom Element** based architecture.

## Component Structure
Every page is a Lit component. We use a `DocsLayout` component to wrap the content.

## Markdown Pipeline
1. Write `.md` files in `src/docs/`.
2. `vite-plugin-markdown-lit` transforms them into `.ts` files exporting a Lit `html` template.
3. The `DocsLayout` imports and renders these templates.
