import { Component } from './base/Component';
import type { IEvents } from './base/Events';
import { VIEW_EVENTS } from '../utils/events';
import { ensureElement } from '../utils/utils';

/**
 * Сообщение об успешном оформлении.
 */
export class SuccessView extends Component<never> {
  private readonly events: IEvents;
  private readonly description: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit(VIEW_EVENTS.SUCCESS_CLOSE);
    });
  }

  setTotal(value: number): void {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}
