/**
 * See docs/authorization.md at the root of the project to learn more of
 * how this work.
 */

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ActionIsNotPartOfPermissionException, PermissionNotFoundException, UserNotFoundException } from 'src/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ActionOperation, ActionUpdateDto } from "../dto/action-update.dto";
import { IPermissionClassDto } from '../dto/permission-class.dto';
import { UpdateUserPermissionsDto } from '../dto/update-user-permissions.dto';
import { IPermissionClass } from '../permission-class';
import { PERMISSIONS_STORE } from '../permissions.store';

class PermissionAction {
  constructor(public action: string, public operation: ActionOperation) {}

  static fromString(str: string): PermissionAction {
    if (str.startsWith("!")) {
      return new this(str.substring(1), ActionOperation.Disallow);
    }
    return new this(str, ActionOperation.Allow);
  }

  static fromDto(dto: ActionUpdateDto) {
    return new this(dto.action, dto.operation);
  }

  toStr(): string {
    switch(this.operation) {
      case ActionOperation.Allow:
        return this.action;
      case ActionOperation.Disallow:
        return `!${this.action};`
      default:
        return '';
    }
  }
}

class PermissionActions {
  constructor(public actions: PermissionAction[] = []) {}

  toStr(): string {
    return this.actions
      .filter(action => action.operation !== ActionOperation.Unset)
      .map(action => action.toStr())
      .join(',');
  }

  static fromString(str: string): PermissionActions {
    return new PermissionActions(str.split(',').map(a => PermissionAction.fromString(a)));
  }

  mergeWithDto(dtos: ActionUpdateDto[]) {
    dtos.forEach(dto => {
      // First we will delete action from collection if it exists in dto
      this.actions = this.actions.filter(a => a.action !== dto.action);

      // If dto operation is unset then we will just return
      if (dto.operation === ActionOperation.Unset) {
        return;
      }

      // Otherwise we will add an action
      this.actions.push(PermissionAction.fromDto(dto));
    });
  }
}

@Injectable()
export class AuthorizationService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService
  ) {}

  listPermissionClasses(): IPermissionClassDto[] {
    return Array.from(PERMISSIONS_STORE.entries())
      .map(([key, permission]) => ({
        name: permission.name,
        key,
        description: permission.Description,
        actions: Object.keys(permission.Action)
      }));
  }

  getPermissionClassByKey(key: string): IPermissionClass | null {
    return PERMISSIONS_STORE.get(key) ?? null;
  }

  async updateUserPermission(permissionDto: UpdateUserPermissionsDto) {
    const [ PermissionClass, user ] = await this.verifyUpdateUserPermissionDto(permissionDto);

    let permission = await this.prisma.userPermission.findFirst({
      where: {
        key: permissionDto.permission,
        userId: user.id,
      }
    });

    let permissionActions = new PermissionActions();
    if (permission) {
      permissionActions = PermissionActions.fromString(permission.actions);
    }
    permissionActions.mergeWithDto(permissionDto.actions);

    return await this.prisma.userPermission.upsert({
      where: {
        id: permission?.id
      },
      update: {
        actions: permissionActions.toStr()
      },
      create: {
        key: permissionDto.permission,
        actions: permissionActions.toStr(),
        user: {
          connect: { id: user.id }
        }
      }
    });
  }

  private async verifyUpdateUserPermissionDto(
    dto: UpdateUserPermissionsDto
  ): Promise<[IPermissionClass, User]> {
    const PermissionClass = this.getPermissionClassByKey(dto.permission);
    if (!PermissionClass) {
      throw new PermissionNotFoundException(dto.permission);
    }

    const classActionKeys = Object.keys(PermissionClass.Action);
    dto.actions.forEach(action => {
      if (!classActionKeys.includes(action.action)) {
        throw new ActionIsNotPartOfPermissionException(dto.permission, action.action);
      }
    });

    const user = await this.usersService.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundException(dto.userId);
    }

    return [ PermissionClass, user ];
  }
}
