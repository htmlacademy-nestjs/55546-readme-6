import { Entity, Newsletter, StorableEntity } from '@project/shared/core';

export class NewsletterEntity extends Entity implements StorableEntity<Newsletter> {
  public lastMailingDate: Date;

  constructor(newsletter?: Newsletter) {
    super();
    this.populate(newsletter);
  }

  public populate(newsletter?: Newsletter): void {
    if (!newsletter) {
      return;
    }

    this.id = newsletter.id ?? '';
    this.lastMailingDate = newsletter.lastMailingDate ?? new Date();
  }

  public toPOJO(): Newsletter {
    return {
      id: this.id,
      lastMailingDate: this.lastMailingDate,
    }
  }
}
