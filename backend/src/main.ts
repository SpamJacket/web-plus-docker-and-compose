import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import cors from 'cors';
import { type Request } from 'express';

import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const corsWhiteList = ['https://spamjacket.kpd.nomorepartiesco.ru'];

  const corsOptionsDelegate = function (req: Request, callback) {
    let corsOptions: { origin: boolean };

    if (corsWhiteList.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true };
    } else {
      corsOptions = { origin: false };
    }

    callback(null, corsOptions);
  };

  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  app.use(cors(corsOptionsDelegate));

  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();
