import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Auth JWT')
    .setDescription('Auth JWT API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: '/docs-json',
    yamlDocumentUrl: '/docs-yaml',
    customSiteTitle: 'Auth JWT API',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
