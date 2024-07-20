/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerRefreshTokenService } from './customerRefreshToken.service';
import { OAuthProvider, jwtConstants } from '../configurations/constant';
import { Customer } from '../entities/customer.entity';
import { CustomerLoginResponseDto } from '../dtos/loginResponse.dto';
import { CustomersService } from './customers.service';
import {
  CustomerRefreshTokenDto,
  RefreshTokenResponseDto,
} from '../dtos/refreshToken.dto';
import { ERRORS } from '../configurations/error';
import { UpsertCustomerDto } from '../dtos/upsertCustomer.dto';
import { getHash } from '../utils/crypto.util';

@Injectable()
export class CustomerAuthService {
  private logger: Logger = new Logger('CustomerAuthService');
  constructor(
    private jwtService: JwtService,
    private customerRefreshTokenService: CustomerRefreshTokenService,
    private customersService: CustomersService,
  ) {}

  public async signup(
    customerRegistrationDto: UpsertCustomerDto,
    oAuthProvider: OAuthProvider = OAuthProvider.MERCURY,
  ): Promise<Customer> {
    this.logger.debug(
      `Entered customer auth service signup(${JSON.stringify(
        customerRegistrationDto,
      )})`,
    );

    // Save customer to DB
    const createdCustomer: Customer = await this.customersService.addCustomer(
      customerRegistrationDto,
      oAuthProvider,
    );

    // If Email is present then send verification email.
    // try {
    //   if (createdCustomer.email) {
    //     this.customersService.sendVerificationEmail(
    //       createdCustomer,
    //       customerRegistrationDto.isRegistrationFromWebApp,
    //       customerRegistrationDto.password,
    //       corporatePartnerGroup,
    //     );
    //   }
    //   this.logger.log(
    //     `Customer with email id = ${createdCustomer.email} signed up successfully.)`,
    //   );
    // } catch (error) {
    //   this.logger.log(error);
    // }
    this.logger.debug(`Exited customer auth service signup()`);
    return createdCustomer;
  }

  public async findOrAddCustomer(
    profile: any,
    provider: OAuthProvider,
  ): Promise<Customer> {
    const customer: Customer = await this.customersService.getCustomerByEmail(
      profile.email,
    );

    if (customer) {
      if (customer.is_active) return customer;
      await this.customersService.activateCustomer(customer.customerId);
      return customer;
    }

    const customerRegistrationDto =
      UpsertCustomerDto.fromProfileEntity(profile);

    try {
      const createdCustomer: Customer = await this.customersService.addCustomer(
        customerRegistrationDto,
        provider,
      );

      await this.customersService.activateCustomer(createdCustomer.customerId);
      return createdCustomer;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async login(customer: any): Promise<CustomerLoginResponseDto> {
    this.logger.debug(
      `Entered customer auth service customer login(${JSON.stringify(
        customer,
      )})`,
    );
    const loginResponseDto = await this.loginUtil(customer);
    this.logger.debug(`Exited customer auth service customer login`);
    return loginResponseDto;
  }

  private async loginUtil(customer: any): Promise<CustomerLoginResponseDto> {
    const payload = {
      sub: customer.customerId,
    };
    this.logger.log(`Customer(${customer.email} logged in successfully.)`);

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.customerAccessTokenExpiry,
    });
    const exp = this.jwtService.decode(accessToken)['exp'];

    const loginResponseDto: CustomerLoginResponseDto =
      new CustomerLoginResponseDto();
    loginResponseDto.customer_id = customer.customerId;
    loginResponseDto.email = customer.email ?? null;
    loginResponseDto.access_token = accessToken;
    loginResponseDto.refreshToken =
      await this.customerRefreshTokenService.getRefreshToken(
        customer.customerId,
      );

    loginResponseDto.access_token_expiry = exp;
    return loginResponseDto;
  }

  public async issueAccessToken(
    customerRefreshTokenDto: CustomerRefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    const [isRefreshTokenValid, customer]: [boolean, Customer] =
      await this.customerRefreshTokenService.isValidRefreshToken(
        customerRefreshTokenDto,
      );

    if (isRefreshTokenValid) {
      const payload = {
        sub: customer.customerId,
      };

      const accessToken = this.jwtService.sign(payload);
      const exp = this.jwtService.decode(accessToken)['exp'];
      return {
        access_token: accessToken,
        access_token_expiry: exp,
      };
    } else {
      throw new UnauthorizedException(ERRORS.INVALID_REFRESH_TOKEN.code);
    }
  }

  public async validateCustomer(
    username: string,
    password: string,
  ): Promise<any> {
    this.logger.debug(
      `Entered customer auth service validateCustomer(username: ${username})`,
    );

    const customer: Customer =
      await this.customersService.getCustomerByEmail(username);

    if (!customer) {
      this.logger.error(`Customer(${username}) does not exist`);
      throw new BadRequestException(ERRORS.CUSTOMER_NOT_FOUND.code);
    }

    if (!customer.is_active)
      throw new InternalServerErrorException(ERRORS.CUSTOMER_INACTIVE.code);

    if (customer.password_hash !== getHash(password)) {
      this.logger.error(`Invalid password supplied for customer(${username}.)`);
      throw new UnauthorizedException(ERRORS.INVALID_CUSTOMER_PASSWORD.code);
    }

    this.logger.log(`Customer(${username}} validated.)`);
    const { password_hash, is_active, updated_at, ...result } = customer;
    this.logger.debug(
      `Exited customer auth service validateCustomer() with valid customer`,
    );
    return result;
  }

  public async logout(customerId: number) {
    await this.customerRefreshTokenService.removeRefreshTokenForCustomer(
      customerId,
    );
  }
}
