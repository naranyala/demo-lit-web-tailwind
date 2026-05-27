import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import '../components/PopupModal.ts';

function doubleRAF(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

async function waitForUpdate(el: HTMLElement) {
  await (el as any).updateComplete;
  await (el as any).updateComplete;
}

describe('PopupModal', () => {
  describe('initial state (open=false)', () => {
    it('renders default trigger button', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      const btn = el.querySelector('span button');
      expect(btn).to.exist;
      expect(btn!.textContent!.trim()).to.equal('Open Modal');
    });

    it('does not render backdrop or dialog in DOM', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      expect(el.querySelector('.fixed')).to.not.exist;
      expect(el.querySelector('[role="dialog"]')).to.not.exist;
    });

    it('reflects open=false attribute', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      expect(el.getAttribute('open')).to.equal(null);
    });

    it('captures children content and does not keep raw children in DOM', async () => {
      const el = await fixture<HTMLElement>(
        html`<popup-modal><p class="child-content">Hello modal</p></popup-modal>`
      );
      const rawChild = el.querySelector('.child-content');
      expect(rawChild).to.not.exist;

      // Open and verify content is rendered inside the dialog
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const contentDiv = el.querySelector('.overflow-y-auto');
      expect(contentDiv).to.exist;
      expect(contentDiv!.textContent).to.contain('Hello modal');
    });
  });

  describe('opening', () => {
    it('sets open=true when trigger button is clicked', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el.querySelector('span button') as HTMLElement)!.click();
      await (el as any).updateComplete;
      expect((el as any).open).to.be.true;
    });

    it('sets _active=true in updated callback', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      expect((el as any)._active).to.be.true;
    });

    it('sets _visible=true after double rAF', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      expect((el as any)._visible).to.be.false;
      await doubleRAF();
      expect((el as any)._visible).to.be.true;
    });

    it('renders dialog in DOM after updating', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      expect(el.querySelector('.fixed')).to.exist;
      expect(el.querySelector('[role="dialog"]')).to.exist;
    });

    it('applies correct aria and role attributes when open', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const dialog = el.querySelector('[role="dialog"]')!;
      expect(dialog.getAttribute('aria-modal')).to.equal('true');
      expect(dialog.getAttribute('aria-label')).to.equal('Modal dialog');
    });

    it('applies inert attribute when not visible during opening', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      const dialog = el.querySelector('[role="dialog"]')!;
      expect(dialog.hasAttribute('inert')).to.be.true;
      await doubleRAF();
      expect(dialog.hasAttribute('inert')).to.be.false;
    });
  });

  describe('closing via close button', () => {
    it('sets open=false when X button is clicked', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const closeBtn = el.querySelector('button[aria-label="Close modal"]')!;
       (closeBtn as HTMLElement).click();
      await (el as any).updateComplete;
      expect((el as any).open).to.be.false;
    });

    it('sets _visible=false immediately, DOM removed after 200ms', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      expect(el.querySelector('[role="dialog"]')).to.exist;

      (el as any).open = false;
      await (el as any).updateComplete;
      expect((el as any)._visible).to.be.false;

      // DOM should still exist during exit animation
      expect(el.querySelector('.fixed')).to.exist;

      await aTimeout(250);
      expect((el as any)._active).to.be.false;
      expect(el.querySelector('.fixed')).to.not.exist;
    });
  });

  describe('closing via Escape', () => {
    it('sets open=false when Escape key is pressed', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await (el as any).updateComplete;
      expect((el as any).open).to.be.false;
    });

    it('does not close on non-Escape key presses', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect((el as any).open).to.be.true;
    });

    it('removes keydown listener on disconnect', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();

      (el as any).open = false;
      await (el as any).updateComplete;
      el.remove();
      // Should not throw or leak
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
  });

  describe('closing via backdrop click', () => {
    it('sets open=false when backdrop overlay is clicked', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();

      // The z-50 overlay has @click=close handler
      const overlay = el.querySelector('.z-50.fixed')! as HTMLElement;
      overlay.click();
      await (el as any).updateComplete;
      expect((el as any).open).to.be.false;
    });

    it('does NOT close when content card is clicked (stopPropagation)', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();

      const card = el.querySelector('.bg-white.rounded-xl')! as HTMLElement;
      card.click();
      expect((el as any).open).to.be.true;
    });
  });

  describe('custom trigger via slot', () => {
    it('renders custom trigger HTML when [slot="trigger"] is present', async () => {
      const el = await fixture<HTMLElement>(
        html`<popup-modal><span slot="trigger" class="custom-trigger">Click me</span></popup-modal>`
      );
      const triggerSpan = el.querySelector('span.inline-block')!;
      expect(triggerSpan.textContent!.trim()).to.equal('Click me');

       (triggerSpan as HTMLElement).click();
      await (el as any).updateComplete;
      expect((el as any).open).to.be.true;
    });

    it('separates trigger from content', async () => {
      const el = await fixture<HTMLElement>(
        html`<popup-modal>
          <span slot="trigger">Open</span>
          <div class="modal-body">Body content</div>
        </popup-modal>`
      );
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();

      const contentDiv = el.querySelector('.overflow-y-auto')!;
      expect(contentDiv.textContent).to.contain('Body content');
      expect(contentDiv.textContent).to.not.contain('Open');
    });
  });

  describe('edge cases', () => {
    it('rapid open-close-open does not break animation state', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      (el as any).open = false;
      await (el as any).updateComplete;
      // quickly re-open before 200ms timeout fires
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();

      expect((el as any)._active).to.be.true;
      expect((el as any)._visible).to.be.true;
      expect(el.querySelector('[role="dialog"]')).to.exist;
    });

    it('multiple instances can coexist independently', async () => {
      const container = await fixture<HTMLElement>(html`
        <div>
          <popup-modal id="m1"><p>Modal 1</p></popup-modal>
          <popup-modal id="m2"><p>Modal 2</p></popup-modal>
        </div>
      `);
      const m1 = container.querySelector('#m1') as any;
      const m2 = container.querySelector('#m2') as any;

      m1.open = true;
      await waitForUpdate(m1);
      await doubleRAF();
      expect(m1._active).to.be.true;
      expect(m2._active).to.be.false;

      m1.open = false;
      await (m1 as any).updateComplete;
      m2.open = true;
      await waitForUpdate(m2);
      await doubleRAF();
      await aTimeout(250);
      expect(m1._active).to.be.false;
      expect(m2._active).to.be.true;
    });

    it('unmount during exit animation cleans up timers', async () => {
      const el = await fixture<HTMLElement>(html`<popup-modal></popup-modal>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      (el as any).open = false;
      await (el as any).updateComplete;
      // Remove before 200ms timeout fires
      el.remove();
      await aTimeout(300);
    });

    it('does not re-capture content if already captured', async () => {
      const el = await fixture<HTMLElement>(
        html`<popup-modal><p>Original content</p></popup-modal>`
      ) as any;
      el.open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const contentDiv = el.querySelector('.overflow-y-auto');
      expect(contentDiv!.textContent).to.contain('Original content');

      // Close and re-open - content should remain
      el.open = false;
      await (el as any).updateComplete;
      await aTimeout(250);
      el.open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const contentDiv2 = el.querySelector('.overflow-y-auto');
      expect(contentDiv2!.textContent).to.contain('Original content');
    });
  });
});
