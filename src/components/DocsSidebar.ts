import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface Page {
  id: string;
  title: string;
}

interface Section {
  name: string;
  pages: Page[];
}

@customElement('docs-sidebar')
export class DocsSidebar extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: Array })
  sections: Section[] = [];

  @property({ type: String })
  currentPageId = '';

  @property({ type: Object })
  onNavigate = (_id: string) => {};

  @state()
  searchQuery = '';

  private _fuzzyMatch(text: string, query: string): boolean {
    text = text.toLowerCase();
    query = query.toLowerCase();
    let textIdx = 0;
    let queryIdx = 0;
    while (textIdx < text.length && queryIdx < query.length) {
      if (text[textIdx] === query[queryIdx]) {
        queryIdx++;
      }
      textIdx++;
    }
    return queryIdx === query.length;
  }

  private get filteredSections() {
    if (!this.searchQuery) return this.sections;

    return this.sections.map(section => ({
      ...section,
      pages: section.pages.filter(page => 
        this._fuzzyMatch(page.title, this.searchQuery) || 
        this._fuzzyMatch(section.name, this.searchQuery)
      )
    })).filter(section => section.pages.length > 0);
  }

  render() {
    return html`
      <aside class="border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8 sticky top-0 h-screen bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <slot name="header"></slot>
        
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            .value=${this.searchQuery}
            @input=${(e: any) => this.searchQuery = e.target.value}
            placeholder="Search docs..." 
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <nav class="flex flex-col gap-6">
          ${this.filteredSections.map(section => html`
            <div>
              <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                ${section.name}
              </div>
              <div class="flex flex-col gap-1">
                ${section.pages.map(page => html`
                  <button 
                    @click=${() => this.onNavigate(page.id)}
                    class="text-left px-3 py-2 rounded-md transition-all ${this.currentPageId === page.id ? 'bg-indigo-600 text-white shadow-sm font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}"
                  >
                    ${page.title}
                  </button>
                `)}
              </div>
            </div>
          `)}
        </nav>

        <slot name="footer"></slot>
      </aside>
    `;
  }
}
