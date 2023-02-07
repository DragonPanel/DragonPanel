import { ActionUpdateDto } from "../dto/action-update.dto";
import { PermissionActionDto } from "../dto/permission-action.dto";
import { ActionMode } from "../enums/action-mode.enum";
import PermissionAction from "./permission-action.class";

export default class PermissionActions {
  constructor(public actions: PermissionAction[] = []) {}

  toStr(): string {
    return this.actions
      .filter(action => action.mode !== ActionMode.Unset)
      .map(action => action.toStr())
      .join(',');
  }

  findAction(actionName: string) {
    return this.actions.find(a => a.action === actionName);
  }

  toDto(): PermissionActionDto[] {
    return this.actions.map(a => a.toDto());
  }

  static fromString(str: string): PermissionActions {
    return new PermissionActions(str.split(',').map(a => PermissionAction.fromString(a)));
  }

  mergeWithUpdateDto(dtos: ActionUpdateDto[]) {
    dtos.forEach(dto => {
      // First we will delete action from collection if it exists in dto
      this.actions = this.actions.filter(a => a.action !== dto.action);

      // If dto mode is unset then we will just return
      if (dto.mode === ActionMode.Unset) {
        return;
      }

      // Otherwise we will add an action
      this.actions.push(PermissionAction.fromUpdateDto(dto));
    });
  }

  /**
   * Will merge permission actions with another permissions actions overriding
   * actions on current instance. This method will ignore actions with mode
   * `ActionMode.Unset`.
   */
  merge(other: PermissionActions) {
    other.actions.forEach(action => {
      if (action.mode === ActionMode.Unset) {
        return;
      }

      this.actions = this.actions.filter(a => a.action !== action.action);

      this.actions.push(action);
    });
  }
}
