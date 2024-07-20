import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerLoginDto {
  @IsNotEmpty()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
