import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { PostType } from "@prisma/client";
import { ApplicationServiceURL } from "@project/api-config";
import { BlogPostQuery, UpdatePostDto } from "@project/blog-post";
import { saveFile } from "@project/shared/helpers";

@Injectable()
export class BlogService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  public async getPostsWithAdditionalData(posts) {
    const usersIds = [...new Set(posts.map(({ authorId }) => authorId))];
    const filesIds = posts.reduce((photos, post) => {
      if (post.type === PostType.Photo && post.photo) {
        photos.push(post.photo);
      }

      return photos;
    }, []);

    const { data: users } = await this.httpService
      .axiosRef.post(`${ApplicationServiceURL.Users}/get-users-by-id`, { usersIds });

    const { data: photos } = await this.httpService
      .axiosRef.post(`${ApplicationServiceURL.FilesStorage}/get-files-by-id`, { filesIds });

    return posts.map(post => {
      if (post.type === PostType.Photo && post.photo) {
        post.photo = photos.find(photo => {
          return photo.id === post.photo;
        });
      }

      return { ...post, user: users.find(user => user.id === post.authorId) };
    })
  }

  public async show(id: string) {
    const { data: post } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Blog}/${id}`);

    const { data: author } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Users}/${post.authorId}`);

    post.author = author;

    if (post.photo) {
      const { data: photo } = await this.httpService
        .axiosRef.get(`${ApplicationServiceURL.FilesStorage}/${post.photo}`);

      post.photo = photo;
    }

    return post;
  }

  public async savePostFile(dto: UpdatePostDto, photo?: Express.Multer.File) {
    const photoId = photo ? (await saveFile(this.httpService, photo)).id : undefined;
    return dto.type === 'Photo' ? { ...dto, photoId } : dto;
  }

  public async getContentRibbon(subscriberId: string, params: BlogPostQuery) {
    const { data: publishers } = await this.httpService
      .axiosRef.get(`${ApplicationServiceURL.Users}/get-publishers-list`);

    const { data: posts } = await this.httpService
      .axiosRef.post(`${ApplicationServiceURL.Blog}/content-ribbon`,
        publishers.reduce((list, publisher) => [...list, publisher.id], [subscriberId]),
        { params }
      );

    return {
      ...posts,
      entities: await this.getPostsWithAdditionalData(posts.entities)
    };
  }
}
