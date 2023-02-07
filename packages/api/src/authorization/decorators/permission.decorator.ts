import { IPermissionClass } from "../permission-class";

export const DECORATED_PERMISSION_KEY = Symbol("decoratedPermission");
export const PERMISSION_KEY_KEY = Symbol("permissionKey");

/**
 * Marks class as a permission class.
 * @param permissionKey Should be an unique permission key.
 * It would be the best to use something like `com.example.users.createUser`
 * @returns 
 */
export const Permission = (permissionKey: string) => {
  return (constructor: IPermissionClass) => {
    Reflect.defineMetadata(DECORATED_PERMISSION_KEY, true, constructor);
    Reflect.defineMetadata(PERMISSION_KEY_KEY, permissionKey, constructor);
  }
}
