import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, UseInterceptors } from "@nestjs/common";
import { CreatePostDto } from "../dto/create-post.dto";
import { plainToClass } from "class-transformer";
import { CreateTextPostDto } from "../dto/create-text-post.dto";
import { ValidationError, validate } from "class-validator";
import { CreateVideoPostDto } from "../dto/create-video-post.dto";
import { CreateQuotePostDto } from "../dto/create-quote-post.dto";
import { CreateLinkPostDto } from "../dto/create-link-post.dto";
import { CreatePhotoPostDto } from "../dto/create-photo-post.dto";
import { PostType } from "@prisma/client";

@Injectable()
export class PostValidationPipe implements PipeTransform {
  async transform(post: CreatePostDto, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return post;
    }

    let postDto = null;

    switch (post.type) {
      case PostType.Photo:
        postDto = CreatePhotoPostDto;
        break;
      case PostType.Video:
        postDto = CreateVideoPostDto;
        break;
      case PostType.Text:
        postDto = CreateTextPostDto;
        break;
      case PostType.Quote:
        postDto = CreateQuotePostDto;
        break;
      case PostType.Link:
        postDto = CreateLinkPostDto;
        break;

      default:
        throw new Error("Method not implemented.");
    }

    const errors = await validate(plainToClass(postDto, post));

    if (errors.length === 0) {
      return post;
    }

    throw new HttpException({ errors: this.formatError(errors) }, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  formatError(errors: ValidationError[]) {
    return errors.reduce((result, error) => {
      result[error.property] = Object.values(error.constraints);
      return result;
    }, {});
  }
}
