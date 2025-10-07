import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IDatabaseService } from './database.service.interface';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements IDatabaseService, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(DatabaseService.name);

  public async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connected');
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
