import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { VIEW_EVENTS } from '../../utils/events';
import type { FormChangePayload } from '../../types';

/**
 * Базовый класс форм. Реализует:
 * - кэш DOM-элементов
 * - обработку ввода
 * - отображение ошибок
 * - управление состоянием submit-кнопки
 */
export abstract class FormBase extends Component<never> {
  protected readonly events: IEvents;
  protected readonly form: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errors: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this.form = container;

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
    this.errors = ensureElement<HTMLElement>('.form__errors', this.form);

    // Инпуты: генерируем единое событие изменения формы
    this.form.addEventListener('input', (evt) => {
      const target = evt.target;
      if (!(target instanceof HTMLInputElement)) return;
      this.events.emit<FormChangePayload>(VIEW_EVENTS.FORM_CHANGE, {
        form: this.form.name,
        field: target.name,
        value: target.value,
      });
    });

    // submit обрабатывается в дочерних классах (каждый генерирует своё событие)
    this.form.addEventListener('submit', (evt) => evt.preventDefault());
  }

  setSubmitEnabled(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }

  setErrors(messages: string[]): void {
    this.errors.textContent = messages.filter(Boolean).join('; ');
  }

  clear(): void {
    this.form.reset();
    this.setErrors([]);
    this.setSubmitEnabled(false);
  }
}
