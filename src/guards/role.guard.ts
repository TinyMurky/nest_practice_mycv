import { Role } from '@/constants/enum/user';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Wrap UseGuards and RoleGuard
 * @param allowRoles - Role that allow to use certain api
 * @returns
 */
export function CheckRoleAuth(allowRoles: Role[]) {
  return UseGuards(new RoleGuard(allowRoles));
}

@Injectable()
/**
 * Check user role from req.currentUser(which is put in middleware)
 */
export class RoleGuard implements CanActivate {
  /**
   * Roles that can pass the guards
   */
  private _roles: Role[];

  constructor(allowRoles: Role[]) {
    this._roles = allowRoles;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    /**
     * The user is from middleware that put into currentUser
     */
    const user = req.currentUser;

    if (!user || !user.role) {
      return false;
    }

    const userRole: Role = user.role;

    return this._roles.includes(userRole);
  }
}
