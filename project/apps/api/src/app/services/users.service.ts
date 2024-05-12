import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ApplicationServiceURL } from "@project/api-config";
import { CreateUserDto } from "@project/authentication";
import { saveFile } from "@project/shared/helpers";

@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  public async register(dto: CreateUserDto, avatar?: Express.Multer.File) {
    const id = avatar ? (await saveFile(this.httpService, avatar)).id : undefined;

    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/register`,
      { ...dto, avatarId: id });

    return data;
  }
}
