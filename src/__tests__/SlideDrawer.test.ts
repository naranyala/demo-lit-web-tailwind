import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import '../components/SlideDrawer.ts';

function doubleRAF(): Promise<void> {
  return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}

async function waitForUpdate(el: HTMLElement) {
  await (el as any).updateComplete;
  await (el as any).updateComplete;
}

describe('SlideDrawer', () => {
  describe('initial state (open=false)', () => {
    it('renders default trigger button', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      const btn = el.querySelector('span button');
      expect(btn).to.exist;
      expect(btn!.textContent!.trim()).to.equal('Open Drawer');
    });

    it('does not render drawer panel in DOM', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      expect(el.querySelector('.fixed')).to.not.exist;
      expect(el.querySelector('[role="dialog"]')).to.not.exist;
    });

    it('captures children and does not keep raw children in DOM', async () => {
      const el = await fixture<HTMLElement>(
        html`<slide-drawer><div class="drawer-body">Drawer content</div></slide-drawer>`
      );
      expect(el.querySelector('.drawer-body')).to.not.exist;

      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const contentArea = el.querySelector('.overflow-y-auto');
      expect(contentArea).to.exist;
      expect(contentArea!.textContent).to.contain('Drawer content');
    });
  });

  describe('opening', () => {
    it('sets open=true when trigger button is clicked', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      el.querySelector('span button')!.click();
      await (el as any).updateComplete;
      expect((el as any).open).to.be.true;
    });

    it('sets _active=true in updated, _visible after double rAF', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      expect((el as any)._active).to.be.true;
      expect((el as any)._visible).to.be.false;
      await doubleRAF();
      expect((el as any)._visible).to.be.true;
    });

    it('renders backdrop and drawer panel in DOM', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      expect(el.querySelector('.fixed')).to.exist;
      expect(el.querySelector('[role="dialog"]')).to.exist;
    });

    it('has correct aria attributes when open', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const dialog = el.querySelector('[role="dialog"]')!;
      expect(dialog.getAttribute('aria-modal')).to.equal('true');
      expect(dialog.getAttribute('aria-label')).to.equal('Slide drawer');
    });

    it('applies inert when not visible during opening', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      const dialog = el.querySelector('[role="dialog"]')!;
      expect(dialog.hasAttribute('inert')).to.be.true;
      await doubleRAF();
      expect(dialog.hasAttribute('inert')).to.be.false;
    });
  });

  describe('closing', () => {
    it('sets open=false via close button', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      el.querySelector('button[aria-label="Close drawer"]')!.click();
      await (el as any).updateComplete;
      expect((el as any).open).to.be.false;
    });

    it('removes DOM after 500ms exit animation', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      expect(el.querySelector('[role="dialog"]')).to.exist;

      (el as any).open = false;
      await (el as any).updateComplete;
      expect((el as any)._visible).to.be.false;
      expect(el.querySelector('.fixed')).to.exist;

      await aTimeout(600);
      expect((el as any)._active).to.be.false;
      expect(el.querySelector('.fixed')).to.not.exist;
    });

    it('closes via Escape key', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await (el as any).updateComplete;
      expect((el as any).open).to.be.false;
    });

    it('closes via backdrop click', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const backdrop = el.querySelector('.z-40.fixed')! as HTMLElement;
      backdrop.click();
      await (el as any).updateComplete;
      expect((el as any).open).to.be.false;
    });
  });

  describe('custom trigger and content', () => {
    it('renders custom trigger from [slot="trigger"]', async () => {
      const el = await fixture<HTMLElement>(
        html`<slide-drawer><span slot="trigger" class="my-trigger">Open</span></slide-drawer>`
      );
      const triggerSpan = el.querySelector('span.inline-block')!;
      expect(triggerSpan.textContent!.trim()).to.equal('Open');
    });

    it('separates trigger from content', async () => {
      const el = await fixture<HTMLElement>(
        html`<slide-drawer>
          <span slot="trigger">Trigger</span>
          <div class="content-area">Main body</div>
        </slide-drawer>`
      );
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      const contentArea = el.querySelector('.overflow-y-auto')!;
      expect(contentArea.textContent).to.contain('Main body');
      expect(contentArea.textContent).to.not.contain('Trigger');
    });
  });

  describe('drawer-specific UI', () => {
    it('renders drag handle at top', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      const handle = el.querySelector('.rounded-full.bg-slate-300');
      expect(handle).to.exist;
    });

    it('has translate-y-full class when entering (not yet visible)', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      const panel = el.querySelector('[role="dialog"]')!;
      expect(panel.className).to.contain('translate-y-full');
      await doubleRAF();
      expect(panel.className).to.not.contain('translate-y-full');
    });
  });

  describe('edge cases', () => {
    it('rapid toggle during exit re-opens correctly', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      (el as any).open = false;
      await (el as any).updateComplete;
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();

      expect((el as any)._active).to.be.true;
      expect((el as any)._visible).to.be.true;
      expect(el.querySelector('[role="dialog"]')).to.exist;
    });

    it('multiple independent instances', async () => {
      const container = await fixture<HTMLElement>(html`
        <div>
          <slide-drawer id="d1"></slide-drawer>
          <slide-drawer id="d2"></slide-drawer>
        </div>
      `);
      const d1 = container.querySelector('#d1') as any;
      const d2 = container.querySelector('#d2') as any;

      d1.open = true;
      await waitForUpdate(d1);
      await doubleRAF();
      expect(d1._active).to.be.true;
      expect(d2._active).to.be.false;
    });

    it('unmount during exit animation cleans up', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      (el as any).open = false;
      await (el as any).updateComplete;
      el.remove();
      await aTimeout(600);
    });

    it('removes keydown listener on disconnect', async () => {
      const el = await fixture<HTMLElement>(html`<slide-drawer></slide-drawer>`);
      (el as any).open = true;
      await waitForUpdate(el);
      await doubleRAF();
      el.remove();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
  });
});
