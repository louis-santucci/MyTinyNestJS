import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'The id of the user',
    example: 1
  })
  id: number;

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com'
  })
  email: string;
}
