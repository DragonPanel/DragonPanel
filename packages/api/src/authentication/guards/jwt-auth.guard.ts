import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private authService: AuthenticationService,
    private reflector: Reflector
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    const isRevoked = await this.authService.isJwtRevoked(token);
    if (isRevoked) {
      throw new UnauthorizedException();
    }

    const result = super.canActivate(context);
    if (result instanceof Observable) {
      return await firstValueFrom(result);
    } else {
      return result;
    }
  }
}
