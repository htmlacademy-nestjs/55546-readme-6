import 'multer';
import { ApplicationServiceURL } from '@project/api-config';
import { HttpService } from '@nestjs/axios';

export const saveFile = async (httpService: HttpService, file: Express.Multer.File) => {
  const formData = new FormData();
  const formFile = (new Blob([file.buffer])).slice(0, file.size, file.mimetype);
  formData.append('file', formFile, file.originalname);
  const { data } = await httpService.axiosRef.post(`${ApplicationServiceURL.FilesStorage}/upload`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return data;
}
