import { Exclude, Expose } from "class-transformer";
import { ActionMode } from "../enums/action-mode.enum";

export class PermissionActionDto {
  name: string;
  mode: ActionMode;
}

export interface IPermissionActionDto extends PermissionActionDto {}
