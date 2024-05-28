import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageConfig, getMongooseOptions } from '@project/file-storage-config';
import { FileUploaderEntity, FileUploaderModule, FileUploaderRepository, FileUploaderService } from '@project/file-uploader';
import { extension } from 'mime-types';
import { randomUUID } from 'node:crypto';
import path from 'path';
import request from 'supertest';

const files = [
  {
    id: '664580718bb454975c35936e',
    originalName: 'file2.jpg',
    hashName: '32f98b15-4830-4ce6-a8f3-f0da2832d4ae.jpeg',
    subDirectory: '2024/05',
    mimetype: 'image/jpeg',
    size: 272509,
    path: '/home/arcmag/www/html-academy/nest-js/55546-readme-6/project/apps/file-storage/uploads/2024/05/32f98b15-4830-4ce6-a8f3-f0da2832d4ae.jpeg',
    createdAt: new Date('2018-02-04'),
    updatedAt: new Date('2018-02-04'),
  },
  {
    id: '664580808bb454975c359370',
    originalName: 'new-file.jpg',
    hashName: 'c832f122-68ec-4d97-bdd2-c605b3aed6ac.jpeg',
    subDirectory: '2024/05',
    mimetype: 'image/jpeg',
    size: 112501,
    path: '/home/arcmag/www/html-academy/nest-js/55546-readme-6/project/apps/file-storage/uploads/2024/05/c832f122-68ec-4d97-bdd2-c605b3aed6ac.jpeg',
    createdAt: new Date('2018-02-04'),
    updatedAt: new Date('2018-02-04'),
  },
  {
    id: '6645817f8bb454975c359373',
    originalName: 'test-file.jpg',
    hashName: '68e898c4-dce2-46bb-9f78-0af7850c476b.jpeg',
    subDirectory: '2024/05',
    mimetype: 'image/jpeg',
    size: 372509,
    path: '/home/arcmag/www/html-academy/nest-js/55546-readme-6/project/apps/file-storage/uploads/2024/05/68e898c4-dce2-46bb-9f78-0af7850c476b.jpeg',
    createdAt: new Date('2018-02-04'),
    updatedAt: new Date('2018-02-04'),
  },
  {
    id: '6645825a8bb454975c35937a',
    originalName: 'image.jpg',
    hashName: 'ba8fe606-b530-46db-b61e-a69dcbe96256.jpeg',
    subDirectory: '2024/05',
    mimetype: 'image/jpeg',
    size: 72509,
    path: '/home/arcmag/www/html-academy/nest-js/55546-readme-6/project/apps/file-storage/uploads/2024/05/ba8fe606-b530-46db-b61e-a69dcbe96256.jpeg',
    createdAt: new Date('2018-02-04'),
    updatedAt: new Date('2018-02-04'),
  },
  {
    id: '664582688bb454975c35937c',
    originalName: 'updated-test-file.jpg',
    hashName: '0018c2e5-236e-4d95-b983-2032bf65c907.jpeg',
    subDirectory: '2024/05',
    mimetype: 'image/jpeg',
    size: 735503,
    path: '/home/arcmag/www/html-academy/nest-js/55546-readme-6/project/apps/file-storage/uploads/2024/05/0018c2e5-236e-4d95-b983-2032bf65c907.jpeg',
    createdAt: new Date('2018-02-04'),
    updatedAt: new Date('2018-02-04'),
  }
];

const CREATED_FILE_ID = '6644d3e02be96a0c33406cd0';

const NON_EXISTED_FILE_ID = '6644543187b734dd223d4641';

describe('Testing FileStorageController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        FileUploaderModule,
        ConfigModule.forRoot({
          isGlobal: true,
          cache: false,
          load: [FileStorageConfig],
          envFilePath: path.resolve(__dirname, '../../../file-storage/file-storage.env')
        }),
        MongooseModule.forRootAsync(getMongooseOptions())
      ]
    }).compile();

    app = module.createNestApplication();

    await app.init();

    const fileUploaderRepository = app.get<FileUploaderRepository>(FileUploaderRepository);
    const fileUploaderService = app.get<FileUploaderService>(FileUploaderService);

    jest.spyOn(fileUploaderService, 'writeFile')
      .mockImplementation(async (file: Express.Multer.File) => {
        const fileExtension = extension(file.mimetype) || '';
        const subDirectory = fileUploaderService.getSubUploadDirectoryPath();
        const filename = `${randomUUID()}.${fileExtension}`;
        const path = fileUploaderService.getDestinationFilePath(filename);

        return { fileExtension, filename, path, subDirectory };
      });

    jest.spyOn(fileUploaderRepository, 'findById')
      .mockImplementation(async (id: string) => {
        const file = files.find(file => file.id === id);

        return file ? new FileUploaderEntity(file) : null;
      });

    jest.spyOn(fileUploaderRepository, 'getFilesById')
      .mockImplementation(async (filesIds: string[]) => {
        return files.filter(file => filesIds.includes(file.id))
          .map(file => new FileUploaderEntity(file));
      });

    jest.spyOn(fileUploaderRepository, 'save')
      .mockImplementation(async (entity: FileUploaderEntity) => {
        entity.id = CREATED_FILE_ID;
        files.push(entity.toPOJO() as any)
        return;
      });
  });

  it('getting files list by their ids', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/files/get-files-by-id')
      .send({ filesIds: files.slice(0, 3).map(file => file.id) })
      .expect(HttpStatus.OK)

    expect(body).toHaveLength(3);
  });

  it('getting files upon transfer wrong file mongo id', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/files/get-files-by-id')
      .send({ filesIds: ['wrong-mongo-id'] })
      .expect(HttpStatus.OK);

    expect(body).toHaveLength(0);
  });

  it('upload a file to the file storage', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/files/upload')
      .attach('file', __filename)
      .expect(HttpStatus.CREATED);

    expect(body.id).toBe(CREATED_FILE_ID);
  });

  it('getting a file by id', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/files/${CREATED_FILE_ID}`)
      .expect(HttpStatus.OK);

    expect(body.id).toBe(CREATED_FILE_ID);
  });

  it('getting a non-existed file by id', async () => {
    await request(app.getHttpServer())
      .get(`/files/${NON_EXISTED_FILE_ID}`)
      .expect(HttpStatus.NOT_FOUND);
  });

  it('receiving an error when transfer wrong file mongo id', async () => {
    await request(app.getHttpServer())
      .get(`/files/wrong-file-mongo-id`)
      .expect(HttpStatus.BAD_REQUEST);
  });

  afterAll(async () => {
    await app.close();
  });
});
