export interface IPermissionClass extends Function {
  Action: {[key: string]: string},
}

export const Permission = () => {
  return (constructor: IPermissionClass) => {
    for (const [key, val] of Object.entries(constructor.Action)) {
      constructor.Action[key] = `${constructor.name}::${val}`
    }
    Reflect.defineMetadata("decoratedPermission", true, constructor);
  }
}
