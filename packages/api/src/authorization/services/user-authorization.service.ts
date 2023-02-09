import { Inject, Injectable, InternalServerErrorException, Logger, NotImplementedException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { NoPermissionException, UserNotFoundException } from 'src/errors';
import { UsersService } from 'src/users/users.service';
import { IPermissionClass } from '../permission-class';
import { AuthorizationService } from './authorization.service';

/**
 * Request scoped service to check user permission.
 * 
 * **Requires** authenticated user to work with user.id put into
 * req.user.id. Alternatively you can use method init(userId) to init.
 */
@Injectable({ scope: Scope.REQUEST })
export class UserAuthorizationService {
  constructor(
    @Inject(REQUEST) private req: any,
    private authorizationService: AuthorizationService
  ) {}

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

  private extractUserIdFromReq() {
    this.init(this.req.user?.id);
  }

  /**
   * Will return boolean indicating whenever user has permission to perform
   * required action or not.
   * 
   * @throws {InternalServerErrorException} if userId is null or undefined
   */
  public async can(permission: IPermissionClass): Promise<boolean> {
    if (!this.userId) {
      this.extractUserIdFromReq();
    }
    this.checkInitializedUser(this.can.name);
    
    return await this.authorizationService.isUserAllowedTo(this.userId!, permission);
  }

  /**
   * Will throw an exception if user is not permitted to perform requested operation.
   * Otherwise will return nothing.
   * 
   * @throws {NoPermissionException}
   * @throws {InternalServerErrorException} if userId is null or undefined
   */
  public async must(permission: IPermissionClass): Promise<void> {
    if (await this.can(permission)) {
      return;
    }
    throw new NoPermissionException();
  }

  private checkInitializedUser(methodName: string) {
    if (!this.userId) {
      this.logger.error(`Tried to use '${methodName}' method without authenticated user. this.userId = ${this.userId}`);
      throw new InternalServerErrorException();
    }
  }
}
