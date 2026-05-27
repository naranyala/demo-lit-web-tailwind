import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import litLogo from './assets/lit.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

@customElement('my-element')
export class MyElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: Number })
  count = 0

  render() {
    return html`
      <section id="center" class="flex flex-col gap-6 justify-center items-center grow">
        <div class="relative">
          <img src=${heroImg} class="w-[170px] mx-auto relative z-0" width="170" height="179" alt="" />
          <img src=${litLogo} class="absolute z-10 top-[34px] h-7 transform perspective-[2000px] rotate-[300deg] rotate-x-[44deg] rotate-y-[39deg] scale-140" alt="Lit logo" />
          <img src=${viteLogo} class="absolute z-0 top-[107px] h-6 w-auto transform perspective-[2000px] rotate-[300deg] rotate-x-[40deg] rotate-y-[39deg] scale-80" alt="Vite logo" />
        </div>
        <div>
          <slot></slot>
          <p class="m-0">
            Edit <code>src/my-element.ts</code> and save to test
            <code class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm">HMR</code>
          </p>
        </div>
        <button
          type="button"
          class="font-mono text-sm px-2.5 py-1 rounded border-2 border-transparent transition-colors cursor-pointer text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-600 focus-visible:outline-2 focus-visible:outline-purple-600 focus-visible:outline-offset-2 mb-6"
          @click=${this._onClick}
        >
          Count is ${this.count}
        </button>
      </section>

      <div class="relative w-full"></div>

      <section id="next-steps" class="flex border-t border-slate-200 dark:border-slate-800 text-left">
        <div id="docs" class="flex-1 p-8 border-r border-slate-200 dark:border-slate-800">
          <svg class="mb-4 w-5 h-5" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2 class="text-2xl font-medium leading-tight tracking-tight mb-2 text-slate-900 dark:text-white">Documentation</h2>
          <p class="m-0">Your questions, answered</p>
          <ul class="flex gap-2 mt-8 p-0 list-none">
            <li>
              <a href="https://vite.dev/" target="_blank" class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-shadow hover:shadow-lg no-underline">
                <img class="h-4" src=${viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://lit.dev/" target="_blank" class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-shadow hover:shadow-lg no-underline">
                <img class="h-4" src=${litLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social" class="flex-1 p-8">
          <svg class="mb-4 w-5 h-5" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2 class="text-2xl font-medium leading-tight tracking-tight mb-2 text-slate-900 dark:text-white">Connect with us</h2>
          <p class="m-0">Join the Vite community</p>
          <ul class="flex gap-2 mt-8 p-0 list-none">
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank" class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-shadow hover:shadow-lg no-underline">
                <svg class="h-4 w-4" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank" class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-shadow hover:shadow-lg no-underline">
                <svg class="h-4 w-4" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank" class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-shadow hover:shadow-lg no-underline">
                <svg class="h-4 w-4" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank" class="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm transition-shadow hover:shadow-lg no-underline">
                <svg class="h-4 w-4" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>
      <section id="spacer" class="h-20 border-t border-slate-200 dark:border-slate-800"></section>
    `
  }

  private _onClick() {
    this.count++
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
