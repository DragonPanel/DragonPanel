export class PermissionClassDto {
  name: string;
  description?: string;
  key: string;
  actions: string[];
}

export interface IPermissionClassDto extends PermissionClassDto {}
