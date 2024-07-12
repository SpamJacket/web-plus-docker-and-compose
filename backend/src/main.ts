import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.enableCors({
    origin: "https://https://spamjacket.kpd.nomorepartiesco.ru",
  });

  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();
