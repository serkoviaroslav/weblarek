import { Api } from '../components/base/Api';
import type { IApi, IOrderRequest, IOrderResponse, IProductsResponse } from '../types';

export class LarekApi {
  private readonly api: IApi;

  private static readonly PRODUCTS_ENDPOINT = '/product';
  private static readonly ORDER_ENDPOINT = '/order';

  constructor(baseUrl: string, options?: RequestInit) {
    this.api = new Api(baseUrl, options);
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>(LarekApi.PRODUCTS_ENDPOINT);
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>(LarekApi.ORDER_ENDPOINT, order);
  }
}
