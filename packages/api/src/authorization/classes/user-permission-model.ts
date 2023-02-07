import { ActionMode } from "../enums/action-mode.enum";
import PermissionActions from "./permission-actions.class";

interface IPermissionWithActions {
  key: string;
  actions: PermissionActions;
}

export interface IRoleUserPermissionAssignementData {
  priority: number;
  permissionKey: string;
  actions: string;
}

export class UserPermissionModel {
  private highestPriorityMergedPermission?: IPermissionWithActions;

  public can(actionKey: string) {
    if (!this.highestPriorityMergedPermission) {
      return false;
    }

    const action = this.highestPriorityMergedPermission.actions.findAction(actionKey);
    if (!action) {
      return false;
    }
    return action.mode === ActionMode.Allow;
  }

  /**
   * This function will build highest priority actions for permission.
   * 
   * It accepts role permission with priorities for single permission.
   * 
   * Basically it works like that:
   * - User can have many roles, so it can have the same permission few times
   * - Roles has it priorities
   * - Permission on roles can ***Disallow*** or ***Allow*** something
   * 
   * This function iterates over the same permission that user has taking
   * highest priority number first [so less important, coz higher priority number = lower priority.]
   * and merges it into single PermissionActions class.
   */
  static buildFromDatabaseData(data: IRoleUserPermissionAssignementData[]) {
    // TODO: I will write later unit test for that, I promiseee! ;*
    
    if (data.length === 0) {
      return new this();
    }

    // Little verification
    if (!data.every(entry => entry.permissionKey === data[0].permissionKey)) {
      throw new Error("[FATAL] UserPermissionModel::buildFromDatabaseData got different permission keys in data. This is not allowed!");
    }

    // Data should come sorted by priority desceding from DB but for sanity...
    data.sort((a, b) => b.priority - a.priority);
    
    const mergedPermissionActions = PermissionActions.fromString(data[0].actions);

    data.slice(1).forEach(record => {
      const permissionActions = PermissionActions.fromString(record.actions);
      mergedPermissionActions.merge(permissionActions);
    })

    const inst = new this();
    inst.highestPriorityMergedPermission = {
      key: data[0].permissionKey,
      actions: mergedPermissionActions
    }
    return inst;
  }
}
