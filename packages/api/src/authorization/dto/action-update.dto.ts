import { IsEnum, IsIn, IsNotEmpty, IsString } from "class-validator";

export enum ActionOperation {
  /**
   * Allows to perform an action
   */
  Allow = "allow",
  /**
   * Forbids to perform an action
   */
  Disallow = "disallow",
  /**
   * Usets an action, restores it to default state
   */
  Unset = "unset"
}

export class ActionUpdateDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsEnum(ActionOperation)
  operation: ActionOperation;
}

export interface IActionUpdateDto extends ActionUpdateDto {}
