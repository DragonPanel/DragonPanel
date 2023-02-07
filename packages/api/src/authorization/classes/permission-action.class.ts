import { ActionUpdateDto } from "../dto/action-update.dto";
import { PermissionActionDto } from "../dto/permission-action.dto";
import { ActionMode } from "../enums/action-mode.enum";

export default class PermissionAction {
  constructor(public action: string, public mode: ActionMode) {}

  static fromString(str: string): PermissionAction {
    if (str.startsWith("!")) {
      return new this(str.substring(1), ActionMode.Disallow);
    }
    return new this(str, ActionMode.Allow);
  }

  static fromUpdateDto(dto: ActionUpdateDto) {
    return new this(dto.action, dto.mode);
  }

  toStr(): string {
    switch(this.mode) {
      case ActionMode.Allow:
        return this.action;
      case ActionMode.Disallow:
        return `!${this.action};`
      default:
        return '';
    }
  }

  toDto(): PermissionActionDto {
    const dto = new PermissionActionDto();
    dto.mode = this.mode;
    dto.name = this.action;
    return dto;
  }
}
