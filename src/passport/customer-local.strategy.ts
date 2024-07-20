import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CustomerAuthService } from '../services/customer.auth.service';
import { isEmail, isPhoneNumber } from 'class-validator';
import { ERRORS } from '../configurations/error';

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(
  Strategy,
  'customer-local',
) {
  constructor(private authService: CustomerAuthService) {
    super({ passReqToCallback: true });
  }

  async validate(
    request: any,
    username: string,
    password: string,
  ): Promise<any> {
    // Validate Username - Either Email or Phone Number
    // If Phone Number is supplied, then it will be prefixed with country calling code
    const isValidEmail = isEmail(username); ///^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const isValidPhone = isPhoneNumber(username, null); ///^\+?([0-9]{2})\)?([0-9]{10})$/.test(username);

    if (!isValidEmail && !isValidPhone)
      throw new BadRequestException(ERRORS.INVALID_USERNAME.code);

    try {
      const customer = await this.authService.validateCustomer(
        username,
        password,
      );
      return customer;
    } catch (error) {
      throw error;
    }
  }
}
