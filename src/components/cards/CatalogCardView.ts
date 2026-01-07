import type { IEvents } from '../base/Events';
import { CardBase } from './CardBase';
import { VIEW_EVENTS } from '../../utils/events';
import type { CardSelectPayload } from '../../types';

export class CatalogCardView extends CardBase {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener('click', () => {
      if (!this.id) return;
      this.events.emit<CardSelectPayload>(VIEW_EVENTS.CARD_SELECT, { id: this.id });
    });
  }
}
