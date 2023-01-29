import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("/api");

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector, {
    excludeExtraneousValues: true
  }));

  await app.listen(1337);
}
bootstrap();
