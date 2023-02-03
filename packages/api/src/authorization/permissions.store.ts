import { IPermissionClass } from "./permission-class";

type PermissionKey = string;

export const PERMISSIONS_STORE: Map<PermissionKey, IPermissionClass> = new Map();
