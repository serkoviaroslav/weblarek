import type { IEvents } from '../base/Events';
import { CardBase } from './CardBase';
import { VIEW_EVENTS } from '../../utils/events';
import type { CardSelectPayload, ProductId } from '../../types';

/**
 * Карточка товара в каталоге.
 * По клику генерирует событие выбора товара для просмотра.
 */
export class CatalogCardView extends CardBase {
  private id: ProductId | null = null;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener('click', () => {
      if (!this.id) return;
      this.events.emit<CardSelectPayload>(VIEW_EVENTS.CARD_SELECT, { id: this.id });
    });
  }

  setId(id: ProductId): void {
    // ID — это не данные предметной области для отображения, а ссылка/идентификатор
    // для генерации события. Хранится локально.
    this.id = id;
  }
}
