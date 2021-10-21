import { IsEmail, IsString } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class SigninDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
  })
  password: string;
}
