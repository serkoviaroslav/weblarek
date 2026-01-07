import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CardBase } from './CardBase';
import type { Price, ProductTogglePayload } from '../../types';
import { VIEW_EVENTS } from '../../utils/events';

export class PreviewCardView extends CardBase {
  private readonly actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionButton.addEventListener('click', () => {
      if (!this.id) return;
      this.events.emit<ProductTogglePayload>(VIEW_EVENTS.PRODUCT_TOGGLE, { id: this.id });
    });
  }

  setActionState(inCart: boolean, price: Price): void {
    if (price === null) {
      this.actionButton.disabled = true;
      this.actionButton.textContent = 'Недоступно';
      return;
    }
    this.actionButton.disabled = false;
    this.actionButton.textContent = inCart ? 'Удалить из корзины' : 'Купить';
  }
}
