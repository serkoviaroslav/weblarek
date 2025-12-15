import type { IEvents } from '../components/base/Events';

export abstract class BaseModel {
  protected readonly events: IEvents;

  protected constructor(events: IEvents) {
    this.events = events;
  }
}