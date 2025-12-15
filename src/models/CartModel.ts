import type { IEvents } from '../components/base/Events';
import type { IProduct, ProductId } from '../types';
import { BaseModel } from './BaseModel';

export type CartChangedEvent = { items: IProduct[]; count: number; total: number };
export type ProductResolver = (id: ProductId) => IProduct | undefined;

export class CartModel extends BaseModel {
  private readonly resolveProduct: ProductResolver;
  private readonly itemIds: Set<ProductId> = new Set();

  constructor(events: IEvents, resolveProduct: ProductResolver) {
    super(events);
    this.resolveProduct = resolveProduct;
  }

  add(id: ProductId): void {
    this.itemIds.add(id);
    this.emitChange();
  }

  remove(id: ProductId): void {
    this.itemIds.delete(id);
    this.emitChange();
  }

  clear(): void {
    this.itemIds.clear();
    this.emitChange();
  }

  has(id: ProductId): boolean {
    return this.itemIds.has(id);
  }

  getIds(): ProductId[] {
    return Array.from(this.itemIds);
  }

  getItems(): IProduct[] {
    return this.getIds()
      .map((id) => this.resolveProduct(id))
      .filter((p): p is IProduct => Boolean(p));
  }

  getCount(): number {
    return this.itemIds.size;
  }

  getTotal(): number {
    return this.getItems().reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  private emitChange(): void {
    this.events.emit<CartChangedEvent>('cart:changed', {
      items: this.getItems(),
      count: this.getCount(),
      total: this.getTotal(),
    });
  }
}