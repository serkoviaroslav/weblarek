import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CardBase } from './CardBase';
import type { Price, ProductId, ProductTogglePayload } from '../../types';
import { VIEW_EVENTS } from '../../utils/events';

/**
 * Карточка подробного просмотра товара (контент модального окна).
 */
export class PreviewCardView extends CardBase {
  private readonly actionButton: HTMLButtonElement;
  private id: ProductId | null = null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionButton.addEventListener('click', () => {
      if (!this.id) return;
      // View не принимает решений "купить/удалить" — только сообщает о клике
      this.events.emit<ProductTogglePayload>(VIEW_EVENTS.PRODUCT_TOGGLE, { id: this.id });
    });
  }

  setId(id: ProductId): void {
    this.id = id;
  }

  /**
   * Настраивает состояние кнопки покупки.
   *
   * @param inCart находится ли товар в корзине
   * @param price цена товара (если null — товар недоступен)
   */
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
