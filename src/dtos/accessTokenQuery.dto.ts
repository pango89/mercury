import { IsNotEmpty, IsString } from 'class-validator';
export class AccessTokenQueryDto {
  @IsNotEmpty()
  @IsString()
  access_token: string;
}
