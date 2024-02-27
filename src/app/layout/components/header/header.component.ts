import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

import { AuthService } from '@auth/services';
import { DialogUIService } from '@app/layout/services/dialog.service';
import { UserService, UserRoleEnum } from '@data/user.service';

@Component({
  selector: 'aqm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public selectedLanguage = {};
  public profileMenuOpened: boolean = false;
  private isAuthenticated: boolean = false;

  public readonly userActions: MenuItem[] = [
    {
      label: $localize`:Logout header user-menu action|:Logout`,
      command: () => this.logout(),
    },
  ];

  public readonly languages: MenuItem[] = [
    { label: $localize`:English menu option|:English`, target: 'EN' },
    // TODO: uncomment after second language will be provided
    // { label: 'Arabic', target: 'ARB' },
  ];

  public readonly menuTabItems: MenuItem[] = [
    { label: $localize`:Map header menu option|:Map`, routerLink: '/map' },
    {
      label: $localize`:Locations header menu option|:Locations`,
      routerLink: '/locations',
    },
  ];

  public get currentUserName(): string {
    return this.authService.getUsername();
  }

  constructor(
    private authService: AuthService,
    private dialogUIService: DialogUIService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    const testRole: string = UserRoleEnum.ViewProfile;
    this.isAuthenticated = await this.userService
      .checkRoles(testRole)
      .then((b) => b);
    console.log(
      'HeaderComponent ngOnInit() isAuthenticated:' + this.isAuthenticated
    );
  }

  private logout(): void {
    this.dialogUIService.openConfirm({
      accept: () =>
        this.authService.logout().catch(() =>
          this.dialogUIService.openAlert({
            summary: $localize`:Logout error title|:An error occurred`,
            detail: $localize`:Logout error message|:Impossible to logout`,
          })
        ),
      header: $localize`:Logout dialog message|:Do you want to logout?`,
    });
  }
}
