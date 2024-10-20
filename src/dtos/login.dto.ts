import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerLoginDto {
  @ApiProperty({})
  @IsNotEmpty()
  public username: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  public password: string;
}
