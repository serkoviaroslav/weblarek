// Centralized event names to avoid "magic strings" across the codebase.
// Keep this file small and stable: events are part of the app's public contract.

export const MODEL_EVENTS = {
  PRODUCTS_CHANGED: 'products:changed',
  CART_CHANGED: 'cart:changed',
  ORDER_CHANGED: 'order:changed',
  PREVIEW_CHANGED: 'preview:changed',
} as const;

export const VIEW_EVENTS = {
  // Catalog / product preview
  CARD_SELECT: 'card:select',
  PRODUCT_TOGGLE: 'product:toggle',

  // Basket
  BASKET_OPEN: 'basket:open',
  BASKET_ITEM_REMOVE: 'basket:item-remove',

  // Order flow
  ORDER_OPEN: 'order:open',
  ORDER_PAYMENT_SELECT: 'order:payment-select',
  ORDER_NEXT: 'order:next',
  ORDER_PAY: 'order:pay',

  // Forms (generic)
  FORM_CHANGE: 'form:change',
  FORM_SUBMIT: 'form:submit',

  // Modal
  MODAL_OPEN: 'modal:open',
  MODAL_CLOSE: 'modal:close',

  // Success
  SUCCESS_CLOSE: 'success:close',
} as const;

export type ModelEventName = (typeof MODEL_EVENTS)[keyof typeof MODEL_EVENTS];
export type ViewEventName = (typeof VIEW_EVENTS)[keyof typeof VIEW_EVENTS];
export type AppEventName = ModelEventName | ViewEventName;
