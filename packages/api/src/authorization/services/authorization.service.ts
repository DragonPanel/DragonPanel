/**
 * See docs/authorization.md at the root of the project to learn more of
 * how this work.
 */

import { Injectable, NotImplementedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ActionIsNotPartOfPermissionException, PermissionNotFoundException, PermissionNotFoundOnRoleException, RoleAlreadyAssignedException, RoleAlreadyExistsException, RoleNotFoundException, UserNotFoundException } from 'src/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ActionOperation, ActionUpdateDto } from "../dto/action-update.dto";
import { CreateRoleDto } from '../dto/create-role.dto';
import { IPermissionClassDto } from '../dto/permission-class.dto';
import { IRoleOnUserDto } from '../dto/role-on-user.dto';
import { UpdateRolePermission } from '../dto/update-role-permission';
import { UpdateRoleDto } from '../dto/update-role.dto';
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
  
  async listRoles() {
    return await this.prisma.role.findMany();
  }

  async listRolesOnUser(userId: string): Promise<IRoleOnUserDto[]> {
    const roleAssignements = await this.prisma.roleOnUser.findMany({
      where: {
        userId
      },
      select: {
        priority: true,
        role: {
          select: {
            id: true,
            name: true,
            displayName: true
          }
        }
      }
    });

    return roleAssignements.map(ra => ({
      roleId: ra.role.id,
      name: ra.role.name,
      displayName: ra.role.displayName,
      priority: ra.priority,
      userId: userId
    }));
  }

  async findRoleById(id: string) {
    return await this.prisma.role.findUnique({
      where: { id }
    });
  }

  async findRoleByName(name: string) {
    const lowered = name.toLowerCase();
    return await this.prisma.role.findUnique({
      where: { name: lowered }
    });
  }

  async createRole(dto: CreateRoleDto) {
    const role = await this.findRoleByName(dto.name);
    if (role) {
      throw new RoleAlreadyExistsException(dto.name);
    }

    await this.prisma.role.create({ data: {
      name: dto.name.toLowerCase(),
      displayName: dto.name
    }});
  }

  async deleteRole(id: string) {
    const role = await this.prisma.role.delete({
      where: { id }
    });

    if (!role) {
      throw new RoleNotFoundException(id);
    }
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const existingRole = await this.findRoleByName(dto.name);
    if (existingRole) {
      throw new RoleAlreadyExistsException(dto.name);
    }
    const role = await this.prisma.role.update({
      where: { id },
      data: { name: dto.name.toLowerCase(), displayName: dto.name }
    });

    return role;
  }

  async updateRolePermission(permissionDto: UpdateRolePermission) {
    const [ PermissionClass, role ] = await this.verifyUpdateRolePermissionDto(permissionDto);

    let permission = await this.prisma.rolePermission.findFirst({
      where: {
        key: permissionDto.permission,
        roleId: role.id,
      }
    });

    let permissionActions = new PermissionActions();
    if (permission) {
      permissionActions = PermissionActions.fromString(permission.actions);
    }
    permissionActions.mergeWithDto(permissionDto.actions);

    return await this.prisma.rolePermission.upsert({
      where: {
        id: permission?.id
      },
      update: {
        actions: permissionActions.toStr()
      },
      create: {
        key: permissionDto.permission,
        actions: permissionActions.toStr(),
        role: {
          connect: { id: role.id }
        }
      }
    });
  }

  async deletePermissionFromRole(permissionKey: string, roleId: string) {
    const permission = await this.prisma.rolePermission.delete({
      where: {
        keyrole: {
          key: permissionKey,
          roleId: roleId
        }
      }
    });
    
    if (!permission) {
      throw new PermissionNotFoundOnRoleException(permissionKey, roleId);
    }
  }

  async addRoleToUser(userId: string, roleId: string): Promise<IRoleOnUserDto> {
    const role = await this.findRoleById(roleId);
    if (!role) {
      throw new RoleNotFoundException(roleId);
    }
    
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    // TODO: Test which is faster way of checking if record exists.
    const existingAssignement = await this.prisma.roleOnUser.count({
      where: { userId, roleId }
    });

    if (existingAssignement) {
      throw new RoleAlreadyAssignedException(role.displayName, user.username);
    }

    const lastAssignedRole = await this.prisma.roleOnUser.findFirst({
      select: { priority: true },
      where: { userId },
      orderBy: { priority: "desc" }
    });

    let newPriority = 1;
    if (lastAssignedRole) {
      newPriority = lastAssignedRole.priority + 1;
    }

    const assignement = await this.prisma.roleOnUser.create({
      select: { priority: true },
      data: {
        role: { connect: { id: role.id } },
        user: { connect: { id: user.id } },
        priority: newPriority
      }
    });

    return {
      roleId: role.id,
      userId: user.id,
      name: role.name,
      displayName: role.displayName,
      priority: assignement.priority
    }
  }

  async deleteRoleFromUser(userId: string, roleId: string) {
    // TODO:
    throw new NotImplementedException();
  }

  private async verifyUpdateRolePermissionDto(
    dto: UpdateRolePermission
  ): Promise<[IPermissionClass, Role]> {
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

    const role = await this.findRoleById(dto.roleId);
    if (!role) {
      throw new RoleNotFoundException(dto.roleId);
    }

    return [ PermissionClass, role ];
  }
}
