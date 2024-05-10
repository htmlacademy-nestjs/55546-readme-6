import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { NewsletterEntity } from './newsletter.entity';
import { NewsletterFactory } from './newsletter.factory';
import { NewsletterModel } from './newsletter.model';

@Injectable()
export class NewsletterRepository extends BaseMongoRepository<NewsletterEntity, NewsletterModel> {
  constructor(
    entityFactory: NewsletterFactory,
    @InjectModel(NewsletterModel.name) newsletterModel: Model<NewsletterModel>
  ) {
    super(entityFactory, newsletterModel);
  }

  public async getLastNewsletter() {
    const document = await this.model.findOne().sort({ lastMailingDate: -1 }).exec();
    if (!document) {
      const newEntity = new NewsletterEntity({ lastMailingDate: new Date() });
      await this.save(newEntity);

      return newEntity;
    }

    return this.createEntityFromDocument(document);
  }
}
