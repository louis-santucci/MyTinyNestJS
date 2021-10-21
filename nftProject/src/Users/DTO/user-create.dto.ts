import { IsEmail, IsString, Matches } from 'class-validator';
import { Role } from '.prisma/client';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class UserCreateDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the user',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
  })
  email: string;

  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'The blockchain address is invalid',
  })
  @ApiProperty({
    description: 'The blockchain address of the user',
  })
  blockchainAddress: string;

  @IsString()
  @ApiProperty({
    description: 'The role of the user',
    type: Role,
  })
  role: Role;

  @IsString()
  @ApiProperty({
    description: 'The password of the user',
  })
  password: string;
}
