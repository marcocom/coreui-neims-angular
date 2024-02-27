import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  FileRemovedEvent,
  FileUploadedEvent,
  FileUploadError,
} from '@shared/types';

@Component({
  selector: 'aqm-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploaderComponent implements OnDestroy {
  @Input() public uploadUrl!: string;

  @Input() public uploadLabel: string = 'Upload file';

  @Input() public fileIdKey: string = 'id';

  @Input() public fileNameKey: string = 'name';

  @Input() public files: any[] = [];

  @Input() public maxFiles?: number;

  /**
   * Max file size in bytes.
   * Default is 1Mb
   */
  @Input() public maxFileSize: number = 1048576;

  @Input() public minWidth?: number;

  @Input() public minHeight?: number;

  @Input() public accept: string = 'image/*';

  @Output() public fileUploaded = new EventEmitter<FileUploadedEvent>();

  @Output() public fileRemoved = new EventEmitter<FileRemovedEvent>();

  @Output() public fileUploadError = new EventEmitter<FileUploadError>();

  public get canUpload(): boolean {
    const maxFilesExceeded = this.maxFiles
      ? this.files.length >= this.maxFiles
      : false;

    return !maxFilesExceeded && !this.uploading;
  }

  public uploading: boolean = false;
  public fileName: string = '';
  public progress: number = 0;

  private readonly cancel$ = new Subject();

  constructor(
    private httpClient: HttpClient,
    private ngZone: NgZone,
    private cdRef: ChangeDetectorRef
  ) {}

  public ngOnDestroy(): void {
    this.cancel$.next();
    this.cancel$.complete();
  }

  public async onFileSelected(input: HTMLInputElement) {
    if (input.files?.length) {
      const file = input.files[0];
      input.value = '';

      if (file.size > this.maxFileSize) {
        this.fileUploadError.emit({
          type: 'maxSizeExceeded',
          fileSize: file.size,
          maxSize: this.maxFileSize,
        });
        return;
      }

      if (this.minWidth && this.minHeight) {
        try {
          const [width, height] = await this.getImageDimensions(file);

          if (width < this.minWidth || height < this.minHeight) {
            this.fileUploadError.emit({
              type: 'wrongDimensions',
            });
            return;
          }
        } catch (error) {
          this.fileUploadError.emit({
            type: 'wrongDimensions',
          });
          return;
        }
      }

      this.ngZone.runOutsideAngular(() => {
        this.upload(file);
      });
    }
  }

  public upload(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.uploading = true;
    this.fileName = file.name;
    this.progress = 0;

    this.httpClient
      .post(this.uploadUrl, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(takeUntil(this.cancel$))
      .subscribe(
        (event) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.progressChange(event.loaded, event.total!);
              break;
            case HttpEventType.Response:
              this.uploaded(file, event.body);
              break;
          }
        },
        (error: HttpErrorResponse) => {
          this.handleUploadError(error);
        }
      );
  }

  public cancel(): void {
    this.cancel$.next();
  }

  public removeFile(file: any): void {
    this.fileRemoved.emit({
      file,
    });
  }

  private uploaded(file: File, response: any): void {
    this.ngZone.run(() => {
      this.fileUploaded.emit({
        fileName: file.name,
        response,
      });
    });
    this.uploading = false;
    this.cdRef.detectChanges();
  }

  private progressChange(loaded: number, total: number): void {
    this.progress = (loaded * 100) / total;
    this.cdRef.detectChanges();
  }

  private handleUploadError(error: HttpErrorResponse): void {
    this.ngZone.run(() => {
      this.fileUploadError.emit({
        type: 'http',
        res: error,
      });
    });
    this.uploading = false;
    this.cdRef.detectChanges();
  }

  private getImageDimensions(file: File): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = document.createElement('img');
        img.src = reader.result as string;
        img.onload = () => {
          resolve([img.naturalWidth, img.naturalHeight]);
        };
        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  public trackByFunc(index: number, file: any): string | number {
    return file[this.fileIdKey] ?? index;
  }
}
