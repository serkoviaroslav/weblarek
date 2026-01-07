import type { IEvents } from '../components/base/Events';
import type { CartChangedPayload, IProduct, ProductId } from '../types';
import { MODEL_EVENTS } from '../utils/events';
import { BaseModel } from './BaseModel';
export type ProductResolver = (id: ProductId) => IProduct | undefined;

export class CartModel extends BaseModel {
  private readonly resolveProduct: ProductResolver;
  private readonly itemIds: Set<ProductId> = new Set();

  constructor(events: IEvents, resolveProduct: ProductResolver) {
    super(events);
    this.resolveProduct = resolveProduct;
  }

  add(id: ProductId): void {
    const before = this.itemIds.size;
    this.itemIds.add(id);
    if (this.itemIds.size !== before) {
      this.emitChange();
    }
  }

  remove(id: ProductId): void {
    const removed = this.itemIds.delete(id);
    if (removed) {
      this.emitChange();
    }
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
    this.events.emit<CartChangedPayload>(MODEL_EVENTS.CART_CHANGED, {
      items: this.getItems(),
      count: this.getCount(),
      total: this.getTotal(),
    });
  }
}