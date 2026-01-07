import type { IEvents } from '../components/base/Events';
import type { IOrderForm, IOrderRequest, OrderChangedPayload, PaymentMethod, ProductId } from '../types';
import { MODEL_EVENTS } from '../utils/events';
import { BaseModel } from './BaseModel';
export type OrderErrors = Partial<Record<keyof IOrderForm, string>>;

export class OrderModel extends BaseModel {
  private form: IOrderForm = { payment: null, address: '', email: '', phone: '' };

  constructor(events: IEvents) {
    super(events);
  }

  getForm(): IOrderForm {
    return { ...this.form };
  }

  setPayment(payment: PaymentMethod | null): void {
    this.form.payment = payment;
    this.emitChange();
  }

  setAddress(address: string): void {
    this.form.address = address;
    this.emitChange();
  }

  setContacts(email: string, phone: string): void {
    this.form.email = email;
    this.form.phone = phone;
    this.emitChange();
  }

  clear(): void {
    this.form = { payment: null, address: '', email: '', phone: '' };
    this.emitChange();
  }

  validateStep1(): OrderErrors {
    const errors: OrderErrors = {};

    if (!this.form.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.form.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }

  validateStep2(): OrderErrors {
    const errors: OrderErrors = {};

    if (!this.form.email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this.form.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }

  isStep1Valid(): boolean {
    return Object.keys(this.validateStep1()).length === 0;
  }

  isStep2Valid(): boolean {
    return Object.keys(this.validateStep2()).length === 0;
  }

  buildOrder(items: ProductId[], total: number): IOrderRequest {
    const errors = { ...this.validateStep1(), ...this.validateStep2() };
    if (Object.keys(errors).length > 0) {
      throw new Error('Order form is not valid');
    }

    return {
      payment: this.form.payment as PaymentMethod,
      address: this.form.address,
      email: this.form.email,
      phone: this.form.phone,
      items,
      total,
    };
  }

  private emitChange(): void {
    this.events.emit<OrderChangedPayload>(MODEL_EVENTS.ORDER_CHANGED, { form: this.getForm() });
  }
}
