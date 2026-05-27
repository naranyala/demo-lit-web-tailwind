# Popup Modal

A centered dialog with backdrop overlay. Useful for confirmations, forms, and detailed views without navigating away.

## Live Demo

<popup-modal>
  <span slot="trigger">
    <span class="text-indigo-600 underline cursor-pointer font-medium">Open confirmation modal</span>
  </span>

  <div class="space-y-3">
    <h3 class="text-lg font-semibold text-slate-800">Confirm Action</h3>
    <p class="text-sm text-slate-600">Are you sure you want to proceed with this action? This cannot be undone.</p>
    <div class="flex gap-2 pt-2">
      <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
        Confirm
      </button>
      <button class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
        Cancel
      </button>
    </div>
  </div>
</popup-modal>

## With Scrollable Content

A modal with enough content to demonstrate internal scrolling:

<popup-modal>
  <button slot="trigger" class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
    View Terms
  </button>

  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-slate-800">Terms of Service</h3>
    <div class="text-sm text-slate-600 space-y-3">
      <p><strong>1. Acceptance.</strong> By accessing this service you agree to be bound by these terms.</p>
      <p><strong>2. Use of Service.</strong> You agree to use the service only for lawful purposes and in accordance with these terms.</p>
      <p><strong>3. Privacy.</strong> Your use of the service is subject to our Privacy Policy, which governs how we collect and use your information.</p>
      <p><strong>4. Intellectual Property.</strong> The service and its original content, features, and functionality are owned by the company and are protected by international copyright laws.</p>
      <p><strong>5. Termination.</strong> We may terminate or suspend your access at any time, without prior notice, for conduct that we believe violates these terms.</p>
      <p><strong>6. Limitation of Liability.</strong> In no event shall the company be liable for any damages arising out of the use or inability to use the service.</p>
      <p><strong>7. Changes.</strong> We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
    </div>
    <button class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
      I Agree
    </button>
  </div>
</popup-modal>

## Implementation

The modal uses fixed positioning to center itself in the viewport. It animates with a fade and subtle scale transition.

```ts src="src/components/PopupModal.ts"
```
