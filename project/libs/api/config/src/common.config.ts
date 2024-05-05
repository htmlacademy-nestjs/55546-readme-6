export enum ApplicationServiceURL {
  Users = 'http://localhost:4000/api/auth',
  Blog = 'http://localhost:3002/api/posts',
  FilesStorage = 'http://localhost:3003/api/files',
}

export const HttpClient = {
  MaxRedirects: 5,
  Timeout: 3000
}
