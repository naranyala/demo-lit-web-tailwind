import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { LocalStorageController } from '../controllers/LocalStorageController';
import { WindowSizeController } from '../controllers/WindowSizeController';
import { EventListenerController } from '../controllers/EventListenerController';

@customElement('controller-demo')
export class ControllerDemo extends LitElement {
  createRenderRoot() {
    return this;
  }

  // Composable controllers
  private storage = new LocalStorageController(this, 'demo-count', 0);
  private windowSize = new WindowSizeController(this);
  private events = new EventListenerController(this);

  @state()
  count = 0;

  @state()
  lastEvent = 'None';

  connectedCallback() {
    super.connectedCallback();
    this.count = this.storage.getValue();
    
    this.events.addListener('keydown', (e: any) => {
      this.lastEvent = `Key pressed: ${e.key}`;
    });
  }

  private _increment() {
    this.count++;
    this.storage.setValue(this.count);
  }

  render() {
    return html`
      <div class="flex flex-col gap-8 p-6 max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
        <section class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
          <h3 class="text-lg font-bold mb-4">LocalStorage Composable</h3>
          <p class="mb-4">Count persisted in localStorage: <span class="font-mono font-bold">${this.count}</span></p>
          <button 
            @click=${this._increment}
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Increment
          </button>
        </section>

        <section class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
          <h3 class="text-lg font-bold mb-4">WindowSize Composable</h3>
          <p class="mb-2">Width: <span class="font-mono font-bold">${this.windowSize.width}px</span></p>
          <p>Height: <span class="font-mono font-bold">${this.windowSize.height}px</span></p>
        </section>

        <section class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <h3 class="text-lg font-bold mb-4">EventListener Composable</h3>
          <p>Last Global Event: <span class="font-mono font-bold">${this.lastEvent}</span></p>
          <p class="text-sm text-slate-500 mt-2">(Press any key on your keyboard)</p>
        </section>
      </div>
    `;
  }
}
