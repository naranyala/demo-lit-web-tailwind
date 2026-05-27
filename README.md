# 🚀 Lit Web Framework Demo

A high-performance, modern web documentation starter built with **Lit**, **Tailwind CSS v4**, and **Vite**.

This project demonstrates a sophisticated integration of a utility-first CSS framework with a custom build-time pipeline that transforms Markdown files into optimized Lit templates.

## ✨ Key Features

- **⚡ Zero-Runtime Markdown**: A custom Vite plugin parses `.md` files at build time and converts them into Lit `html` templates, ensuring lightning-fast page loads.
- **🎨 Tailwind CSS v4**: Fully integrated with the latest version of Tailwind, including the `@tailwindcss/typography` plugin for beautiful documentation layouts.
- **🌈 Syntax Highlighting**: Powered by **Shiki**, providing professional, theme-aware code blocks with a custom `code-block` component featuring a "Copy to Clipboard" action.
- **🧩 Interactive Components**: Live component examples rendered directly within the documentation.
- **🌗 Dark Mode Ready**: Built-in support for light and dark color schemes.

## 🛠️ Tech Stack

- **Framework**: [Lit](https://lit.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Bundler**: [Vite](https://vite.dev/)
- **Markdown**: [Marked](https://marked.js.org/) + [Shiki](https://shiki.style/)
- **Runtime**: [Bun](https://bun.sh/)

## 🚀 Getting Started

### Prerequisites
Ensure you have [Bun](https://bun.sh/) installed on your system.

### Installation
\`\`\`bash
bun install
\`\`\`

### Development
Run the development server with Hot Module Replacement (HMR):
\`\`\`bash
bun run dev
\`\`\`

### Production Build
Build the project for production:
\`\`\`bash
bun run build
\`\`\`

## 📂 Project Structure

\`\`\`text
├── src/
│   ├── components/      # Reusable Lit components (Layout, CodeBlocks, etc.)
│   ├── docs/            # Markdown content source
│   │   └── examples/    # Component-specific documentation
│   ├── index.css        # Global styles & Tailwind imports
│   └── my-element.ts    # Main entry component (legacy/starter)
├── vite-plugin-markdown-lit.ts # Custom Vite plugin for MD -> Lit transformation
└── vite.config.ts       # Vite configuration
\`\`\`

## 🏗️ Architecture: Markdown Pipeline

The core of this project is the `markdownLitPlugin`. Instead of parsing markdown in the browser, the pipeline works as follows:
1. **Vite** detects an import of a `.md` file.
2. The **plugin** uses `marked` to convert MD to HTML.
3. **Shiki** intercepts code blocks to apply syntax highlighting styles.
4. The resulting HTML is wrapped in a Lit `html` tagged template and exported as a TypeScript module.
5. The **component** imports the module and renders the template directly.
