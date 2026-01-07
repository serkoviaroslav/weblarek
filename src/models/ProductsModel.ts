import type { IProduct, ProductId, ProductsChangedPayload } from '../types';
import type { IEvents } from '../components/base/Events';
import { MODEL_EVENTS } from '../utils/events';
import { BaseModel } from './BaseModel';

export class ProductsModel extends BaseModel {
  private products: IProduct[] = [];

  constructor(events: IEvents) {
    super(events);
  }

  setProducts(products: IProduct[]): void {
    this.products = [...products];
    this.events.emit<ProductsChangedPayload>(MODEL_EVENTS.PRODUCTS_CHANGED, { products: this.getAll() });
  }

  getAll(): IProduct[] {
    return [...this.products];
  }

  getById(id: ProductId): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }
}