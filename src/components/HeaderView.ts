import { Component } from './base/Component';
import type { IEvents } from './base/Events';
import { VIEW_EVENTS } from '../utils/events';
import { ensureElement } from '../utils/utils';

/**
 * Блок шапки страницы: кнопка корзины и счётчик товаров.
 */
export class HeaderView extends Component<never> {
  private readonly basketButton: HTMLButtonElement;
  private readonly counter: HTMLElement;
  private readonly events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit(VIEW_EVENTS.BASKET_OPEN);
    });
  }

  setCounter(value: number): void {
    this.counter.textContent = String(value);
  }
}
