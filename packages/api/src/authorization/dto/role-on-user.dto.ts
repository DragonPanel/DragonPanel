export class RoleOnUserDto {
  roleId: string;
  displayName: string;
  name: string;
  userId: string;
  priority?: number | null;
}

export interface IRoleOnUserDto extends RoleOnUserDto {}
