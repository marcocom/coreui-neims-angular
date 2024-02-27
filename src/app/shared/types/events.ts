import { HttpErrorResponse } from '@angular/common/http';

export interface FileUploadedEvent<T = any> {
  fileName: string;
  response: T;
}

export interface FileRemovedEvent<T = any> {
  file: T;
}

export interface FileUploadError {
  type: 'http' | 'canceled' | 'maxSizeExceeded' | 'wrongDimensions';
  res?: HttpErrorResponse;
  maxSize?: number;
  fileSize?: number;
}
