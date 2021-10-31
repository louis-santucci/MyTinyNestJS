import { IsEmail, IsString } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class SigninDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com'
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'write the password given with signup'
  })
  password: string;
}
