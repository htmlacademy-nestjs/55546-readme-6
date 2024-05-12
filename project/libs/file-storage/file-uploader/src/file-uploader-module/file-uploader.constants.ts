export const ParamDescription = {
  FileId: 'File ID',
} as const;

export const FileResponseMessage = {
  FoundFileList: 'Successfully retrieving a list of files',
  FileCreated: 'The new file has been successfully created',
  FileFound: 'File found',
  FileNotFound: 'File not found',
  BadMongoIdError: 'Bad entity mongo ID',
} as const;
