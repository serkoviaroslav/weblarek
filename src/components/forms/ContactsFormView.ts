import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { FormBase } from './FormBase';
import { VIEW_EVENTS } from '../../utils/events';

/**
 * Форма шага 2: ввод email и телефона.
 */
export class ContactsFormView extends FormBase {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit(VIEW_EVENTS.ORDER_PAY);
    });
  }

  setEmail(value: string): void {
    this.emailInput.value = value;
  }

  setPhone(value: string): void {
    this.phoneInput.value = value;
  }
}
