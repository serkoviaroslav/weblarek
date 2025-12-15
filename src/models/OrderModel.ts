import type { IEvents } from '../components/base/Events';
import type { IOrderForm, IOrderRequest, PaymentMethod, ProductId } from '../types';
import { BaseModel } from './BaseModel';

export type OrderChangedEvent = { form: IOrderForm };

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

  isStep1Valid(): boolean {
    return Boolean(this.form.payment) && this.form.address.trim().length > 0;
  }

  isStep2Valid(): boolean {
    return this.form.email.trim().length > 0 && this.form.phone.trim().length > 0;
  }

  buildOrder(items: ProductId[], total: number): IOrderRequest {
    if (!this.form.payment) throw new Error('Payment method is not selected');
    return { payment: this.form.payment, address: this.form.address, email: this.form.email, phone: this.form.phone, items, total };
  }

  private emitChange(): void {
    this.events.emit<OrderChangedEvent>('order:changed', { form: this.getForm() });
  }
}
