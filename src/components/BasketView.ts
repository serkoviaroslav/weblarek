import { Component } from './base/Component';
import type { IEvents } from './base/Events';
import { VIEW_EVENTS } from '../utils/events';
import { createElement, ensureElement } from '../utils/utils';

/**
 * Представление корзины.
 */
export class BasketView extends Component<never> {
  private readonly events: IEvents;
  private readonly list: HTMLElement;
  private readonly total: HTMLElement;
  private readonly orderButton: HTMLButtonElement;
  private readonly emptyRow: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.list = ensureElement<HTMLElement>('.basket__list', this.container);
    this.total = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.emptyRow = createElement('li', { className: 'basket__empty', textContent: 'Корзина пуста' });

    this.orderButton.addEventListener('click', () => {
      this.events.emit(VIEW_EVENTS.ORDER_OPEN);
    });
  }

  setItems(items: HTMLElement[]): void {
    this.list.replaceChildren(...items);
  }

  setTotal(value: number): void {
    this.total.textContent = `${value} синапсов`;
  }

  setOrderEnabled(enabled: boolean): void {
    this.orderButton.disabled = !enabled;
  }

  setEmpty(isEmpty: boolean): void {
    if (isEmpty) {
      this.list.replaceChildren(this.emptyRow);
      this.setOrderEnabled(false);
      return;
    }

    // Если корзина наполнилась — содержимое списка задаётся через setItems()
    // Здесь только убираем плейсхолдер на случай последовательных вызовов.
    if (this.list.contains(this.emptyRow)) {
      this.list.replaceChildren();
    }
  }
}
