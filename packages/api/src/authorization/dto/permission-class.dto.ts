export class PermissionClassDto {
  name: string;
  className: string;
  description?: string;
  key: string;
}

export interface IPermissionClassDto extends PermissionClassDto {}
