import { Component } from './base/Component';

/**
 * Контейнер каталога на главной странице.
 */
export class GalleryView extends Component<never> {
  constructor(container: HTMLElement) {
    super(container);
  }

  setItems(items: HTMLElement[]): void {
    this.container.replaceChildren(...items);
  }
}
