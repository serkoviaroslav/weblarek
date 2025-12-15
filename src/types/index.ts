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