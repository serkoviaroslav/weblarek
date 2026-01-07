import { Component } from './base/Component';
import type { IEvents } from './base/Events';
import { VIEW_EVENTS } from '../utils/events';
import { ensureElement } from '../utils/utils';

/**
 * Компонент модального окна.
 *
 * Важно: от этого класса не наследуются другие классы.
 * Контент модального окна — независимые компоненты, которые можно отрендерить
 * в любой контейнер.
 */
export class Modal extends Component<never> {
  private readonly content: HTMLElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly events: IEvents;
  private isOpen = false;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.content = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (evt) => {
      // закрытие по клику вне окна (по оверлею)
      if (evt.target === this.container) {
        this.close();
      }
    });
  }

  open(content: HTMLElement): void {
    this.content.replaceChildren(content);
    this.container.classList.add('modal_active');
    this.lockScroll(true);
    this.isOpen = true;
    this.events.emit(VIEW_EVENTS.MODAL_OPEN);
  }

  close(): void {
    if (!this.isOpen) return;
    this.content.replaceChildren();
    this.container.classList.remove('modal_active');
    this.lockScroll(false);
    this.isOpen = false;
    this.events.emit(VIEW_EVENTS.MODAL_CLOSE);
  }

  /**
   * Блокировка прокрутки страницы при открытом модальном окне.
   */
  private lockScroll(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : '';
  }
}
