# Slide Drawer

A sliding panel that enters from the bottom of the viewport. Useful for menus, forms, or detail views without leaving the current page.

## Live Demo

<slide-drawer>
  <span slot="trigger">
    <span class="text-indigo-600 underline cursor-pointer font-medium">Open settings drawer</span>
  </span>

  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-800">Settings</h3>
    <div class="space-y-3">
      <label class="flex items-center justify-between text-sm text-slate-600">
        <span>Dark Mode</span>
        <input type="checkbox" class="rounded border-slate-300" checked />
      </label>
      <label class="flex items-center justify-between text-sm text-slate-600">
        <span>Notifications</span>
        <input type="checkbox" class="rounded border-slate-300" />
      </label>
      <label class="flex items-center justify-between text-sm text-slate-600">
        <span>Auto-save</span>
        <input type="checkbox" class="rounded border-slate-300" checked />
      </label>
    </div>
    <hr class="border-slate-200" />
    <p class="text-sm text-slate-500">Changes are saved automatically.</p>
  </div>
</slide-drawer>

## Basic Usage

Trigger with an inline link, button, or any element:

<slide-drawer>
  <button slot="trigger" class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
    Show Notification
  </button>

  <div>
    <h3 class="text-lg font-semibold text-slate-800">New Update Available</h3>
    <p class="text-sm text-slate-600 mt-2">Version 2.4.0 includes performance improvements and bug fixes.</p>
    <button class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
      Update Now
    </button>
  </div>
</slide-drawer>

## Implementation

The drawer uses fixed positioning and CSS transitions for the slide-up animation. The backdrop fades in while the panel translates upward.

```ts src="src/components/SlideDrawer.ts"
```
