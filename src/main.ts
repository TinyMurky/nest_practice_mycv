import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Info: (20240928 - Murky) validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Info: (20240928 - Murky) Json Post進來的時候， 不再dto規定的內容會先被過濾掉
    }),
  );

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
