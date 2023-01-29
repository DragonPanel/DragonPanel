import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { hash, compare } from "bcryptjs";
import { InvalidCredentialsException } from 'src/errors';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { createHash } from 'crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async registerUser(username: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.usersService.addNew(username, hashedPassword);
    return user;
  }

  async authenticateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (await this.comparePassword(password, user.password)) {
      return this.signTheDealWithTheDevilWithBloodOfLoggedInUser(user);
    }
  }

  async hashPassword(password: string) {
    return await hash(password, 12);
  }

  async comparePassword(password: string, hashed: string) {
    return await compare(password, hashed);
  }

  signTheDealWithTheDevilWithBloodOfLoggedInUser(blood: User) {
    const theContract = { sub: blood.id };
    return this.jwtService.sign(theContract)
  }

  async revokeJwt(token: string) {
    const decoded = this.jwtService.decode(token);
    let exp: any;
    if (typeof decoded === "string") {
      return;
    } else {
      exp = decoded?.exp;
    }
    const expirationDate = new Date(exp * 1000);
    const jwtHash = createHash("sha256").update(token).digest('hex');
    await this.prisma.revokedJWT.create({
      data: {
        hashedJWT: jwtHash,
        expiration: isNaN(expirationDate.getTime()) ? null : expirationDate
      }
    });
  }

  async isJwtRevoked(token: string) {
    const jwtHash = createHash("sha256").update(token).digest('hex');
    const revoked = await this.prisma.revokedJWT.findFirst({
      where: {
        hashedJWT: jwtHash
      }
    });

    return !!revoked;
  }
}
