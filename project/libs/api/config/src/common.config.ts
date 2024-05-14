export enum ApplicationServiceURL {
  Users = 'http://localhost:4000/api/auth',
  Blog = 'http://localhost:3002/api/posts',
  FilesStorage = 'http://localhost:3003/api/files',
  Notify = 'http://localhost:3004/api',
}

export const HttpClient = {
  MaxRedirects: 5,
  Timeout: 3000
}
