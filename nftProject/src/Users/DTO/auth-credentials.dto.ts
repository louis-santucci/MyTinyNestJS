import { IsEmail, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the user',
    example: 'testName'
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com'
  })
  email: string;

  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'The blockchain address is invalid',
  })
  @ApiProperty({
    description: 'The blockchain address of the user',
    example: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  })
  blockchainAddress: string;
}
