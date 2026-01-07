export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: unknown, method?: ApiPostMethods): Promise<T>;
}

// -----------------------------

export type ProductId = string;

export type PaymentMethod = 'card' | 'cash';

export type Price = number | null;

export interface IProduct {
  id: ProductId;
  title: string;
  description: string;
  image: string;
  category: string;
  price: Price;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderForm {
  payment: PaymentMethod | null;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderRequest {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  items: ProductId[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

// -----------------------------
// Event payload types

// Model -> Presenter
export type ProductsChangedPayload = { products: IProduct[] };
export type CartChangedPayload = { items: IProduct[]; count: number; total: number };
export type OrderChangedPayload = { form: IOrderForm };
export type PreviewChangedPayload = { id: ProductId | null };

// View -> Presenter
export type CardSelectPayload = { id: ProductId };
export type ProductTogglePayload = { id: ProductId };
export type BasketItemRemovePayload = { id: ProductId };
export type PaymentSelectPayload = { payment: PaymentMethod };
export type FormChangePayload = { form: string; field: string; value: string };

// Events without payload
export type VoidPayload = void;

// Optional unified map for stricter typing in Presenter code.
export interface AppEventPayloadMap {
  // Model
  'products:changed': ProductsChangedPayload;
  'cart:changed': CartChangedPayload;
  'order:changed': OrderChangedPayload;
  'preview:changed': PreviewChangedPayload;

  // View
  'card:select': CardSelectPayload;
  'product:toggle': ProductTogglePayload;
  'basket:open': VoidPayload;
  'basket:item-remove': BasketItemRemovePayload;
  'order:open': VoidPayload;
  'order:payment-select': PaymentSelectPayload;
  'order:next': VoidPayload;
  'order:pay': VoidPayload;
  'form:change': FormChangePayload;
  'form:submit': VoidPayload;
  'modal:open': VoidPayload;
  'modal:close': VoidPayload;
  'success:close': VoidPayload;
}