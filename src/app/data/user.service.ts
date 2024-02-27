import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services';

// import {UserRoleEnum} from "@auth/enums";
// this is existing but unused and does not match roles as returned by
// keycloak today

export enum UserRoleEnum {
  ManageAccount = 'manage-account',
  ManageAccountLinks = 'manage-account-links',
  ViewProfile = 'view-profile',
  DefaultRules = 'default-roles-neims-realm',
  OfflineAccess = 'offline_access',
  UmaAuthentication = 'uma_authorization',
}

export interface User {
  id: string;
  name: string;
  roles: UserRoleEnum[];
}

@Injectable()
export class UserService {
  public user: User;
  public authChange = new Subject<boolean>();

  getUserRoles(): UserRoleEnum[] {
    return [...this.user.roles];
  }

  constructor(private authService: AuthService, private router: Router) {
    this.user = sessionStorage.getItem('user')
      ? JSON.parse(<string>sessionStorage.getItem('user'))
      : undefined;
  }

  private async isAccessAllowed(
    role: keyof typeof UserRoleEnum
  ): Promise<boolean> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['auth/login']).then(() => {
        return false;
      });
    }

    const hasRole = this.authService.getUserRoles().includes(role.toString());
    console.log(
      'userRoles:',
      this.authService.getUserRoles(),
      'role:',
      role,
      'hasRole:',
      hasRole
    );
    return hasRole;
  }

  /*
   * available method to easily check if role exists in user data.
   * */
  async checkRoles(role: string): Promise<boolean> {
    console.log('headerComponent checkRoles roles:', role);
    try {
      return await this.isAccessAllowed(role as keyof typeof UserRoleEnum);
    } catch (e) {
      console.log('user.service checkRoles() await failed');
      throw e;
    }
  }

  static async updateUserCopy(user: User): Promise<boolean> {
    try {
      sessionStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error(`Error setting user: ${error}`);
      throw error;
    }
  }
}
