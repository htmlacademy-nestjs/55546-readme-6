import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform, UseInterceptors } from "@nestjs/common";
import { CreatePostDto } from "../dto/create-post.dto";
import { plainToClass } from "class-transformer";
import { CreateTextPostDto } from "../dto/create-text-post.dto";
import { ValidationError, validate } from "class-validator";
import { CreateVideoPostDto } from "../dto/create-video-post.dto";
import { CreateQuotePostDto } from "../dto/create-quote-post.dto";
import { CreateLinkPostDto } from "../dto/create-link-post.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreatePhotoPostDto } from "../dto/create-photo-post.dto";

@Injectable()
export class PostValidationPipe implements PipeTransform {
  @UseInterceptors(FileInterceptor('photo'))
  async transform(post: CreatePostDto, metadata: ArgumentMetadata) {
    if (metadata.type === 'custom') {
      return;
    }
    if (metadata.type !== 'body') {
      throw new Error('This pipe must used only with body!')
    }

    let postDto = null;

    switch (post.type) {
      case 'Photo':
        postDto = CreatePhotoPostDto;
        break;
      case "Video":
        postDto = CreateVideoPostDto;
        break;
      case "Text":
        postDto = CreateTextPostDto;
        break;
      case "Quote":
        postDto = CreateQuotePostDto;
        break;
      case "Link":
        postDto = CreateLinkPostDto;
        break;

      default:
        throw new Error("Method not implemented.");
    }

    const errors = await validate(plainToClass(postDto, post));
    // if (post.type === 'Photo') {
    //   const photoId = photo ? (await saveFile(this.httpService, photo)).id : undefined;
    //   console.log('photoId', photoId);
    //   errors = await validate(plainToClass(CreatePhotoPostDto, { ...post, photoId }));
    // } else {
    //   const postDto = ({
    //     Video: CreateVideoPostDto,
    //     Text: CreateTextPostDto,
    //     Quote: CreateQuotePostDto,
    //     Link: CreateLinkPostDto
    //   }[post.type]);
    //
    //   errors = await validate(plainToClass(postDto, post));
    // }

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
