import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule, { cors: true, origin: 'https://api.spamjacket.kpd.nomorepartiesco.ru' });
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();
