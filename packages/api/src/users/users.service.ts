import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserAlreadyExistsException } from 'src/errors';
import { PrismaService } from 'src/prisma/prisma.service';
import UserModel from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async addNew(username: string, hashedPassword: string, superadmin = false) {
    username = username.toLowerCase();

    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new UserAlreadyExistsException(username);
    }

    const user: User = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        superadmin
      }
    });

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    
    return user;
  }

  async superadminExists() {
    const superadmin = await this.prisma.user.findFirst({
      where: { superadmin: true },
      select: { id: true }
    });

    return !!superadmin;
  }
}
