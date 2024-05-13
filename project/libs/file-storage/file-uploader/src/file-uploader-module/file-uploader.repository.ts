import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseMongoRepository } from '@project/data-access';
import { FileUploaderEntity } from './file-uploader.entity';
import { FileUploaderFactory } from './file-uploader.factory';
import { FileModel } from './file.model';

@Injectable()
export class FileUploaderRepository extends BaseMongoRepository<FileUploaderEntity, FileModel> {
  constructor(
    entityFactory: FileUploaderFactory,
    @InjectModel(FileModel.name) fileModel: Model<FileModel>
  ) {
    super(entityFactory, fileModel);
  }

  public async getFilesById(filesIds: string[]) {
    const files = await this.model.find({
      _id: { $in: filesIds.map(id => new Types.ObjectId(id)) }
    });

    return files.map(file => this.createEntityFromDocument(file));
  }
}
