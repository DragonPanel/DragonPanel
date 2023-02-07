/**
 * See docs/authorization.md at the root of the project to learn more of
 * how this work.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PermissionNotFoundOnRoleException, RoleAlreadyAssignedException, RoleAlreadyExistsException, RoleNotFoundException, RoleOnUserNotFoundException, UserNotFoundException } from 'src/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { PERMISSION_KEY_KEY } from '../decorators/permission.decorator';
import { CreateRoleDto } from '../dto/create-role.dto';
import { IPermissionClassDto } from '../dto/permission-class.dto';
import { IRoleOnUserDto } from '../dto/role-on-user.dto';
import RolePermissionDto from '../dto/role-permission.dto';
import { SetPermissionDto } from '../dto/set-permission.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PermissionMode } from '../enums/permission-mode';
import { IPermissionClass } from '../permission-class';
import { PERMISSIONS_STORE } from '../permissions.store';

@Injectable()
export class AuthorizationService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService
  ) {}

  readonly logger = new Logger(this.constructor.name);

  listPermissionClasses(): IPermissionClassDto[] {
    return Array.from(PERMISSIONS_STORE.entries())
      .map(([key, permission]) => ({
        className: permission.name,
        name: permission.Name ?? permission.name,
        key,
        description: permission.Description
      }));
  }

  
  async isUserAllowedTo(userId: string, permission: IPermissionClass): Promise<boolean> {
    const key = this.getPermissionKeyFromClass(permission);
    if (!key) {
      this.logger.error(`Permission class ${permission.name} is not decorated with Permission decorator so it's not valid. This should be fixed.`);
      this.logger.warn(`Can't check permission for class ${permission.name} coz it's not decorated with @Permission. Returing no permission.`);
      return false;
    }

    const highestPriorityPermissionRaw = await this.prisma.$queryRaw<{ key: string, mode: string } | null>`
      SELECT RolePermission.key [key], RolePermission.mode [mode]
      FROM RolePermission
      INNER JOIN Role
          ON Role.id = RolePermission.roleId
      INNER JOIN RoleOnUser
          ON RoleOnUser.roleId = Role.id
      WHERE RoleOnUser.userId = ${userId}
      AND RolePermission.key = ${key}
      ORDER BY RoleOnUser.priority DESC
      LIMIT 1
    `;

    if (highestPriorityPermissionRaw) {
      return highestPriorityPermissionRaw.mode === PermissionMode.Allow;
    }
    return false;
  }

  getPermissionClassByKey(key: string): IPermissionClass | null {
    return PERMISSIONS_STORE.get(key) ?? null;
  }
  
  getPermissionKeyFromClass(permission: IPermissionClass): string | null {
    return Reflect.getMetadata(PERMISSION_KEY_KEY, permission) as string ?? null;
  }

  async listRoles() {
    return await this.prisma.role.findMany();
  }

  async listPermissionsOnRole(roleId: string): Promise<RolePermissionDto[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { roleId }
    });

    return rolePermissions.map(rolePerm => ({
      id: rolePerm.id,
      key: rolePerm.key,
      mode: PermissionMode[rolePerm.mode as keyof typeof PermissionMode]
    }))
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

  async setPermissionOnRole(roleId: string, dto: SetPermissionDto) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      throw new RoleNotFoundException(roleId);
    }
    
    const updated = await this.prisma.rolePermission.upsert({
      where: { keyrole: { key: dto.key, roleId: role.id } },
      create: {
        role: { connect: { id: role.id } },
        key: dto.key,
        mode: dto.mode
      },
      update: {
        mode: dto.mode
      }
    });

    return updated;
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
    const role = await this.prisma.roleOnUser.delete({
      where: {
        roleId_userId: {
          roleId, userId
        }
      }
    });

    if (!role) {
      throw new RoleOnUserNotFoundException(roleId, userId);
    }
  }
}
