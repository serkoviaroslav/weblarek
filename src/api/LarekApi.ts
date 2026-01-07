import type { IApi, IOrderRequest, IOrderResponse, IProductsResponse } from '../types';

export class LarekApi {
  private static readonly PRODUCTS_ENDPOINT = '/product';
  private static readonly ORDER_ENDPOINT = '/order';

  constructor(private readonly api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>(LarekApi.PRODUCTS_ENDPOINT);
  }

  postOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>(LarekApi.ORDER_ENDPOINT, order);
  }
}
