import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CustomerRefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  public refresh_token: string;

  @IsNotEmpty()
  @IsNumber()
  public customer_id: number;
}

export class RefreshTokenResponseDto {
  public access_token: string;
  public access_token_expiry: number;
}
