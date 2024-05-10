import { Injectable } from '@nestjs/common';

import { EntityFactory, Newsletter } from '@project/shared/core';
import { NewsletterEntity } from './newsletter.entity';

@Injectable()
export class NewsletterFactory implements EntityFactory<NewsletterEntity> {
  public create(entityPlainData: Newsletter): NewsletterEntity {
    return new NewsletterEntity(entityPlainData);
  }
}
