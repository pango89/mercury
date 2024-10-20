import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { AuthModule } from './modules/auth.module';
import { RefreshTokenModule } from './modules/refreshToken.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './modules/customers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MERCURY_DB_HOST,
      port: +process.env.MERCURY_DB_PORT,
      username: process.env.MERCURY_DB_USERNAME,
      password: process.env.MERCURY_DB_PASSWORD,
      database: process.env.MERCURY_DB_DATABASE,
      entities: ['src/**/*.entity{.ts,.js}'],
      logging: true,
      synchronize: false,
    }),
    HealthModule,
    AuthModule,
    RefreshTokenModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
