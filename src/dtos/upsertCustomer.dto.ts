import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  Matches,
} from 'class-validator';
import {
  OAuthProvider,
  PASSWORD_REGEX,
  defaults,
} from '../configurations/constant';
import { Customer } from '../entities/customer.entity';
import { ERRORS } from '../configurations/error';
import { getHash } from '../utils/crypto.util';
import { generatePassword } from '../utils/passwordGenerator.util';

export class UpsertCustomerDto {
  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @IsString()
  @IsNotEmpty()
  public last_name: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  public country_code: string;

  @IsString()
  @IsNotEmpty()
  // @Matches(new RegExp(PASSWORD_REGEX.UPPER_CASE), {
  //   message: ERRORS.MISSING_UPPER_CASE_PASSWORD.message,
  // })
  // @Matches(new RegExp(PASSWORD_REGEX.SPECIAL_CASE), {
  //   message: ERRORS.MISSING_SPECIAL_CASE_PASSWORD.message,
  // })
  // @Matches(new RegExp(PASSWORD_REGEX.NUMBER), {
  //   message: ERRORS.MISSING_NUMBER_PASSWORD.message,
  // })
  // @Matches(new RegExp(PASSWORD_REGEX.LOWER_CASE), {
  //   message: ERRORS.MISSING_LOWER_CASE_PASSWORD.message,
  // })
  // @Matches(new RegExp(PASSWORD_REGEX.LENGTH), {
  //   message: ERRORS.MISSING_LENGTH_PASSWORD.message,
  // })
  public password: string;

  public toCustomerEntity(provider: OAuthProvider): Customer {
    const customer: Customer = new Customer();
    customer.first_name = this.first_name;
    customer.last_name = this.last_name;
    customer.is_active = false;
    customer.is_email_verified = false;

    if (this.email) {
      customer.email = this.email;
      if (provider === OAuthProvider.GOOGLE) {
        customer.is_email_verified = true;
        customer.is_active = true;
      }
    }

    if (provider === OAuthProvider.MERCURY)
      customer.password_hash = getHash(this.password ?? generatePassword());

    customer.country_code = this.country_code;
    customer.created_at = new Date();
    customer.updated_at = new Date();
    customer.provider = provider;

    return customer;
  }

  // Used in case of OAuth 2.0 Google Login
  public static fromProfileEntity(profile: any): UpsertCustomerDto {
    const customerRegistrationDto = new UpsertCustomerDto();
    customerRegistrationDto.first_name = profile.first_name;
    customerRegistrationDto.last_name = profile.last_name;
    customerRegistrationDto.email = profile.email ?? null;
    customerRegistrationDto.country_code = defaults.country;
    return customerRegistrationDto;
  }
}
