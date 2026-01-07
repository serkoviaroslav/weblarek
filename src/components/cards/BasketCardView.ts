import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CardBase } from './CardBase';
import type { BasketItemRemovePayload, ProductId } from '../../types';
import { VIEW_EVENTS } from '../../utils/events';

/**
 * Элемент списка товаров в корзине.
 */
export class BasketCardView extends CardBase {
  private readonly deleteButton: HTMLButtonElement;
  private readonly index: HTMLElement;
  private id: ProductId | null = null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.index = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => {
      if (!this.id) return;
      this.events.emit<BasketItemRemovePayload>(VIEW_EVENTS.BASKET_ITEM_REMOVE, { id: this.id });
    });
  }

  setId(id: ProductId): void {
    this.id = id;
  }

  setIndex(value: number): void {
    this.index.textContent = String(value);
  }
}
