import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ActionMode } from "../enums/action-mode.enum";

export class ActionUpdateDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  /**
   * Allow, Disallow, Unset
   */
  @IsEnum(ActionMode)
  mode: ActionMode;
}

export interface IActionUpdateDto extends ActionUpdateDto {}
