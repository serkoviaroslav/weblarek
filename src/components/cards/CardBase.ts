import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import type { Price } from '../../types';

/**
 * Базовый класс карточки товара.
 * В дочерние классы выносятся различия шаблонов и конкретные пользовательские действия.
 */
export abstract class CardBase extends Component<never> {
  protected readonly events: IEvents;

  protected readonly title: HTMLElement;
  protected readonly price: HTMLElement;
  protected readonly category?: HTMLElement;
  protected readonly image?: HTMLImageElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.title = ensureElement<HTMLElement>('.card__title', this.container);
    this.price = ensureElement<HTMLElement>('.card__price', this.container);

    // Не во всех шаблонах есть категория/картинка
    this.category = this.container.querySelector<HTMLElement>('.card__category') ?? undefined;
    this.image = this.container.querySelector<HTMLImageElement>('.card__image') ?? undefined;
  }

  setTitle(value: string): void {
    this.title.textContent = value;
  }

  setPrice(value: Price): void {
    this.price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }

  setCategory(value: string): void {
    if (!this.category) return;
    this.category.textContent = value;

    // Сначала очищаем предыдущие модификаторы
    Object.values(categoryMap).forEach((cls) => this.category!.classList.remove(cls));

    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.category.classList.add(modifier);
    }
  }

  setImageSource(src: string, alt?: string): void {
    if (!this.image) return;
    super.setImage(this.image, src, alt);
  }
}
