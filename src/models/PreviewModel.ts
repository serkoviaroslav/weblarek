import type { IEvents } from '../components/base/Events';
import type { PreviewChangedPayload, ProductId } from '../types';
import { MODEL_EVENTS } from '../utils/events';
import { BaseModel } from './BaseModel';

/**
 * Модель выбранного для просмотра товара.
 * Хранит только id выбранного товара и эмитит событие при изменении.
 */
export class PreviewModel extends BaseModel {
  private selectedId: ProductId | null = null;

  constructor(events: IEvents) {
    super(events);
  }

  setSelected(id: ProductId | null): void {
    this.selectedId = id;
    this.events.emit<PreviewChangedPayload>(MODEL_EVENTS.PREVIEW_CHANGED, { id: this.getSelected() });
  }

  clear(): void {
    this.setSelected(null);
  }

  getSelected(): ProductId | null {
    return this.selectedId;
  }
}
