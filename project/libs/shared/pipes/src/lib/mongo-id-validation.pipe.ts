import { Types } from 'mongoose';
import {
  ArgumentMetadata,
  BadRequestException,
  ForbiddenException,
  Injectable,
  PipeTransform
} from '@nestjs/common';

const BAD_MONGO_ID_ERROR = 'Bad entity ID';

const PIPE_TYPE_ERROR_MESSAGE = 'This pipe must used only with params!';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  public transform(value: string, { type }: ArgumentMetadata) {
    if (type !== 'param') {
      throw new ForbiddenException(PIPE_TYPE_ERROR_MESSAGE)
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(BAD_MONGO_ID_ERROR);
    }

    return value;
  }
}
