import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../configurations/constant';
import { CustomerRefreshTokenService } from '../services/customerRefreshToken.service';
import { CustomerRefreshToken } from '../entities/customerRefreshToken.entity';
import { Customer } from '../entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerRefreshToken, Customer]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        algorithm: 'HS256',
        issuer: jwtConstants.issuer,
      },
    }),
  ],
  providers: [CustomerRefreshTokenService, Logger],
  exports: [CustomerRefreshTokenService],
})
export class RefreshTokenModule {}
