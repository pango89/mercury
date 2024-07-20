import { Logger, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenModule } from './refreshToken.module';
import { CustomerAuthService } from '../services/customer.auth.service';
import { CustomersModule } from './customers.module';
import { GoogleStrategy } from '../passport/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '..//configurations/constant';
import { CustomerAuthController } from '../controllers/customer.auth.controller';
import { CustomerLocalStrategy } from '../passport/customer-local.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: jwtConstants.customerAccessTokenExpiry,
        algorithm: 'HS256',
        issuer: jwtConstants.issuer,
        jwtid: jwtConstants.jwtIdForAccessToken,
      },
    }),
    RefreshTokenModule,
    CustomersModule,
  ],
  providers: [
    Logger,
    CustomerAuthService,
    GoogleStrategy,
    CustomerLocalStrategy,
  ],
  exports: [CustomerAuthService],
  controllers: [CustomerAuthController],
})
export class AuthModule {}
