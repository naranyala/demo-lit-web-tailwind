# 📝 Project TODOs

## 🛠️ Core Infrastructure
- [ ] Implement a proper router (e.g., `vaadin-router` or `lit-router`) instead of current state-based navigation.
- [ ] Add a global theme toggle (Light/Dark mode) with persistence in `localStorage`.
- [ ] Enhance `vite-plugin-markdown-lit` to support custom markdown directives (e.g., `:::tip` or `:::warning` callouts).
- [ ] Implement a search index for the documentation pages.

## 🧩 Component Library
- [ ] Create a set of "Primitive" components:
  - [ ] `docs-button` (Enhanced version of current button)
  - [ ] `docs-input`
  - [ ] `docs-modal`
  - [ ] `docs-accordion`
- [ ] Implement a "Live Playground" component where users can edit code and see the Lit component update in real-time.

## 🎨 UI/UX Improvements
- [ ] Add a "Table of Contents" (TOC) sidebar that automatically generates based on `h2` and `h3` tags in the markdown.
- [ ] Improve the `code-block` component with a language selector or "Download" button.
- [ ] Add a "Breadcrumb" navigation for deeper documentation hierarchies.

## 🧪 Quality Assurance
- [ ] Setup a testing suite using `Web Test Runner` or `Playwright`.
- [ ] Implement linting for markdown files to ensure consistent formatting.
- [ ] Add type-checking for the markdown content exports.
