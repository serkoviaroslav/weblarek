import type { IEvents } from '../base/Events';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import type { PaymentMethod, PaymentSelectPayload } from '../../types';
import { FormBase } from './FormBase';
import { VIEW_EVENTS } from '../../utils/events';

/**
 * Форма шага 1: выбор способа оплаты и ввод адреса.
 */
export class OrderFormView extends FormBase {
  private readonly paymentButtons: HTMLButtonElement[];
  private readonly addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons .button', this.form);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);

    this.paymentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('name') as PaymentMethod | null;
        if (!name) return;
        this.events.emit<PaymentSelectPayload>(VIEW_EVENTS.ORDER_PAYMENT_SELECT, { payment: name });
      });
    });

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit(VIEW_EVENTS.ORDER_NEXT);
    });
  }

  setPayment(value: PaymentMethod | null): void {
    this.paymentButtons.forEach((btn) => {
      const isActive = value !== null && btn.getAttribute('name') === value;
      btn.classList.toggle('button_alt-active', isActive);
    });
  }

  setAddress(value: string): void {
    this.addressInput.value = value;
  }
}
