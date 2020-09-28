import HttpException from './HttpException';

export class NoFileUploadedException extends HttpException {
  constructor() {
    super(400, 'No files were uploaded');
  }
}

export class InvalidUploadedFiles extends HttpException {
  constructor() {
    super(400, 'Uploaded files are not valid');
  }
}
