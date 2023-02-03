import { Inject, Injectable, InternalServerErrorException, Logger, NotImplementedException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

/**
 * Request scoped service to check user permission.
 * 
 * **Requires** authenticated user to work with user.id put into
 * req.user.id. Alternatively you can use method init(userId) to init.
 */
@Injectable({ scope: Scope.REQUEST })
export class UserAuthorizationService {
  constructor(@Inject(REQUEST) req: any) {
    this.init(req.user?.id);
  }

  private userId?: string;
  private logger = new Logger(UserAuthorizationService.name);

  /**
   * Will init service with user id. If userId is in req.user.id
   * you don't have to call this method. It will be initted automatically.
   * @param userId auhenticated user id
   */
  public init(userId: string) {
    this.userId = userId;
  }

  /**
   * Will return boolean indicating whenever user has permission to perform
   * required action or not.
   * 
   * @throws {InternalServerErrorException} if userId is null or undefined
   */
  public async can(action: string): Promise<boolean> {
    this.checkInitializedUser(this.can.name);
    // TODO: Implement
    throw new NotImplementedException();
  }

  /**
   * Will throw an exception if user is not permitted to perform requested operation.
   * Otherwise will return nothing.
   * 
   * @throws {NoPermissionException}
   * @throws {InternalServerErrorException} if userId is null or undefined
   */
  public async must(action: string): Promise<void> {
    this.checkInitializedUser(this.must.name);
    // TODO: Implement
    throw new NotImplementedException();
  }

  private checkInitializedUser(methodName: string) {
    if (!this.userId) {
      this.logger.error(`Tried to use '${methodName}' method without authenticated user. this.userId = ${this.userId}`);
      throw new InternalServerErrorException();
    }
  }
}
