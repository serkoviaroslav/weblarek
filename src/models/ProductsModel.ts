import type { IProduct, ProductId } from '../types';
import type { IEvents } from '../components/base/Events';
import { BaseModel } from './BaseModel';

export type ProductsChangedEvent = { products: IProduct[] };

export class ProductsModel extends BaseModel {
  private products: IProduct[] = [];

  constructor(events: IEvents) {
    super(events);
  }

  setProducts(products: IProduct[]): void {
    this.products = [...products];
    this.events.emit<ProductsChangedEvent>('products:changed', { products: this.getAll() });
  }

  getAll(): IProduct[] {
    return [...this.products];
  }

  getById(id: ProductId): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }
}