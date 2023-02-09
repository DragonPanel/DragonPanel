export class RoleOnUserDto {
  roleId: string;
  userId: string;
  priority: number;
  name: string;
  displayName: string;
}

export interface IRoleOnUserDto extends RoleOnUserDto {}
