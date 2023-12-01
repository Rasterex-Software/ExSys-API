import { ConfigService } from '@nestjs/config';
import { Injectable, Inject } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('PG_DATABASE_HOST'),
      port: this.config.get<number>('PG_DATABASE_PORT'),
      database: this.config.get<string>('PG_DATABASE_NAME'),
      username: this.config.get<string>('PG_DATABASE_USER'),
      password: this.config.get<string>('PG_DATABASE_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'simple-console',
      // ssl: { ca: process.env.SSL_CERT, rejectUnauthorized: false },
      // never use TRUE in production!
      synchronize: false,
      migrationsRun: false,
    };
  }
}
