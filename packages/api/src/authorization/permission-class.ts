export interface IPermissionClass extends Function {
  Action: {[key: string]: string},
  Description?: string
}
