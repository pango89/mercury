import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../entities/customer.entity';
import { CustomersService } from '../services/customers.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../configurations/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: jwtConstants.customerAccessTokenExpiry,
        algorithm: 'HS256',
        issuer: jwtConstants.issuer,
        jwtid: jwtConstants.jwtIdForAccessToken,
      },
    }),
  ],
  providers: [CustomersService, Logger],
  exports: [CustomersService],
})
export class CustomersModule {}
