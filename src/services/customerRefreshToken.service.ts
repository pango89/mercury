import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import { jwtConstants, jwtVerifyOptions } from '../configurations/constant';
import { CustomerRefreshTokenDto } from '../dtos/refreshToken.dto';
import { CustomerRefreshToken } from '../entities/customerRefreshToken.entity';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerRefreshTokenService {
  private logger: Logger = new Logger('RefreshTokenService');
  constructor(
    private jwtService: JwtService,
    @InjectRepository(CustomerRefreshToken)
    private customerRefreshTokenRepository: Repository<CustomerRefreshToken>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  public async isValidRefreshToken(
    customerRefreshTokenDto: CustomerRefreshTokenDto,
  ): Promise<any> {
    this.logger.log('Checking customer refresh token validity');
    const { customer_id, refresh_token } = customerRefreshTokenDto;
    const decoded = await this.jwtService.verifyAsync(refresh_token, {
      ...jwtVerifyOptions,
    });

    if (customer_id !== decoded.sub) return [false, null];

    const [savedRefreshToken, savedCustomer] = await Promise.all([
      this.customerRefreshTokenRepository.findOne({
        where: {
          customerId: decoded.sub,
          tokenId: decoded.jti,
        },
      }),
      this.customerRepository.findOne({
        where: {
          customerId: decoded.sub,
        },
      }),
    ]);

    if (
      savedCustomer &&
      savedCustomer.is_active &&
      savedRefreshToken &&
      moment(new Date()) < moment(savedRefreshToken.expiry)
    ) {
      return [true, savedCustomer];
    }

    // Deleting refresh token for customer as it is not active anymore or isPhoneNumberVerified is false
    if (!savedCustomer.is_active) {
      this.customerRefreshTokenRepository.delete({
        customerId: customerRefreshTokenDto.customer_id,
      });
      this.logger.log(
        'Refresh token for customer deleted as customer is not active anymore',
      );
    }

    return [false, null];
  }

  public async getRefreshToken(customerId: number): Promise<string> {
    // Delete the Expired Refresh Token Entry
    await this.removeRefreshTokenForCustomer(customerId);

    const customerRefreshTokenId: string = uuidv4();

    const createdAt = new Date();
    const refreshTokenExpiry = moment(createdAt)
      .add(jwtConstants.customerRefreshTokenExpiryInHours, 'hours')
      .toDate();

    const customerRefreshTokenEntity: CustomerRefreshToken =
      new CustomerRefreshToken();
    customerRefreshTokenEntity.customerId = customerId;
    customerRefreshTokenEntity.tokenId = customerRefreshTokenId;
    customerRefreshTokenEntity.createdAt = createdAt;
    customerRefreshTokenEntity.expiry = refreshTokenExpiry;

    await this.customerRefreshTokenRepository.save(customerRefreshTokenEntity);

    const savedRefreshToken = await this.customerRefreshTokenRepository.findOne(
      {
        where: {
          customerId,
        },
      },
    );

    const payload = {
      sub: customerId,
      jti: savedRefreshToken.tokenId,
      exp: savedRefreshToken.expiry.getTime(),
    };
    const refreshToken = this.jwtService.sign(payload);
    return refreshToken;
  }

  public async removeRefreshTokenForCustomer(customerId: number) {
    await this.customerRefreshTokenRepository.delete({
      customerId: customerId,
    });
  }
}
