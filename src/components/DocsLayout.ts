import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

// Core Pages
import introContent from '../docs/intro.md';
import archContent from '../docs/architecture.md';

// Example Pages
import buttonEx from '../docs/examples/button.md';
import cardEx from '../docs/examples/card.md';

// Import example components to ensure they are registered
import './ExampleButton.ts';
import './ExampleCard.ts';
import './CodeBlock.ts';

interface Page {
  title: string;
  content: any;
}

interface Section {
  name: string;
  pages: Record<string, Page>;
}

@customElement('docs-layout')
export class DocsLayout extends LitElement {
  createRenderRoot() {
    return this;
  }

  private sections: Section[] = [
    {
      name: 'Guide',
      pages: {
        'intro': { title: 'Introduction', content: introContent },
        'architecture': { title: 'Architecture', content: archContent },
      }
    },
    {
      name: 'Component Examples',
      pages: {
        'button': { title: 'Button', content: buttonEx },
        'card': { title: 'Card', content: cardEx },
      }
    }
  ];

  @state()
  currentPageId = 'intro';

  private get currentPage() {
    for (const section of this.sections) {
      if (section.pages[this.currentPageId]) {
        return section.pages[this.currentPageId];
      }
    }
    return this.sections[0].pages['intro'];
  }

  private _navigate(pageId: string) {
    this.currentPageId = pageId;
  }

  render() {
    return html`
      <div class="flex min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans">
        <!-- Sidebar -->
        <aside class="w-72 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8 sticky top-0 h-screen bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div class="flex items-center gap-3 px-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <div class="text-xl font-bold tracking-tight">
              Lit<span class="text-indigo-600">Web</span>
            </div>
          </div>
          
          <nav class="flex flex-col gap-6">
            ${this.sections.map(section => html`
              <div>
                <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                  ${section.name}
                </div>
                <div class="flex flex-col gap-1">
                  ${Object.entries(section.pages).map(([id, page]) => html`
                    <button 
                      @click=${() => this._navigate(id)}
                      class="text-left px-3 py-2 rounded-md transition-all ${this.currentPageId === id ? 'bg-indigo-600 text-white shadow-sm font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}"
                    >
                      ${page.title}
                    </button>
                  `)}
                </div>
              </div>
            `)}
          </nav>

          <div class="mt-auto p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
            <p class="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-2">Powered by</p>
            <p class="text-sm font-bold">Lit + Tailwind v4</p>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto p-6 md:p-12 lg:p-24">
          <article class="prose dark:prose-invert max-w-3xl mx-auto">
            ${this.currentPage.content}
          </article>
        </main>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
  `;
}
