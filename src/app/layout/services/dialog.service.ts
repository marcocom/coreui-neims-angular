import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  Confirmation,
  ConfirmationService,
  Message,
  MessageService,
} from 'primeng/api';

import { DialogComponent } from '@layout/components/dialog/dialog.component';

const DEFAULT_CONFIRMATION_CONFIG: Partial<Confirmation> = {
  acceptLabel: 'Confirm',
  rejectLabel: 'Cancel',
  acceptIcon: 'none',
  rejectIcon: 'none',
};

const DEFAULT_TOAST_CONFIG: Partial<Message> = {
  life: 10000,
};

@Injectable({
  providedIn: 'root',
})
export class DialogUIService {
  public dialogRef!: DynamicDialogRef;

  constructor(
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public openModal(): void {
    this.dialogRef = this.dialogService.open(DialogComponent, {});
  }

  public openConfirm(options: Confirmation): void {
    this.confirmationService.confirm({
      ...DEFAULT_CONFIRMATION_CONFIG,
      ...options,
    });
  }

  public openAlert(options: Partial<Message>): void {
    this.messageService.add({ ...DEFAULT_TOAST_CONFIG, ...options });
  }

  public close(): void {
    this.dialogRef.close();
  }
}
