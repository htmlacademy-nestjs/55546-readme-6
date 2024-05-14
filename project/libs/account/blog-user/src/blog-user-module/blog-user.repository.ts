import { Injectable } from '@nestjs/common';
import { BaseMongoRepository } from '@project/data-access';
import { BlogUserEntity } from "./blog-user.entity";
import { BlogUserFactory } from './blog-user.factory';
import { BlogUserModel } from './blog-user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlogUserRepository extends BaseMongoRepository<BlogUserEntity, BlogUserModel> {
  constructor(
    entityFactory: BlogUserFactory,
    @InjectModel(BlogUserModel.name) blogUserModel: Model<BlogUserModel>
  ) {
    super(entityFactory, blogUserModel);
  }

  public async findByEmail(email: string): Promise<BlogUserEntity | null> {
    const document = await this.model.findOne({ email }).exec();

    return this.createEntityFromDocument(document);
  }

  public async findPublishersList(subscriberId: string): Promise<BlogUserEntity[]> {
    const documents = await this.model.find({ subscribers: subscriberId }).exec();

    return documents.map(document => this.createEntityFromDocument(document));
  }

  public async findListById(listId: string[]): Promise<BlogUserEntity[]> {
    const documents = await this.model.find({ _id: { $in: listId } }).exec();

    return documents.map(document => this.createEntityFromDocument(document));
  }
}
