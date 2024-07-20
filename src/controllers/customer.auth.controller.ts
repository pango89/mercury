/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GoogleTokenAuthGuard } from '../guards/google-token-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  CustomerRefreshTokenDto,
  RefreshTokenResponseDto,
} from '../dtos/refreshToken.dto';
import { CustomerAuthService } from '../services/customer.auth.service';
import { AccessTokenQueryDto } from '../dtos/accessTokenQuery.dto';
import { CustomerLoginResponseDto } from '../dtos/loginResponse.dto';
import { CustomerLocalAuthGuard } from '../guards/customer-local-auth.guard';
import { CustomerLoginDto } from '../dtos/login.dto';
import { UpsertCustomerDto } from '../dtos/upsertCustomer.dto';

@ApiTags('Customer Auth')
@Controller('auth/customer')
export class CustomerAuthController {
  constructor(private authService: CustomerAuthService) { }

  @Post('signup')
  public async signup(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    customerRegistrationDto: UpsertCustomerDto,
  ): Promise<void> {
    await this.authService.signup(customerRegistrationDto);
  }

  @UseGuards(CustomerLocalAuthGuard)
  @Post('login')
  public async login(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    customerLoginDto: CustomerLoginDto,
  ): Promise<CustomerLoginResponseDto> {
    return this.authService.login(req.user);
  }

  @UseGuards(GoogleTokenAuthGuard)
  @Post('google-login')
  public async googleLogin(
    @Request() req: any,
    @Query(new ValidationPipe({ transform: true }))
    query: AccessTokenQueryDto,
  ): Promise<CustomerLoginResponseDto> {
    return this.authService.login(req.user);
  }

  @Post('refreshToken')
  public async refreshToken(
    @Body(new ValidationPipe({ transform: true }))
    customerRefreshTokenDto: CustomerRefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.issueAccessToken(customerRefreshTokenDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  public async logout(@Request() req: any): Promise<void> {
    const { sub: customerId } = req.user;
    await this.authService.logout(customerId);
  }
}
