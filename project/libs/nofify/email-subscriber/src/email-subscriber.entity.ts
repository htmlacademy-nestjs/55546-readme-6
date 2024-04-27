import { Entity, StorableEntity, Subscriber } from '@project/shared/core';

export class EmailSubscriberEntity extends Entity implements StorableEntity<Subscriber> {
  public email: string;
  public name: string;

  constructor(subscriber?: Subscriber) {
    super();
    this.populate(subscriber);
  }

  public populate(subscriber?: Subscriber): void {
    if (!subscriber) {
      return;
    }

    this.id = subscriber.id ?? '';
    this.email = subscriber.email;
    this.name = subscriber.name;
  }

  public toPOJO(): Subscriber {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    }
  }
}
