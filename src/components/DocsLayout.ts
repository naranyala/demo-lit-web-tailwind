import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './DocsSidebar.ts';
import './DocPage.ts';
import { DOCS_CONFIG } from '../docs/config/docs-config';
import type { SectionConfig, PageConfig } from '../docs/config/docs-config';

@customElement('docs-layout')
export class DocsLayout extends LitElement {
  createRenderRoot() {
    return this;
  }

  private sections: SectionConfig[] = DOCS_CONFIG;

  @state()
  currentPageId = 'intro';

  private get currentPage() {
    for (const section of this.sections) {
      const page = section.pages.find(p => p.id === this.currentPageId);
      if (page) return page;
    }
    return this.sections[0].pages[0];
  }

  private _navigate = (pageId: string) => {
    this.currentPageId = pageId;
  }

  private get sidebarSections() {
    return this.sections.map(section => ({
      name: section.name,
      pages: section.pages.map(page => ({
        id: page.id,
        title: page.title
      }))
    }));
  }

  private renderPage(page: PageConfig) {
    switch (page.component) {
      case 'doc-page':
        return html`<doc-page .content=${page.content}></doc-page>`;
      default:
        return html`<doc-page .content=${page.content}></doc-page>`;
    }
  }

  render() {
    const page = this.currentPage;
    return html`
      <div class="h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-hidden flex flex-col">
        <!-- Top Navbar -->
        <nav class="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-slate-900 z-10">
          <div class="flex items-center gap-3 cursor-pointer" @click=${() => this._navigate('intro')}>
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            <div class="text-xl font-bold tracking-tight">
              Lit<span class="text-indigo-600">Web</span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <a href="https://github.com" target="_blank" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">GitHub</a>
            <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"></div>
          </div>
        </nav>

        <div class="flex-1 flex overflow-hidden">
          <docs-sidebar 
            .sections=${this.sidebarSections} 
            .currentPageId=${this.currentPageId}
            .onNavigate=${this._navigate}
            class="w-64"
          >
          </docs-sidebar>

          <!-- Main Content -->
          <main class="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
            <article class="prose dark:prose-invert max-w-3xl mx-auto">
              ${this.renderPage(page)}
            </article>
          </main>
        </div>
      </div>
    `;
  }
}

