# Dragon Panel Authorization System
v.0.1.0

## Permision classes
To make a permission for feature you just define class and decorate it with Permission decorator providing permission key. Please use `com.example.feature.permission` format, so permission keys won't be duplicated. For built in DragonPanel permission it's `net.dragonpanel.feature.permission`.

Example of permission class:
```ts
import { Permission } from "src/authorization/decorators/permission.decorator";

@Permission("net.dragonpanel.systemd.unitPermission")
export default class UnitPermission {
  static Action = {
    List: "list",
    Load: "load",
    Start: "start",
    Stop: "stop",
    Restart: "restart"
  }

  static Description = "Permission for systemd units."
}
```
If you're curious how it works under the hood check [Under the hood](#under-the-hood) section.

## Checking permission
You can use request scoped `UserAutorizationService` to check if user has a permission with desired action. It will try to grab `userId` from `req.user.id`. If it's undefined you can init it manually with `init(userId: string)` method.

There's 2 methods for checking permissions:
- `async can(action): Promise<boolean>` - will return true if user has permission to perform an action, otherwise false. Use it like that: `can(<PermissionClass>.Action.<Action>)`
   Example:
   ```ts
    const canDo = await userAuth.can(UnitPermission.Action.List);
    if (!canDo) {
        throw new ForbiddenException();
    }
    // Rest of logic
   ```
- `async must(action): Promise<void>` - works almost the same as `can` but it will throw a `NoPermissionException`, which extends `HttpExpection` with `403 - Forbidden` code, if user has no permissions to perform an action.
   Example:
   ```ts
    await userAuth.must(UnitPermission.Action.List);
    // Rest of logic
   ```

## User Permissions
TODO

## Roles
TODO

## Permissions order

## Under the hood
### Permission Classes
`Permission` decorator modifies class static `Action` members, so actions contain also permission key. An example:

Consider this permission class:
```ts
import { Permission } from "src/authorization/decorators/permission.decorator";

@Permission("net.dragonpanel.systemd.unitPermission")
export default class UnitPermission {
  static Action = {
    List: "list",
    Load: "load",
    Start: "start",
    Stop: "stop",
    Restart: "restart"
  }

  static Description = "Permission for systemd units."
}
```
`Permission` decorator modifies `Action` static member so now Action is:
```ts
static Action = {
    List: "net.dragonpanel.systemd.unitPermission::list",
    Load: "net.dragonpanel.systemd.unitPermission::load",
    Start: "net.dragonpanel.systemd.unitPermission::start",
    Stop: "net.dragonpanel.systemd.unitPermission::stop",
    Restart: "net.dragonpanel.systemd.unitPermission::restart"
}
```
This allows to check permission by only passing an action to the method `can` or `must`.

### Storing permissions
Permissions are stored in 2 tables in the database.
It's `UserPermission` and `RolePermission`, they're assigned, well as name suggest, either to User or Role.

The model looks like this:
```prisma
model UserPermission {
  id         String   @id @default(uuid())
  key        String
  // Actions in form of string separated with commas: Read,!Write
  // '!' means disallow 
  actions    String
  assignedAt DateTime @default(now())
  assignedBy String?
  user       User     @relation(fields: [userId], references: [id])
  userId     String
}
```
And most important: actions has 2 modes - allow and disallow. They're stored in string for simplicity, separated with comma. If action is allowed then here's only it's name, if it's disallowed it will be `!<name>`.  
Example: `Read,!Write,List,!Delete` means "Allow read and list, disallow write and delete".
